import TechnologyCard from "@/components/TechnologyCard";
import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const technologies = [
  {
    number: "01",
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
    number: "02",
    title: "HTML / CSS / JavaScript",
    description: "Learn the fundamentals of responsive web development.",
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
    number: "03",
    title: "PHP",
    description:
      "PHP projects are coming soon. Stay tuned for future guided learning experiences.",
    slug: "php",
    projects: [],
  },
];

export default async function ProjectsPage() {
  // Preserve existing Supabase authentication protection.
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=%2Fprojects");
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f8fafc] px-6 py-16 text-slate-900 transition-colors duration-300 dark:bg-[#080d1e] dark:text-white lg:px-8 lg:py-20">
      {/* Existing programming grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      {/* Existing ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-60 h-96 w-96 rounded-full bg-violet-500/10 blur-[110px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Page introduction */}
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            Your Developer Journey Starts Here
          </span>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Explore.
            <span className="block bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-violet-400">
              Build. Grow.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
            Discover hands-on programming projects designed to turn your
            knowledge into practical skills. Choose a technology, challenge
            yourself, and build something real.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <span>✓ 3 Technologies</span>
            <span>✓ 6 Projects</span>
            <span>✓ 3 Difficulty Levels</span>
          </div>
        </header>

        {/* Technology cards */}
        <section aria-labelledby="technologies-heading" className="mt-20">
          <div className="mb-9 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
              Explore Technologies
            </span>

            <h2
              id="technologies-heading"
              className="mt-4 text-3xl font-bold sm:text-4xl"
            >
              Choose Your Technology
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Explore technologies and choose the programming projects you want
              to build.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {technologies.map((technology) => (
              <TechnologyCard
                key={technology.slug}
                title={technology.title}
                description={technology.description}
                slug={technology.slug}
                comingSoon={technology.slug === "php"}
              />
            ))}
          </div>
        </section>

        {/* Project sections */}
        <div className="mt-24 space-y-20">
          {technologies.map((technology) => (
            <section
              key={technology.slug}
              id={technology.slug}
              className="scroll-mt-28"
            >
              {/* Technology heading */}
              <div className="mb-9 flex flex-col gap-4 border-b border-slate-200 pb-7 dark:border-slate-700/60 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="font-mono text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                    TECHNOLOGY {technology.number}
                  </span>

                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                    {technology.slug === "php"
                      ? "PHP — Coming Soon"
                      : `${technology.title} Projects`}
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {technology.description}
                  </p>
                </div>

                <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-[#151d34] dark:text-slate-300">
                  {technology.slug === "php"
                    ? "Coming Soon"
                    : `${technology.projects.length} Projects`}
                </span>
              </div>

              {/* Dashboard-style project cards */}

              {technology.slug === "php" ? (
                <div className="rounded-2xl border border-dashed border-cyan-500/30 bg-cyan-500/5 px-6 py-12 text-center">
                  <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-300">
                    Coming Soon
                  </span>

                  <h3 className="mt-5 text-2xl font-bold">
                    PHP Projects Are on the Way
                  </h3>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                    We&apos;re preparing guided PHP projects to help you develop
                    your backend programming skills. Stay tuned for future
                    updates.
                  </p>
                </div>
              ) : (
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
              )}
            </section>
          ))}
        </div>

        {/* Closing message */}
        <div className="mt-24 border-t border-slate-200 pt-12 text-center dark:border-slate-700/60">
          <p className="text-sm font-semibold tracking-wide text-cyan-700 dark:text-cyan-300">
            Learn. Build. Grow.
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Every Great Developer Starts Somewhere.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            Choose your first challenge, practice your skills, and keep building
            one project at a time.
          </p>
        </div>
      </div>
    </main>
  );
}
