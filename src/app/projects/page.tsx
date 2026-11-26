import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import ProjectCatalog from "./ProjectCatalog";
import { getCatalogData } from "./catalog-server";

export default async function ProjectsPage() {
  // Verify the learner is authenticated.
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=%2Fprojects");
  }

  // Retrieve technologies and projects from Supabase.
  // The database is now our catalog's source of truth.
  const { technologies, projects } = await getCatalogData();

  // Count the difficulty levels available in the database.
  const difficultyCount = new Set(projects.map((project) => project.difficulty))
    .size;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-12 text-slate-900 transition-colors duration-300 dark:bg-[#080d1e] dark:text-white sm:px-6 lg:px-8 lg:py-16">
      {/* Theme-aware programming grid background */}
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

      {/* Ambient lighting for both themes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/5 blur-[110px] dark:bg-cyan-500/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-60 h-96 w-96 rounded-full bg-blue-500/5 blur-[110px] dark:bg-blue-500/10"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Catalog hero section */}
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-blue-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-cyan-400" />
            Your Developer Journey Starts Here
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Explore.
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-blue-400">
              Build. Grow.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Discover hands-on programming projects designed to turn your
            knowledge into practical skills. Choose your technology, challenge
            yourself, and build something real.
          </p>

          {/* Statistics now come from Supabase. */}
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white py-5 transition-colors duration-300 dark:divide-slate-700 dark:border-slate-700/60 dark:bg-[#151d34]">
            <div className="px-2">
              <p className="font-mono text-2xl font-bold text-blue-600 dark:text-cyan-300 sm:text-3xl">
                {technologies.length}
              </p>

              <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 sm:text-xs">
                Technologies
              </p>
            </div>

            <div className="px-2">
              <p className="font-mono text-2xl font-bold text-blue-600 dark:text-cyan-300 sm:text-3xl">
                {projects.length}
              </p>

              <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 sm:text-xs">
                Projects
              </p>
            </div>

            <div className="px-2">
              <p className="font-mono text-2xl font-bold text-blue-600 dark:text-cyan-300 sm:text-3xl">
                {difficultyCount}
              </p>

              <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 sm:text-xs">
                Difficulty Levels
              </p>
            </div>
          </div>
        </header>

        {/* Pass database records to Developer 2's catalog. */}
        <ProjectCatalog
          databaseTechnologies={technologies}
          databaseProjects={projects}
        />

        {/* Closing message */}
        <div className="mt-16 border-t border-slate-200 pt-10 text-center dark:border-slate-700/60">
          <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-cyan-300">
            Learn. Build. Grow.
          </p>

          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white sm:text-3xl">
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
