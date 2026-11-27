
-- 961-Dev: Personal Portfolio Final Assessment
-- Creates 3 multiple-choice questions with 4 options each.
-- Protects correct answers from direct learner access.

begin;

do $$
declare
  v_project_id bigint;
  v_assessment_id bigint;
  v_question_id bigint;
begin

  -- Find the Personal Portfolio project.
  select p.id
  into v_project_id
  from public.projects p
  join public.technologies t
    on t.id = p.technology_id
  where p.slug = 'personal-portfolio'
    and t.slug = 'html-css-js';

  if v_project_id is null then
    raise exception 'Personal Portfolio project not found.';
  end if;

  -- Protect any assessment that might already exist.
  if exists (
    select 1
    from public.assessments
    where project_id = v_project_id
  ) then
    raise exception
      'Personal Portfolio already has an assessment.';
  end if;

  -- Create the final assessment.
  insert into public.assessments (
    project_id,
    title
  )
  values (
    v_project_id,
    'Personal Portfolio - Final Assessment'
  )
  returning id into v_assessment_id;


  -- =========================================
  -- QUESTION 1: HTML
  -- =========================================

  insert into public.assessment_questions (
    assessment_id,
    question_number,
    question_text
  )
  values (
    v_assessment_id,
    1,
    'Your navigation contains a link with href="#projects", but clicking it does not jump to the Projects section. What should you check first?'
  )
  returning id into v_question_id;

  insert into public.assessment_options (
    question_id,
    option_number,
    option_text,
    is_correct
  )
  values
    (
      v_question_id, 1,
      'Whether the Projects section has id="projects".',
      true
    ),
    (
      v_question_id, 2,
      'Whether the navigation uses a CSS animation.',
      false
    ),
    (
      v_question_id, 3,
      'Whether JavaScript is connected to every link.',
      false
    ),
    (
      v_question_id, 4,
      'Whether the Projects section is inside the footer.',
      false
    );


  -- =========================================
  -- QUESTION 2: CSS
  -- =========================================

  insert into public.assessment_questions (
    assessment_id,
    question_number,
    question_text
  )
  values (
    v_assessment_id,
    2,
    'Your project cards display correctly on desktop, but overflow the screen on mobile. Which solution is most appropriate?'
  )
  returning id into v_question_id;

  insert into public.assessment_options (
    question_id,
    option_number,
    option_text,
    is_correct
  )
  values
    (
      v_question_id, 1,
      'Give every card a fixed width of 700px.',
      false
    ),
    (
      v_question_id, 2,
      'Use a media query to switch to a single-column layout with flexible widths.',
      true
    ),
    (
      v_question_id, 3,
      'Hide the overflow without changing the card layout.',
      false
    ),
    (
      v_question_id, 4,
      'Reduce all text to a very small font size.',
      false
    );


  -- =========================================
  -- QUESTION 3: JavaScript
  -- =========================================

  insert into public.assessment_questions (
    assessment_id,
    question_number,
    question_text
  )
  values (
    v_assessment_id,
    3,
    'You are implementing a mobile navigation menu. What should happen when the menu button is clicked?'
  )
  returning id into v_question_id;

  insert into public.assessment_options (
    question_id,
    option_number,
    option_text,
    is_correct
  )
  values
    (
      v_question_id, 1,
      'The page should reload after every click.',
      false
    ),
    (
      v_question_id, 2,
      'The menu should remain permanently open.',
      false
    ),
    (
      v_question_id, 3,
      'The menu visibility should toggle and aria-expanded should reflect its current state.',
      true
    ),
    (
      v_question_id, 4,
      'Only the button color should change.',
      false
    );


  -- =========================================
  -- VALIDATE THE INSERTED DATA
  -- =========================================

  if (
    select count(*)
    from public.assessment_questions
    where assessment_id = v_assessment_id
  ) <> 3 then
    raise exception 'Expected exactly 3 questions.';
  end if;

  if (
    select count(*)
    from public.assessment_options o
    join public.assessment_questions q
      on q.id = o.question_id
    where q.assessment_id = v_assessment_id
  ) <> 12 then
    raise exception 'Expected exactly 12 answer options.';
  end if;

  -- Every question must have exactly one correct answer.
  if exists (
    select q.id
    from public.assessment_questions q
    join public.assessment_options o
      on o.question_id = q.id
    where q.assessment_id = v_assessment_id
    group by q.id
    having count(*) filter (where o.is_correct) <> 1
  ) then
    raise exception
      'Every question must have exactly one correct answer.';
  end if;

end;
$$;

-- Learners may read question options, but not the
-- is_correct column containing the answer key.
--
-- Grading will be implemented separately through
-- a protected database function.

revoke select
on public.assessment_options
from authenticated;

grant select (
  id,
  question_id,
  option_number,
  option_text
)
on public.assessment_options
to authenticated;

commit;
