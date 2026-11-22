"use client";

import Link from "next/link";

import { useAuthModal } from "@/components/auth/AuthModalContext";

const missions = [
  { title: "Build the starter UI", status: "completed" },
  { title: "Add task creation", status: "completed" },
  { title: "Toggle task completion", status: "completed" },
  { title: "Remove tasks & count", status: "current" },
  { title: "Filter & save tasks", status: "locked" },
];

export default function HeroSection() {
  // Access the shared Login/Register popup.
  const { openAuthModal } = useAuthModal();

  return (
    <section className="relative isolate overflow-hidden bg-[#080d1e] text-white">
      {/* Background grid */}
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

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-28 h-96 w-96 rounded-full bg-cyan-500/20 blur-[110px]"
      />

      <div className="relative mx-auto grid min-h-[85vh] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8">
        {/* LEFT SIDE - Introduction */}
        <div className="text-center lg:text-left">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Learn by Building
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl xl:text-[56px]">
            Stop watching
            <br />
            tutorials.
            <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Start building.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg lg:mx-0">
            Turn programming knowledge into real-world skills.
            Follow guided missions, build practical projects,
            unlock new challenges, and track your growth
            every step of the way.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            
          <button
            type="button"
            onClick={() => openAuthModal("login", "/projects")}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-400/20 transition duration-300 hover:-translate-y-1 hover:shadow-emerald-400/40"
          >
            Start Building
            <span aria-hidden="true">→</span>
          </button>


            <Link
              href="/#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 px-7 py-3 font-semibold text-white transition hover:border-cyan-400/50 hover:bg-slate-700"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 lg:justify-start">
            <span>✓ 9 Projects</span>
            <span>✓ 3 Technologies</span>
            <span>✓ Step-by-Step Missions</span>
          </div>
        </div>

        {/* RIGHT SIDE - Project preview */}
        <div className="relative mx-auto w-full max-w-md">
          {/* Floating programming label */}
          <div className="absolute -right-3 -top-7 z-10 hidden rotate-6 rounded-xl border border-violet-400/30 bg-[#202340] px-4 py-2 font-mono text-xs text-violet-300 shadow-xl sm:block">
            {"<BuildYourFuture />"}
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-slate-700/70 bg-[#151d34]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-7">
            {/* Browser-style header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-5">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
              </div>

              <span className="font-mono text-xs text-slate-500">
                your-learning-journey
              </span>
            </div>

            {/* Project title */}
            <div className="mt-7 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Sample Project Preview
                </p>

                <h2 className="text-xl font-bold text-white">
                  Interactive Task Tracker
                </h2>
              </div>

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                React · Easy
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-9">
              <div className="mb-3 flex justify-between gap-3 text-sm">
                <span className="text-slate-400">
                  Your journey
                </span>

                <span className="font-bold text-emerald-300">
                  60% completed
                </span>
              </div>

              <div
                role="progressbar"
                aria-label="Sample mission progress"
                aria-valuenow={60}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2.5 overflow-hidden rounded-full bg-slate-700"
              >
                <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" />
              </div>
            </div>

            {/* Mission list */}
            <div className="mt-4 space-y-2">
              {missions.map((mission, index) => {
                const completed =
                  mission.status === "completed";
                const current =
                  mission.status === "current";

                return (
                  <div
                    key={mission.title}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${
                      current
                        ? "border-violet-400/40 bg-violet-400/10"
                        : completed
                          ? "border-slate-700/40 bg-slate-700/45"
                          : "border-transparent bg-slate-800/30 opacity-50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
                        completed
                          ? "text-emerald-300"
                          : current
                            ? "text-violet-300"
                            : "text-slate-500"
                      }`}
                      aria-hidden="true"
                    >
                      {completed
                        ? "✓"
                        : current
                          ? "✧"
                          : "🔒"}
                    </span>

                    <span
                      className={`min-w-0 flex-1 text-sm ${
                        current
                          ? "font-semibold text-white"
                          : completed
                            ? "text-slate-200"
                            : "text-slate-400"
                      }`}
                    >
                      {mission.title}
                    </span>

                    <span className="shrink-0 font-mono text-xs text-slate-500">
                      {current
                        ? "NEXT"
                        : completed
                          ? String(index + 1).padStart(2, "0")
                          : "LOCKED"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Preview footer */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-700/50 pt-5">
              <span className="font-mono text-xs text-slate-500">
                progress.saved = true;
              </span>

              <span className="text-xs font-semibold text-emerald-300">
                Keep Building ↗
              </span>
            </div>
          </div>

          {/* Floating code decoration */}
          <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border border-cyan-400/20 bg-[#17243a] px-5 py-3 shadow-2xl sm:block">
            <p className="font-mono text-xs text-cyan-300">
              {"{ learn → build → grow }"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
