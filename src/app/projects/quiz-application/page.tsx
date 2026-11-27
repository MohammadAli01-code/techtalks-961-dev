import Link from "next/link";

import {
  quizLevels,
  quizMissions,
} from "./quiz-missions";

const projectRoute = "/projects/quiz-application";

// Build the learning roadmap from the existing mission content.
const levels = Object.entries(quizLevels)
  .map(([number, level]) => ({
    number: Number(number),
    ...level,
    missions: quizMissions.filter(
      (mission) => mission.level === Number(number),
    ),
  }))
  .sort((a, b) => a.number - b.number);

const learningOutcomes = [
  "Create structured HTML interfaces.",
  "Design responsive layouts using CSS.",
  "Work with JavaScript arrays and objects.",
  "Handle DOM events and user interactions.",
  "Implement quiz navigation and scoring.",
  "Build and test an interactive application.",
];

// Generate the URL for each mission.
function missionHref(level: number, mission: number) {
  return `${projectRoute}/levels/${level}/missions/${mission}`;
}

export default function QuizApplicationPage() {
  const firstMission = quizMissions[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#080d1e] dark:text-white">

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-16 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Breadcrumb */}
        <Link
          href="/projects"
          className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300"
        >
          ← Back to Projects
        </Link>

        {/* PROJECT HERO */}
        <section className="mt-5 grid items-center gap-6 lg:grid-cols-2 lg:gap-10">

          <div>
            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                Medium Level
              </span>

              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                Guided Project 02
              </span>

            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Build Your Own

              <span className="mt-1 block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
                Quiz Application
              </span>
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
              Build an interactive quiz application that displays
              questions, handles user answers, calculates scores,
              and provides instant feedback.
            </p>

            <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">
              Learn how HTML, CSS, and JavaScript work together
              to create a complete interactive web application.
            </p>

            {/* Technologies */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript"].map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-[#151d34] dark:text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>

            {/* Dynamic project statistics */}
            <div className="mt-5 grid max-w-sm grid-cols-3 gap-2">
              {[
                { value: levels.length, label: "Levels" },
                { value: quizMissions.length, label: "Missions" },
                { value: 3, label: "Technologies" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-[#151d34]"
                >
                  <p className="text-xl font-extrabold text-blue-600 dark:text-cyan-300">
                    {stat.value}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Project navigation */}
            <div className="mt-5 flex flex-wrap gap-2">

              {firstMission && (
                <Link
                  href={missionHref(
                    firstMission.level,
                    firstMission.number,
                  )}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                >
                  Start Project →
                </Link>
              )}

              <a
                href="#levels"
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:border-blue-400 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
              >
                Explore Levels ↓
              </a>

              <a
                href="#preview"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:bg-[#151d34] dark:text-white"
              >
                View Preview
              </a>

            </div>
          </div>

          {/* QUIZ DESIGN PREVIEW */}
          <section
            id="preview"
            aria-label="Quiz application design preview"
            className="mx-auto w-full max-w-lg scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-[#151d34]"
          >

            <div className="mb-3 flex items-center justify-between px-1">

              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>

              <span className="font-mono text-[10px] text-slate-400">
                quiz-preview.html
              </span>

            </div>

            <div className="rounded-xl bg-[#080d1e] p-4 text-white sm:p-5">

              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-300">
                Developer Quiz
              </p>

              <div className="mt-3 flex justify-between text-[11px] text-slate-400">
                <span>Question 1 of 5</span>
                <span>Score: 0</span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-1/5 rounded-full bg-cyan-400" />
              </div>

              <h2 className="mt-4 text-base font-bold leading-6 sm:text-lg">
                Which language adds interactivity to websites?
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">

                {["HTML", "CSS", "JavaScript", "SQL"].map(
                  (answer, index) => (
                    <div
                      key={answer}
                      className={`rounded-lg border px-3 py-2.5 text-xs font-semibold ${
                        index === 2
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                          : "border-slate-700 bg-slate-800 text-slate-200"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}. {answer}
                    </div>
                  ),
                )}

              </div>

              <div className="mt-4 rounded-lg bg-blue-600 py-2.5 text-center text-xs font-bold">
                Next Question →
              </div>

            </div>

            <p className="mt-2 text-center text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Design preview of the application you will build.
            </p>

          </section>

        </section>

        {/* LEARNING OUTCOMES */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#151d34] sm:p-5">

          <div className="grid gap-4 md:grid-cols-[0.65fr_1fr] md:gap-6">

            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                What you will achieve
              </p>

              <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
                Learn by Building
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                Develop practical programming skills by building
                a real JavaScript application step by step.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">

              {learningOutcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-2"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300"
                  >
                    ✓
                  </span>

                  <span className="text-xs leading-5 text-slate-700 dark:text-slate-300">
                    {outcome}
                  </span>
                </li>
              ))}

            </ul>

          </div>

        </section>

        {/* DYNAMIC LEARNING ROADMAP */}
        <section
          id="levels"
          className="mt-10 scroll-mt-24"
        >

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
            Your learning journey
          </p>

          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {levels.length} Levels. One Complete Application.
          </h2>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600 dark:text-slate-400">
            Explore each level and select a mission to start
            building your quiz application.
          </p>

          <div className="mt-5 space-y-3">

            {levels.map((level) => (
              <details
                key={level.number}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white open:border-blue-300 dark:border-slate-700 dark:bg-[#151d34] dark:open:border-cyan-400/40"
              >

                {/* Level card */}
                <summary className="flex cursor-pointer list-none items-center gap-3 p-3 marker:hidden [&::-webkit-details-marker]:hidden sm:p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-mono text-base font-extrabold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                    {String(level.number).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                      Level {level.number}
                    </p>

                    <h3 className="mt-0.5 text-sm font-bold sm:text-base">
                      {level.name}
                    </h3>

                    <p className="mt-1 hidden text-xs leading-5 text-slate-500 dark:text-slate-400 sm:block">
                      {level.goal}
                    </p>

                  </div>

                  <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:inline-flex">
                    {level.missions.length} Missions
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-lg text-blue-600 transition-transform group-open:rotate-180 dark:text-cyan-300"
                  >
                    ↓
                  </span>

                </summary>

                {/* Expanded level content */}
                <div className="border-t border-slate-200 p-4 dark:border-slate-700">

                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-[#101b31]">

                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300">
                      Level Objective
                    </p>

                    <p className="mt-1 text-xs leading-6 text-slate-700 dark:text-slate-300">
                      {level.goal}
                    </p>

                  </div>

                  <h4 className="mb-3 mt-4 text-sm font-bold">
                    Mission Roadmap
                  </h4>

                  {/* Clickable mission cards */}
                  <ol className="space-y-2">

                    {level.missions.map((mission) => (
                      <li key={mission.number}>

                        <Link
                          href={missionHref(
                            mission.level,
                            mission.number,
                          )}
                          className="group/mission flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-[#10182c] dark:hover:border-cyan-400/50 dark:hover:bg-cyan-400/5"
                        >

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-mono text-xs font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                            {String(mission.number).padStart(2, "0")}
                          </span>

                          <div className="min-w-0 flex-1">

                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              Mission {mission.number}
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                              {mission.title}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              {mission.tasks.length} Tasks
                            </p>

                          </div>

                          <span className="shrink-0 text-xs font-bold text-blue-600 dark:text-cyan-300">
                            Open →
                          </span>

                        </Link>

                      </li>
                    ))}

                  </ol>

                </div>

              </details>
            ))}

          </div>

        </section>

        {/* Progress integration status */}
        <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/5">

          <h2 className="text-base font-bold">
            Your Learning Progress
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
            All missions are currently available for practice.
            Saved progress, mission unlocking, and the final
            assessment will be connected later.
          </p>

        </section>

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 pt-5 text-center dark:border-slate-700">

          <p className="font-mono text-xs font-bold tracking-widest text-blue-600 dark:text-cyan-300">
            LEARN. BUILD. GROW.
          </p>

          <Link
            href="/projects"
            className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-300"
          >
            Explore Other Projects →
          </Link>

        </div>

      </div>

    </main>
  );
}