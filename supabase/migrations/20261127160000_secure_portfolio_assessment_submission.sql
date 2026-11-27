
-- 961-Dev: Secure Personal Portfolio assessment grading
-- Preserve existing assessment content and progress.

begin;

-- Store the learner's score alongside completion.
-- Nullable columns preserve any existing records.
alter table public.assessment_progress
  add column correct_answers integer,
  add column total_questions integer,
  add constraint assessment_progress_valid_score
    check (
      (correct_answers is null and total_questions is null)
      or (
        correct_answers is not null
        and total_questions is not null
        and total_questions > 0
        and correct_answers >= 0
        and correct_answers <= total_questions
      )
    );

-- Prevent learners from creating fabricated assessment
-- completion records through direct table inserts.
-- All submission must go through our secure function.
revoke insert on public.assessment_progress
  from authenticated, anon, public;


-- Grade inside PostgreSQL, where the answer key
-- is accessible without exposing it to the browser.
create function public.submit_portfolio_assessment(
  p_option_ids bigint[]
)
returns table (
  correct_answers integer,
  total_questions integer,
  already_completed boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_project_id bigint;
  v_assessment_id bigint;

  v_total integer;
  v_mission_count integer;
  v_matched_options integer;
  v_answered_questions integer;
  v_score integer;

  v_saved_correct integer;
  v_saved_total integer;
begin

  -- 1. Authentication is always established from
  -- the request's verified Supabase identity.
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Please sign in first.';
  end if;

  -- 2. Locate only the Personal Portfolio assessment.
  select p.id, a.id
  into v_project_id, v_assessment_id
  from public.projects p
  join public.technologies t
    on t.id = p.technology_id
  join public.assessments a
    on a.project_id = p.id
  where p.slug = 'personal-portfolio'
    and t.slug = 'html-css-js';

  if v_assessment_id is null then
    raise exception 'Assessment not found.';
  end if;

  -- 3. Verify the assessment's question count.
  select count(*)
  into v_total
  from public.assessment_questions q
  where q.assessment_id = v_assessment_id;

  if v_total <> 3 then
    raise exception 'Assessment configuration is invalid.';
  end if;

  -- 4. All project missions must be officially completed.
  select count(*)
  into v_mission_count
  from public.levels l
  join public.missions m
    on m.level_id = l.id
  where l.project_id = v_project_id;

  if v_mission_count = 0 then
    raise exception 'Project missions are not configured.';
  end if;

  if exists (
    select 1
    from public.levels l
    join public.missions m
      on m.level_id = l.id
    where l.project_id = v_project_id
      and not exists (
        select 1
        from public.mission_progress mp
        where mp.user_id = v_user_id
          and mp.mission_id = m.id
      )
  ) then
    raise exception
      'Complete all project missions before the assessment.';
  end if;

  -- 5. An already submitted assessment keeps its
  -- original saved result, even after refresh.
  select ap.correct_answers, ap.total_questions
  into v_saved_correct, v_saved_total
  from public.assessment_progress ap
  where ap.user_id = v_user_id
    and ap.assessment_id = v_assessment_id;

  if found then
    if v_saved_correct is null or v_saved_total is null then
      raise exception
        'Existing assessment result needs administrator review.';
    end if;

    return query
      select v_saved_correct, v_saved_total, true;

    return;
  end if;

  -- 6. Require exactly one answer per question.
  if p_option_ids is null
     or cardinality(p_option_ids) <> v_total then
    raise exception 'Answer all three questions.';
  end if;

  -- Match submitted option IDs to their questions.
  -- Correct answers remain private inside this function.
  select
    count(*),
    count(distinct q.id),
    count(*) filter (where o.is_correct)
  into
    v_matched_options,
    v_answered_questions,
    v_score
  from unnest(p_option_ids) as selected(option_id)
  join public.assessment_options o
    on o.id = selected.option_id
  join public.assessment_questions q
    on q.id = o.question_id
  where q.assessment_id = v_assessment_id;

  -- Reject invalid options, duplicate questions,
  -- or answers from a different assessment.
  if v_matched_options <> v_total
     or v_answered_questions <> v_total then
    raise exception
      'Choose one valid answer for each question.';
  end if;

  -- 7. Save the official assessment result.
  -- The unique primary key prevents duplicate attempts.
  insert into public.assessment_progress as ap (
    user_id,
    assessment_id,
    correct_answers,
    total_questions
  )
  values (
    v_user_id,
    v_assessment_id,
    v_score,
    v_total
  )
  on conflict (user_id, assessment_id) do nothing
  returning ap.correct_answers, ap.total_questions
  into v_saved_correct, v_saved_total;

  if found then
    return query
      select v_saved_correct, v_saved_total, false;

    return;
  end if;

  -- A concurrent submission may have completed first.
  -- Return its saved result rather than overwriting it.
  select ap.correct_answers, ap.total_questions
  into v_saved_correct, v_saved_total
  from public.assessment_progress ap
  where ap.user_id = v_user_id
    and ap.assessment_id = v_assessment_id;

  if v_saved_correct is null or v_saved_total is null then
    raise exception 'Unable to retrieve assessment result.';
  end if;

  return query
    select v_saved_correct, v_saved_total, true;

end;
$$;

-- Only authenticated learners can invoke the function.
revoke all on function
  public.submit_portfolio_assessment(bigint[])
  from public, anon;

grant execute on function
  public.submit_portfolio_assessment(bigint[])
  to authenticated;

commit;
