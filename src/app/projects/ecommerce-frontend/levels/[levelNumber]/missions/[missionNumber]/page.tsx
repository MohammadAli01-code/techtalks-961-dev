"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useState } from "react";

import {
  ecommerceLevels,
  ecommerceMissions,
  type EcommerceMission,
} from "../../../../ecommerce-missions";

const projectRoute = "/projects/ecommerce-frontend";

// Shared styles for consistent mission panels.
const panel =
  "rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#151d34] sm:p-6";

// Generate mission URLs dynamically.
function missionHref(mission: EcommerceMission) {
  return `${projectRoute}/levels/${mission.level}/missions/${mission.number}`;
}

export default function EcommerceMissionPage() {
  const params = useParams<{
    levelNumber: string;
    missionNumber: string;
  }>();

  const levelNumber = Number(params.levelNumber);
  const missionNumber = Number(params.missionNumber);

  // Find the requested mission.
  const mission = ecommerceMissions.find(
    (item) =>
      item.level === levelNumber &&
      item.number === missionNumber,
  );

  if (
    !mission ||
    String(levelNumber) !== params.levelNumber ||
    String(missionNumber) !== params.missionNumber
  ) {
    notFound();
  }

  return (
    <EcommerceMissionContent
      key={`${levelNumber}-${missionNumber}`}
      mission={mission}
    />
  );
}

