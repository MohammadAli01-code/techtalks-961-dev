
"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthModal } from "@/components/auth/AuthModalContext";

const technologies = [
  {
    number: "01",
    title: "React",
    description:
      "Build modern, interactive web applications using reusable React components.",
    icon: "⚛",
  },
  {
    number: "02",
    title: "HTML, CSS & JavaScript",
    description:
      "Create responsive websites and bring your designs to life with JavaScript.",
    icon: "⌘",
  },
  {
    number: "03",
    title: "PHP",
    description:
      "Explore backend development and build dynamic, data-driven web applications.",
    icon: "</>",
  },
];

export default function ProjectsPreview() {
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  async function handleExploreProjects() {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      openAuthModal("login", "/projects");
      return;
    }

    router.push("/projects");
  }

  return (
    <section
      id="projects-preview"
      className="relative isolate overflow-hidden bg-[#f8fafc] px-6 py-12 text-slate-900 transition-colors duration-300 dark:bg-[#0b1224] dark:text-white lg:px-8"
    >
      {/* Decorative programming grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black, transparent)",
        }}
      />

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
            Explore Projects
          </span>

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Start Building
            <span className="block text-cyan-700 dark:text-cyan-300">
              Real Projects.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Choose your technology, explore hands-on projects,
            and develop your skills one mission at a time.
          </p>
        </div>

        {/* Technology cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {technologies.map((technology) => (
            <div
              key={technology.number}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_15px_45px_rgba(34,211,238,0.10)] dark:border-cyan-400/10 dark:bg-[#151d34]/90 dark:shadow-[0_10px_35px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_15px_45px_rgba(34,211,238,0.12)]"
            >
              {/* Icon and number */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-xl font-bold text-cyan-700 transition-colors duration-300 dark:bg-cyan-400/10 dark:text-cyan-300">
                  {technology.icon}
                </div>

                <span className="font-mono text-sm text-slate-500">
                  {technology.number}
                </span>
              </div>

              {/* Technology title */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {technology.title}
              </h3>

              {/* Technology description */}
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {technology.description}
              </p>
            </div>
          ))}
        </div>

        {/* Explore All Projects button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleExploreProjects}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-400/30"
          >
            Explore All Projects
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
