
-- 961-Dev: Initial project catalog data.
-- Matches the technologies and projects displayed in the frontend.
-- Re-running this seed avoids duplicating existing records.

-- Step 1: Insert technologies.
INSERT INTO public.technologies (name, slug, description)
VALUES
  (
    'React',
    'react',
    'Build interactive interfaces using reusable React components.'
  ),
  (
    'HTML / CSS / JavaScript',
    'html-css-js',
    'Learn the fundamentals of responsive web development.'
  ),
  (
    'PHP',
    'php',
    'PHP projects are coming soon.'
  )
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Insert the six existing catalog projects.
WITH seed_projects (
  technology_slug,
  title,
  slug,
  description,
  difficulty
) AS (
  VALUES
    (
      'react',
      'Counter App',
      'counter-app',
      'Build an interactive counter using React state.',
      'easy'
    ),
    (
      'react',
      'Todo List',
      'todo-list',
      'Create, complete, and delete tasks.',
      'medium'
    ),
    (
      'react',
      'Expense Tracker',
      'expense-tracker',
      'Track expenses and display spending summaries.',
      'hard'
    ),
    (
      'html-css-js',
      'Personal Portfolio',
      'personal-portfolio',
      'Build a responsive personal portfolio website.',
      'easy'
    ),
    (
      'html-css-js',
      'Quiz Application',
      'quiz-application',
      'Create an interactive quiz with JavaScript.',
      'medium'
    ),
    (
      'html-css-js',
      'E-commerce Frontend',
      'ecommerce-frontend',
      'Build a product catalog and shopping cart interface.',
      'hard'
    )
)
INSERT INTO public.projects (
  technology_id,
  title,
  slug,
  description,
  difficulty
)
SELECT
  t.id,
  s.title,
  s.slug,
  s.description,
  s.difficulty
FROM seed_projects AS s
JOIN public.technologies AS t
  ON t.slug = s.technology_slug
ON CONFLICT (technology_id, slug) DO NOTHING;