function EcommerceMissionContent({
  mission,
}: {
  mission: EcommerceMission;
}) {
  const level = ecommerceLevels[mission.level];

  const missionIndex = ecommerceMissions.findIndex(
    (item) => item.number === mission.number,
  );

  const previousMission = ecommerceMissions[missionIndex - 1];
  const nextMission = ecommerceMissions[missionIndex + 1];

  // Temporary checklist state for frontend practice.
  // Official progress will be integrated separately.
  const [checkedTasks, setCheckedTasks] = useState<number[]>([]);
  const [visibleHint, setVisibleHint] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const progress = Math.round(
    (checkedTasks.length / mission.tasks.length) * 100,
  );

  function toggleTask(index: number) {
    setCheckedTasks((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  }

  // Copy the reference solution to the clipboard.
  async function copySolution() {
    try {
      await navigator.clipboard.writeText(mission.solution);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#080d1e] dark:text-white">

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <Link
          href={`${projectRoute}#levels`}
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-300"
        >
          ← Back to Learning Roadmap
        </Link>

        {/* MISSION HEADER */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#151d34] sm:p-6">

          <div className="flex flex-wrap gap-2">

            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
              E-commerce Frontend
            </span>

            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
              Level {mission.level}
            </span>

            <span className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-400/10 dark:text-red-300">
              Hard
            </span>

          </div>

          <p className="mt-5 font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
            Mission {String(mission.number).padStart(2, "0")} / {ecommerceMissions.length}
          </p>

          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {mission.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {mission.levelTitle}
          </p>

          {/* Practice progress */}
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Current session progress
              </span>

              <span className="font-bold text-blue-600 dark:text-cyan-300">
                {progress}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Practice task progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Practice checklist only. Account progress is not connected yet.
            </p>
          </div>

        </section>

        {/* MISSION BRIEF */}
        <section className={`${panel} mt-5`}>

          <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
            01. Mission Brief
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Understand Your Mission
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {mission.why}
          </p>

          <div className="mt-4 rounded-xl bg-blue-50 p-4 dark:bg-[#101b31]">

            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300">
              Level Objective
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {level.goal}
            </p>

          </div>

          <div className="mt-4">

            <h3 className="text-sm font-bold">
              Where to work
            </h3>

            <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-6 dark:border-slate-700 dark:bg-[#080d1e]">
              {mission.workIn}
            </p>

          </div>

          <details className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">

            <summary className="cursor-pointer text-sm font-semibold">
              Before You Start
            </summary>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {level.given.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

          </details>

        </section>

        {/* TASKS AND EXPECTED RESULTS */}
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">

          {/* TASK CHECKLIST */}
          <section className={panel}>

            <div className="flex items-center justify-between gap-3">

              <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                02. Your Tasks
              </p>

              <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                {checkedTasks.length}/{mission.tasks.length}
              </span>

            </div>

            <h2 className="mt-2 text-xl font-bold">
              Build It Step by Step
            </h2>

            <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
              Check each task after completing it.
            </p>

            <ol className="mt-5 space-y-3">

              {mission.tasks.map((task, index) => {
                const done = checkedTasks.includes(index);

                return (
                  <li key={index}>

                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                        done
                          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-400/10"
                          : "border-slate-200 hover:border-blue-400 dark:border-slate-700 dark:bg-[#10182c] dark:hover:border-cyan-400"
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleTask(index)}
                        className="peer sr-only"
                      />

                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blue-500 ${
                          done
                            ? "bg-emerald-500 text-white"
                            : "bg-blue-50 text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300"
                        }`}
                      >
                        {done ? "✓" : String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="pt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {task}
                      </span>

                    </label>

                  </li>
                );
              })}

            </ol>

            {progress === 100 && (
              <p
                role="status"
                className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
              >
                ✓ All practice tasks checked!
              </p>
            )}

          </section>

          {/* EXPECTED RESULT */}
          <section className={panel}>

            <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
              03. Expected Result
            </p>

            <h2 className="mt-2 text-xl font-bold">
              What Success Looks Like
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {mission.completedWhen}
            </p>

            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">

              <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                ✓ Completion Check
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                {mission.check}
              </p>

            </div>

            {/* Display the expected result when an image is available. */}
            {mission.image ? (
              <figure className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-[#080d1e]">

                <a
                  href={mission.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-zoom-in"
                >
                  <Image
                    src={mission.image}
                    alt={`Expected result for Mission ${mission.number}: ${mission.title}`}
                    width={1200}
                    height={800}
                    className="h-auto w-full object-contain"
                  />
                </a>

                <figcaption className="border-t border-slate-200 p-3 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Expected Result - Click to enlarge
                </figcaption>

              </figure>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-xs leading-6 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Use the completion check to compare your work with the expected result.
              </div>
            )}

          </section>

        </div>

        {/* HINTS AND SOLUTIONS */}
        <section className={`${panel} mt-5`}>

          <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
            04. Hints & Solutions
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Need a Little Help?
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try solving the mission before revealing the answer.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {[1, 2].map((hint) => (
              <button
                key={hint}
                type="button"
                aria-expanded={visibleHint === hint}
                onClick={() =>
                  setVisibleHint(
                    visibleHint === hint ? 0 : hint,
                  )
                }
                className={`rounded-xl border p-3 text-left text-sm font-semibold transition-colors ${
                  visibleHint === hint
                    ? "border-blue-500 bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950"
                    : "border-blue-200 bg-blue-50 text-blue-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
                }`}
              >
                Hint {hint} — {hint === 1 ? "A gentle nudge" : "A stronger clue"}
              </button>
            ))}

          </div>

          {visibleHint !== 0 && (
            <div className="mt-3 rounded-xl bg-blue-50 p-4 text-sm leading-7 text-slate-700 dark:bg-[#101b31] dark:text-slate-200">

              {visibleHint === 1
                ? mission.hint1
                : mission.hint2}

            </div>
          )}

          {/* Reference solution */}
          <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <h3 className="text-sm font-bold">
                  Reference Solution
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Reveal the solution to compare your code.
                </p>
              </div>

              <button
                type="button"
                aria-expanded={answerVisible}
                onClick={() => {
                  setAnswerVisible(!answerVisible);
                  setCopied(false);
                  setCopyError(false);
                }}
                className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"
              >
                {answerVisible
                  ? "Hide Solution"
                  : "Reveal Final Answer"}
              </button>

            </div>

            {answerVisible && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-700 bg-[#080d1e]">

                <div className="flex items-center justify-between border-b border-slate-700 bg-[#151d34] p-3">

                  <span className="font-mono text-xs font-bold uppercase text-cyan-300">
                    {mission.solutionLanguage}
                  </span>

                  <button
                    type="button"
                    onClick={copySolution}
                    className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:border-cyan-400"
                  >
                    {copied ? "✓ Copied" : "Copy Code"}
                  </button>

                </div>

                {copyError && (
                  <p role="alert" className="p-3 text-xs text-red-300">
                    Unable to copy. Select and copy the code manually.
                  </p>
                )}

                <pre className="max-h-[500px] overflow-auto p-4 font-mono text-xs leading-7 text-slate-200 sm:text-sm">
                  <code>{mission.solution}</code>
                </pre>

              </div>
            )}

          </div>

        </section>

        {/* MISSION NAVIGATION */}
        <nav
          aria-label="Mission navigation"
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#151d34]"
        >

          <Link
            href={
              previousMission
                ? missionHref(previousMission)
                : `${projectRoute}#levels`
            }
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold hover:border-blue-400 dark:border-slate-700"
          >
            {previousMission
              ? "← Previous Mission"
              : "← Learning Roadmap"}
          </Link>

          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {mission.number} / {ecommerceMissions.length}
          </span>

          {nextMission ? (
            <Link
              href={missionHref(nextMission)}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950"
            >
              {nextMission.level !== mission.level
                ? "Next Level →"
                : "Next Mission →"}
            </Link>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {progress === 100 ? (
                <Link
                  href={`${projectRoute}/assessment`}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950"
                >
                  Take Final Assessment →
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    Take Final Assessment
                  </button>

                  <p className="text-xs text-amber-600 dark:text-amber-300">
                    Complete all tasks to continue.
                  </p>
                </>
              )}
            </div>
          )}

        </nav>

        <p className="mt-8 text-center font-mono text-xs font-bold tracking-widest text-blue-600 dark:text-cyan-300">
          LEARN. BUILD. GROW.
        </p>

      </div>
    </main>
  );
}


