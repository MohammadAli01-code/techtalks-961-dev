
-- 961-Dev: Enforce guided mission progression.
-- Preserves all existing missions, tasks, and learner progress.

begin;

-- =====================================================
-- 1. Enforce sequential mission completion
-- =====================================================

create function public.validate_mission_order()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  previous_mission_id bigint;
begin
  -- Find the immediately preceding mission
  -- within the same project.
  --
  -- Levels are ordered by level_number.
  -- Missions inside each level are ordered
  -- by mission_number.

  select earlier_mission.id
  into previous_mission_id
  from public.missions current_mission
  join public.levels current_level
    on current_level.id = current_mission.level_id
  join public.levels earlier_level
    on earlier_level.project_id = current_level.project_id
  join public.missions earlier_mission
    on earlier_mission.level_id = earlier_level.id
  where current_mission.id = new.mission_id
    and (
      earlier_level.level_number <
        current_level.level_number
      or (
        earlier_level.level_number =
          current_level.level_number
        and earlier_mission.mission_number <
          current_mission.mission_number
      )
    )
  order by
    earlier_level.level_number desc,
    earlier_mission.mission_number desc
  limit 1;

  -- The first mission has no predecessor.
  if previous_mission_id is null then
    return new;
  end if;

  -- All later missions require their immediate
  -- predecessor to be officially completed.
  if not exists (
    select 1
    from public.mission_progress mp
    where mp.user_id = new.user_id
      and mp.mission_id = previous_mission_id
  ) then
    raise exception
      'Complete the previous mission before continuing.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger check_mission_order
before insert on public.mission_progress
for each row
execute function public.validate_mission_order();


-- =====================================================
-- 2. Protect tasks belonging to completed missions
-- =====================================================

create function public.prevent_completed_task_uncheck()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- A completed mission must retain its
  -- officially recorded task progress.
  if exists (
    select 1
    from public.mission_tasks mt
    join public.mission_progress mp
      on mp.mission_id = mt.mission_id
    where mt.id = old.task_id
      and mp.user_id = old.user_id
  ) then
    raise exception
      'Tasks in a completed mission cannot be unchecked.'
      using errcode = '23514';
  end if;

  return old;
end;
$$;

create trigger protect_completed_mission_tasks
before delete on public.task_progress
for each row
execute function public.prevent_completed_task_uncheck();

commit;
