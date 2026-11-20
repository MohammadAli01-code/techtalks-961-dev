
-- 961-Dev: Initial database schema
-- Part A: User profiles and technologies

-- Each profile belongs to one Supabase Auth user.
create table public.profiles (
  id uuid primary key references auth.users(id)
    on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- Automatically create a profile after signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Technology categories: React, HTML/CSS/JS, PHP.
create table public.technologies (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-----------------------------------------------------------


-- Part B: Guided project structure

create table public.projects (
  id bigint generated always as identity primary key,
  technology_id bigint not null
    references public.technologies(id)
    on delete restrict,
  title text not null,
  slug text not null,
  description text,
  difficulty text not null
    check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz not null default now(),
  unique (technology_id, slug)
);

-- Each project has sequentially numbered levels.
create table public.levels (
  id bigint generated always as identity primary key,
  project_id bigint not null
    references public.projects(id)
    on delete cascade,
  level_number integer not null
    check (level_number > 0),
  title text not null,
  unique (project_id, level_number)
);

-- Each level contains one guided mission.
create table public.missions (
  id bigint generated always as identity primary key,
  level_id bigint not null unique
    references public.levels(id)
    on delete cascade,
  title text not null,
  summary text not null,
  instructions text not null,
  hint_1 text,
  hint_2 text,
  final_answer text
);

create index projects_technology_idx
  on public.projects(technology_id);

create index levels_project_idx
  on public.levels(project_id);

-----------------------------------------------------------


-- Part C: Final assessments and MCQ options

-- Each project has at most one final assessment.
create table public.assessments (
  id bigint generated always as identity primary key,
  project_id bigint not null unique
    references public.projects(id)
    on delete cascade,
  title text not null
);

create table public.assessment_questions (
  id bigint generated always as identity primary key,
  assessment_id bigint not null
    references public.assessments(id)
    on delete cascade,
  question_number integer not null
    check (question_number > 0),
  question_text text not null,
  unique (assessment_id, question_number)
);

create table public.assessment_options (
  id bigint generated always as identity primary key,
  question_id bigint not null
    references public.assessment_questions(id)
    on delete cascade,
  option_number integer not null
    check (option_number > 0),
  option_text text not null,
  is_correct boolean not null default false,
  unique (question_id, option_number)
);

-----------------------------------------------------------


-- Part D: Learner progress

-- One completion record per learner and mission.
create table public.mission_progress (
  user_id uuid not null
    references public.profiles(id)
    on delete cascade,
  mission_id bigint not null
    references public.missions(id)
    on delete cascade,
  completed_at timestamptz not null default now(),

  primary key (user_id, mission_id)
);

-- One completion record per learner and assessment.
create table public.assessment_progress (
  user_id uuid not null
    references public.profiles(id)
    on delete cascade,
  assessment_id bigint not null
    references public.assessments(id)
    on delete cascade,
  completed_at timestamptz not null default now(),

  primary key (user_id, assessment_id)
);

create index mission_progress_mission_idx
  on public.mission_progress(mission_id);

create index assessment_progress_assessment_idx
  on public.assessment_progress(assessment_id);


-----------------------------------------------------------


-- Part E: Row Level Security

-- Enable RLS on every application table.
alter table public.profiles enable row level security;
alter table public.technologies enable row level security;
alter table public.projects enable row level security;
alter table public.levels enable row level security;
alter table public.missions enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_options enable row level security;
alter table public.mission_progress enable row level security;
alter table public.assessment_progress enable row level security;

-- Learners can read their own profile.
create policy "Read own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

-- Learners can update their own profile.
create policy "Update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Authenticated learners can read project catalog data.
create policy "Read technologies"
on public.technologies for select
to authenticated using (true);

create policy "Read projects"
on public.projects for select
to authenticated using (true);

create policy "Read levels"
on public.levels for select
to authenticated using (true);

create policy "Read missions"
on public.missions for select
to authenticated using (true);

create policy "Read assessments"
on public.assessments for select
to authenticated using (true);

create policy "Read assessment questions"
on public.assessment_questions for select
to authenticated using (true);

create policy "Read assessment options"
on public.assessment_options for select
to authenticated using (true);

-- Learners can view their own mission progress.
create policy "Read own mission progress"
on public.mission_progress for select
to authenticated
using ((select auth.uid()) = user_id);

-- Learners can record their own mission completion.
create policy "Insert own mission progress"
on public.mission_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- Learners can view their own assessment completion.
create policy "Read own assessment progress"
on public.assessment_progress for select
to authenticated
using ((select auth.uid()) = user_id);

-- Learners can confirm their own assessment completion.
create policy "Insert own assessment progress"
on public.assessment_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- Explicitly restrict table privileges.
revoke all on
  public.profiles,
  public.technologies,
  public.projects,
  public.levels,
  public.missions,
  public.assessments,
  public.assessment_questions,
  public.assessment_options,
  public.mission_progress,
  public.assessment_progress
from anon;

grant select, update on public.profiles to authenticated;

grant select on
  public.technologies,
  public.projects,
  public.levels,
  public.missions,
  public.assessments,
  public.assessment_questions,
  public.assessment_options
to authenticated;

grant select, insert on
  public.mission_progress,
  public.assessment_progress
to authenticated;
