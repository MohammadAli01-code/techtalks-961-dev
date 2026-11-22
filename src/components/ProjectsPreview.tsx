"use client";


import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

async function handleExploreProjects() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    router.push("/login?next=/projects");
    return;
  }

  router.push("/projects");
}

  return (
    
<section
  id="projects-preview"
  className="relative isolate overflow-hidden bg-[#0b1224] px-6 py-12 text-white lg:px-8"
>
  {/* Decorative programming grid */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-20"
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
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
            Explore Projects
          </span>

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Start Building
            <span className="block text-cyan-300">
              Real Projects.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Choose your technology, explore hands-on projects,
            and develop your skills one mission at a time.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {technologies.map((technology) => (
            <div
              key={technology.number}
              className="group relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#151d34]/90 p-6 shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_15px_45px_rgba(34,211,238,0.12)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl font-bold text-cyan-300">
                  {technology.icon}
                </div>

                <span className="font-mono text-sm text-slate-500">
                  {technology.number}
                </span>
              </div>

              <h3 className="text-lg font-bold">
                {technology.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {technology.description}
              </p>
            </div>
          ))}
        </div>

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
