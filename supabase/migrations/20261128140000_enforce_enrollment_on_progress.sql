
-- 961-Dev: Protect learner progress at the database level.
-- Applies to Personal Portfolio, Quiz Application, and E-commerce.
-- Preserves all existing progress and database triggers.

begin;

-- =====================================================
-- 1. Require enrollment for mission completion
-- =====================================================

drop policy if exists "Insert own mission progress"
on public.mission_progress;

create policy "Insert own mission progress"
on public.mission_progress
for insert
to authenticated
with check (
  user_id = (select auth.uid())

  and exists (
    select 1
    from public.missions m
    join public.levels l
      on l.id = m.level_id
    join public.project_enrollments e
      on e.project_id = l.project_id
    where m.id = mission_id
      and e.user_id = (select auth.uid())
  )
);

-- The existing mission-completion triggers still verify:
-- 1. All mission tasks are completed.
-- 2. The preceding mission is completed.

-- =====================================================
-- 2. Require enrollment and correct sequence
--    before saving individual tasks
-- =====================================================

drop policy if exists "Insert own task progress"
on public.task_progress;

create policy "Insert own task progress"
on public.task_progress
for insert
to authenticated
with check (
  user_id = (select auth.uid())

  and exists (
    select 1
    from public.mission_tasks t

    join public.missions m
      on m.id = t.mission_id

    join public.levels l
      on l.id = m.level_id

    join public.project_enrollments e
      on e.project_id = l.project_id

    where t.id = task_id
      and e.user_id = (select auth.uid())

      -- Reject task progress if any earlier mission
      -- in this project is not officially completed.
      and not exists (
        select 1
        from public.levels previous_level

        join public.missions previous_mission
          on previous_mission.level_id =
             previous_level.id

        where previous_level.project_id =
              l.project_id

          and (
            previous_level.level_number <
              l.level_number

            or (
              previous_level.level_number =
                l.level_number

              and previous_mission.mission_number <
                m.mission_number
            )
          )

          and not exists (
            select 1
            from public.mission_progress mp

            where mp.user_id =
                  (select auth.uid())

              and mp.mission_id =
                  previous_mission.id
          )
      )
  )
);

commit;
