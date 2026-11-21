
import TechnologyCard from "@/components/TechnologyCard";
import ProjectCard from "@/components/ProjectCard";

const technologies = [
  {
    title: "React",
    description:
      "Build interactive interfaces using reusable React components.",
    slug: "react",
    projects: [
      {
        title: "Counter App",
        description: "Build an interactive counter using React state.",
        difficulty: "Easy" as const,
      },
      {
        title: "Todo List",
        description: "Create, complete, and delete tasks.",
        difficulty: "Medium" as const,
      },
      {
        title: "Expense Tracker",
        description: "Track expenses and display spending summaries.",
        difficulty: "Hard" as const,
      },
    ],
  },
  {
    title: "HTML / CSS / JavaScript",
    description:
      "Learn the fundamentals of responsive web development.",
    slug: "html-css-js",
    projects: [
      {
        title: "Personal Portfolio",
        description: "Build a responsive personal portfolio website.",
        difficulty: "Easy" as const,
      },
      {
        title: "Quiz Application",
        description: "Create an interactive quiz with JavaScript.",
        difficulty: "Medium" as const,
      },
      {
        title: "E-commerce Frontend",
        description: "Build a product catalog and shopping cart interface.",
        difficulty: "Hard" as const,
      },
    ],
  },
  {
    title: "PHP",
    description:
      "Build dynamic web applications using PHP.",
    slug: "php",
    projects: [
      {
        title: "Contact Form",
        description: "Create a contact form with server-side validation.",
        difficulty: "Easy" as const,
      },
      {
        title: "Blog Application",
        description: "Build a simple blog with CRUD operations.",
        difficulty: "Medium" as const,
      },
      {
        title: "Inventory Management",
        description: "Manage products and inventory records.",
        difficulty: "Hard" as const,
      },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-4xl font-bold">
          Explore Projects
        </h1>

        <p className="mt-4 text-center text-slate-300">
          Choose a technology and build projects step by step.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {technologies.map((technology) => (
            <TechnologyCard
              key={technology.slug}
              title={technology.title}
              description={technology.description}
              slug={technology.slug}
            />
          ))}
        </div>

        <div className="mt-20 space-y-16">
          {technologies.map((technology) => (
            <section
              key={technology.slug}
              id={technology.slug}
              className="scroll-mt-24"
            >
              <h2 className="mb-6 text-3xl font-bold">
                {technology.title} Projects
              </h2>

              <div className="grid gap-6 md:grid-cols-3">
                {technology.projects.map((project) => (
                  
            <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            difficulty={project.difficulty}
            href={
                technology.slug === "html-css-js" &&
                project.difficulty === "Easy"
                ? "/projects/personal-portfolio"
                : undefined
            }
            />

                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
