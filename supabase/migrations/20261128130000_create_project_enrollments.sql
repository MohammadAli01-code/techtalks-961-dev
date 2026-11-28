
-- Track which authenticated learners have started each project.
create table public.project_enrollments (
  user_id uuid not null
    references auth.users(id) on delete cascade,

  project_id bigint not null
    references public.projects(id) on delete cascade,

  enrolled_at timestamptz not null default now(),

  -- One learner can enroll in a project only once.
  primary key (user_id, project_id)
);

-- Learners may access only their own enrollment records.
alter table public.project_enrollments
  enable row level security;

create policy "Learners can read their enrollments"
on public.project_enrollments
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Learners can start their own projects"
on public.project_enrollments
for insert
to authenticated
with check (user_id = (select auth.uid()));

grant select, insert
on public.project_enrollments
to authenticated;

-- Preserve enrollment for learners who already have progress.
insert into public.project_enrollments (user_id, project_id)
select distinct tp.user_id, l.project_id
from public.task_progress tp
join public.mission_tasks mt on mt.id = tp.task_id
join public.missions m on m.id = mt.mission_id
join public.levels l on l.id = m.level_id

union

select distinct mp.user_id, l.project_id
from public.mission_progress mp
join public.missions m on m.id = mp.mission_id
join public.levels l on l.id = m.level_id

union

select distinct ap.user_id, a.project_id
from public.assessment_progress ap
join public.assessments a on a.id = ap.assessment_id

on conflict (user_id, project_id) do nothing;
