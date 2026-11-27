
-- 961-Dev: Guided missions and persistent task progress
-- Extends the existing schema without replacing existing tables.

begin;

-----------------------------------------------------------
-- PART 1: Level learning information
-----------------------------------------------------------

-- Information displayed before starting a level.
alter table public.levels
  add column description text,
  add column objective text,
  add column given_items text[] not null default '{}';

-----------------------------------------------------------
-- PART 2: Allow multiple missions inside one level
-----------------------------------------------------------

-- Find and remove the existing UNIQUE constraint on
-- missions.level_id without assuming its database name.
do $$
declare
  constraint_name text;
begin
  select c.conname
  into constraint_name
  from pg_constraint c
  join pg_class t
    on t.oid = c.conrelid
  join pg_namespace n
    on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'missions'
    and c.contype = 'u'
    and (
      select array_agg(
        a.attname::text order by cols.ordinality
      )
      from unnest(c.conkey)
        with ordinality as cols(attnum, ordinality)
      join pg_attribute a
        on a.attrelid = t.oid
       and a.attnum = cols.attnum
    ) = array['level_id'];

  if constraint_name is null then
    raise exception
      'Expected unique constraint on missions.level_id not found';
  end if;

  execute format(
    'alter table public.missions drop constraint %I',
    constraint_name
  );
end;
$$;

-- Each mission now has a number inside its level.
alter table public.missions
  add column mission_number integer;

-- Preserve any existing missions.
-- Previously, each level could contain at most one.
update public.missions
set mission_number = 1
where mission_number is null;

alter table public.missions
  alter column mission_number set not null;

alter table public.missions
  add constraint missions_number_positive
    check (mission_number > 0),
  add constraint missions_level_number_unique
    unique (level_id, mission_number);

-- Content needed by the Mission Workspace.
alter table public.missions
  add column purpose text,
  add column file_to_edit text,
  add column expected_result text,
  add column expected_image_path text;

-----------------------------------------------------------
-- PART 3: Mission tasks
-----------------------------------------------------------

-- One mission can contain multiple ordered tasks.
create table public.mission_tasks (
  id bigint generated always as identity primary key,

  mission_id bigint not null
    references public.missions(id)
    on delete cascade,

  task_number integer not null
    check (task_number > 0),

  instruction text not null
    check (length(btrim(instruction)) > 0),

  unique (mission_id, task_number)
);

-----------------------------------------------------------
-- PART 4: Persistent learner task progress
-----------------------------------------------------------

-- One completion record per learner and task.
create table public.task_progress (
  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  task_id bigint not null
    references public.mission_tasks(id)
    on delete cascade,

  completed_at timestamptz not null default now(),

  primary key (user_id, task_id)
);

create index task_progress_task_idx
  on public.task_progress(task_id);

-----------------------------------------------------------
-- PART 5: Protect mission completion
-----------------------------------------------------------

-- A learner cannot mark a mission complete unless
-- every configured task has a completion record.
create function public.validate_mission_completion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin

  -- Reject missions that have no configured tasks.
  if not exists (
    select 1
    from public.mission_tasks t
    where t.mission_id = new.mission_id
  ) then
    raise exception
      'This mission has no configured tasks.'
      using errcode = '23514';
  end if;

  -- Reject completion if any task is unfinished.
  if exists (
    select 1
    from public.mission_tasks t
    where t.mission_id = new.mission_id
      and not exists (
        select 1
        from public.task_progress tp
        where tp.task_id = t.id
          and tp.user_id = new.user_id
      )
  ) then
    raise exception
      'Complete all mission tasks before continuing.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger check_mission_completion
before insert on public.mission_progress
for each row
execute function public.validate_mission_completion();

-----------------------------------------------------------
-- PART 6: Row Level Security
-----------------------------------------------------------

alter table public.mission_tasks
  enable row level security;

alter table public.task_progress
  enable row level security;

-- Authenticated learners can read task instructions.
create policy "Read mission tasks"
on public.mission_tasks
for select
to authenticated
using (true);

-- Learners can only read their own task progress.
create policy "Read own task progress"
on public.task_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Learners can only complete their own tasks.
create policy "Insert own task progress"
on public.task_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- Learners can uncheck their own tasks.
create policy "Delete own task progress"
on public.task_progress
for delete
to authenticated
using ((select auth.uid()) = user_id);

-----------------------------------------------------------
-- PART 7: Table permissions
-----------------------------------------------------------

revoke all on
  public.mission_tasks,
  public.task_progress
from anon;

grant select
on public.mission_tasks
to authenticated;

grant select, insert, delete
on public.task_progress
to authenticated;

commit;
