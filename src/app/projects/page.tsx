
import TechnologyCard from "@/components/TechnologyCard";
import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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

export default async function ProjectsPage() {
  // Create the existing Supabase server client.
  const supabase = await createClient();

  // Check that the user is authenticated.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Visitors must log in before accessing projects.
  if (!user) {
    redirect("/login?next=%2Fprojects");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d1e] px-6 py-20 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        
{/* Projects page introduction */}
<div className="mx-auto max-w-3xl text-center">
  <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
    Your Developer Journey Starts Here
  </span>

  <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
    Explore.
    <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
      {" "}Build. Grow.
    </span>
  </h1>

  <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400">
    Discover hands-on programming projects designed to turn
    your knowledge into practical skills. Choose a technology,
    challenge yourself, and build something real.
  </p>

  {/* Platform overview */}
  <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-400">
    <span>✓ 3 Technologies</span>
    <span>✓ 9 Projects</span>
    <span>✓ 3 Difficulty Levels</span>
  </div>
</div>


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
