# 961-Dev — Initial Database Schema

## Purpose

The database supports the Guided Projects MVP, including user profiles, technology categories, projects, ordered levels, guided missions, final assessments, and persistent learner progress.

## Database Platform

Supabase PostgreSQL with Supabase Authentication and Row Level Security (RLS).

## Main Tables

|-------------------------------------------------------------------------------------|
|          Table       |                        Description                           |
|----------------------|--------------------------------------------------------------|
| profiles             | Application profiles linked to authenticated users           |
| technologies         | Programming technology categories                            |
| projects             | Guided projects categorized by technology and difficulty     |
| levels               | Ordered learning levels within projects                      |
| missions             | Mission content, instructions, hints, and optional solutions |
| assessments          | Final project assessments                                    |
| assessment_questions | Multiple-choice questions                                    |
| assessment_options   | Available answers to assessment questions                    |
| mission_progress     | Records each learner's completed missions                    |
| assessment_progress  | Records each learner's completed final assessments           |
|-------------------------------------------------------------------------------------|

## Relationships

- Each authenticated user has one profile.
- Each technology can contain multiple projects.
- Each project can contain multiple ordered levels.
- Each level contains one mission.
- Each project can have one final assessment.
- Each assessment contains questions, and each question contains answer options.
- Each learner can have multiple mission completion records and assessment completion records.

## Constraints and Security

Primary keys identify records uniquely. Foreign keys enforce relationships between records. Unique constraints prevent duplicate level numbers within a project and duplicate completion records.

RLS is enabled on all application tables. Learners can read their own profile and progress, while project content is readable by authenticated users.

## Planned Integration Work

- Populate the three technology categories and nine projects.
- Implement sequential mission unlocking with server-side or database enforcement.
- Restrict direct access to locked mission solutions.
- Create the final three-question assessments.
- Implement persistent completion tracking and assessment confirmation.
- Test RLS policies with multiple authenticated users.

## Schema Management

Database changes are maintained as SQL migration files inside `supabase/migrations` and applied using the Supabase CLI.