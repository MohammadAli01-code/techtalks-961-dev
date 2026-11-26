
export type Difficulty = "Easy" | "Medium" | "Hard";

export type TechnologySlug =
  | "react"
  | "html-css-js"
  | "php";

export type TechnologyFilter = "all" | TechnologySlug;
export type DifficultyFilter = "all" | Difficulty;

export type CatalogProject = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  href?: string;
};

export type CatalogTechnology = {
  number: string;
  title: string;
  description: string;
  slug: TechnologySlug;
  comingSoon: boolean;
  projects: CatalogProject[];
};

// Centralized catalog data.
export const technologies: CatalogTechnology[] = [
  {
    number: "01",
    title: "React",
    description:
      "Build interactive interfaces using reusable React components.",
    slug: "react",
    comingSoon: false,
    projects: [
      {
        id: "counter-app",
        title: "Counter App",
        description:
          "Build an interactive counter using React state.",
        difficulty: "Easy",
      },
      {
        id: "todo-list",
        title: "Todo List",
        description: "Create, complete, and delete tasks.",
        difficulty: "Medium",
      },
      {
        id: "expense-tracker",
        title: "Expense Tracker",
        description:
          "Track expenses and display spending summaries.",
        difficulty: "Hard",
      },
    ],
  },
  {
    number: "02",
    title: "HTML / CSS / JavaScript",
    description:
      "Learn the fundamentals of responsive web development.",
    slug: "html-css-js",
    comingSoon: false,
    projects: [
      {
        id: "personal-portfolio",
        title: "Personal Portfolio",
        description:
          "Build a responsive personal portfolio website.",
        difficulty: "Easy",
        href: "/projects/personal-portfolio",
      },
      {
        id: "quiz-application",
        title: "Quiz Application",
        description:
          "Create an interactive quiz with JavaScript.",
        difficulty: "Medium",
      },
      {
        id: "ecommerce-frontend",
        title: "E-commerce Frontend",
        description:
          "Build a product catalog and shopping cart interface.",
        difficulty: "Hard",
      },
    ],
  },
  {
    number: "03",
    title: "PHP",
    description:
      "PHP projects are coming soon. Stay tuned for future guided learning experiences.",
    slug: "php",
    comingSoon: true,
    projects: [],
  },
];

// Generate a flat project list for combined filtering.
export const catalogProjects = technologies.flatMap(
  (technology) =>
    technology.projects.map((project) => ({
      ...project,
      technology: technology.slug,
      technologyTitle: technology.title,
    }))
);

export const difficultyOptions: {
  value: DifficultyFilter;
  label: string;
}[] = [
  { value: "all", label: "All Levels" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];
