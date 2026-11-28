import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGuidedLearningPath } from "@/lib/guided-projects/guided-server";
import MissionImagePreview from "@/app/projects/personal-portfolio/levels/[levelNumber]/MissionImagePreview";

const baseRoute = "/projects/quiz-application";

type MissionIconKind =
  | "code"
  | "layout"
  | "content"
  | "palette"
  | "profile"
  | "mobile"
  | "interaction";

// Cosmetic icon choices only. Mission content and numbering come from Supabase.
const missionIcons: Record<number, MissionIconKind> = {
  1: "code",
  2: "layout",
  3: "profile",
  4: "content",
  5: "code",
  6: "layout",
  7: "content",
  8: "palette",
  9: "layout",
  10: "profile",
  11: "layout",
  12: "mobile",
  13: "interaction",
  14: "interaction",
};

function missionHref(levelNumber: number, missionNumber: number) {
  return `${baseRoute}/levels/${levelNumber}/missions/${missionNumber}`;
}

// Given items were authored with simple Markdown emphasis in the seed data.
// Present their text cleanly without requiring a Markdown renderer.
function readableGiven(item: string) {
  return item.replace(/\*\*/g, "").replace(/`/g, "");
}

// Tiny built-in icons keep the roadmap dependency-free.
function MissionIcon({ kind }: { kind: MissionIconKind }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      {...common}
    >
      {kind === "code" && (
        <>
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </>
      )}
      {kind === "layout" && (
        <>
          <rect x="3" y="4" width="18" height="15" rx="2" />
          <path d="M3 9h18M9 9v10M8 22h8" />
        </>
      )}
      {kind === "content" && (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </>
      )}
      {kind === "palette" && (
        <>
          <path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4c-.7-.7-.4-1.8.6-1.8h1.5A4.3 4.3 0 0 0 21 11.5 8.5 8.5 0 0 0 12 3Z" />
          <circle cx="7.5" cy="11" r="1" />
          <circle cx="10" cy="7" r="1" />
          <circle cx="15.5" cy="8" r="1" />
        </>
      )}
      {kind === "profile" && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.3 3.1-7 8-7s8 2.7 8 7" />
        </>
      )}
      {kind === "mobile" && (
        <>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M10 18h4" />
        </>
      )}
      {kind === "interaction" && (
        <>
          <path d="M8 3v11l3.3-2.5L14.5 18l3-1.5-3.2-6.3L19 10 8 3Z" />
          <path d="M5 5 3 3M4 9H2M10 4V2" />
        </>
      )}
    </svg>
  );
}

type PageProps = {
  params: Promise<{ levelNumber: string }>;
};

export default async function LevelRoadmapPage({ params }: PageProps) {
  const { levelNumber } = await params;
  const currentNumber = Number(levelNumber);

  if (
    !Number.isInteger(currentNumber) ||
    currentNumber <= 0 ||
    levelNumber !== String(currentNumber)
  ) {
    notFound();
  }

  // Keep the same authentication requirement as mission pages.
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect(
      `/login?next=${encodeURIComponent(`${baseRoute}/levels/${levelNumber}`)}`,
    );
  }

  // Use the SAME ordered Supabase learning path as the Mission Workspace.
  const { levels, missions } = await getGuidedLearningPath("quiz-application");
  const level = levels[currentNumber];
  const levelMissions = missions.filter(
    (mission) => mission.level === currentNumber,
  );

  if (!level || levelMissions.length === 0) {
    notFound();
  }

  const levelNumbers = Object.keys(levels)
    .map(Number)
    .sort((a, b) => a - b);
  const levelIndex = levelNumbers.indexOf(currentNumber);
  const previousLevel = levelNumbers[levelIndex - 1] ?? null;
  const nextLevel = levelNumbers[levelIndex + 1] ?? null;

  // Official completion status is loaded from mission_progress, never inferred
  // from client-side checkbox positions.
  const { data: progressRows, error: progressError } = await supabase
    .from("mission_progress")
    .select("mission_id")
    .eq("user_id", data.claims.sub)
    .in(
      "mission_id",
      missions.map((mission) => mission.id),
    );

  if (progressError) {
    console.error("Unable to load roadmap progress:", progressError.message);
    throw new Error("Unable to load your roadmap progress. Please try again.");
  }

  const completedMissionIds = new Set(
    (progressRows ?? []).map((row) => row.mission_id),
  );

  // Only the first unfinished mission is available; future missions are locked.
  const currentMission =
    missions.find((mission) => !completedMissionIds.has(mission.id)) ?? null;

  const completedInLevel = levelMissions.filter((mission) =>
    completedMissionIds.has(mission.id),
  ).length;
  const levelPercent = Math.round(
    (completedInLevel / levelMissions.length) * 100,
  );
  const levelIsComplete = completedInLevel === levelMissions.length;
  const availableMissionInLevel = levelMissions.find(
    (mission) => mission.id === currentMission?.id,
  );

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f5f9ff] text-slate-900 transition-colors dark:bg-[#050b1d] dark:text-white">
      {/* Subtle programming grid and ambient lights. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09] dark:opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage: "linear-gradient(to bottom, black, transparent 90%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-24 h-[520px] w-[520px] rounded-full bg-blue-400/10 blur-[120px] dark:bg-cyan-400/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-[480px] h-[640px] w-[640px] rounded-full bg-cyan-400/10 blur-[120px] dark:bg-blue-600/15"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-9 sm:px-6 lg:px-8">
        {/* Keep the learner oriented in the project. */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/projects"
            className="transition-colors hover:text-blue-600 dark:hover:text-cyan-300"
          >
            Projects
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`${baseRoute}#levels`}
            className="transition-colors hover:text-blue-600 dark:hover:text-cyan-300"
          >
            Quiz Application
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-blue-700 dark:text-cyan-300">
            Level {level.number}
          </span>
        </nav>

        {/* Level header, inspired by the approved neon roadmap concept. */}
        <header className="relative mx-auto mt-12 max-w-4xl text-center">
          <p className="font-mono text-[11px] font-extrabold uppercase tracking-[0.3em] text-blue-600 dark:text-cyan-300">
            ── 961-DEV / GUIDED LEARNING ──
          </p>
          <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/70 bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100 text-blue-700 shadow-lg shadow-cyan-300/20 dark:border-cyan-400/40 dark:from-cyan-400/20 dark:via-blue-500/15 dark:to-blue-900/40 dark:text-cyan-300 dark:shadow-cyan-400/20">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />
            </svg>
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            Level {level.number} of {levelNumbers.length}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Mission{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-400 dark:to-blue-400">
              Roadmap
            </span>
          </h1>
          <h2 className="mt-5 text-lg font-bold text-slate-800 dark:text-white sm:text-xl">
            {level.name}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            {level.description} Follow the connected missions to build your
            quiz one meaningful step at a time.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold text-blue-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
              {levelMissions.length} Guided Missions
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              HTML / CSS / JavaScript
            </span>
          </div>

          {/* Real progress from mission_progress records. */}
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-blue-200/80 bg-white/85 px-6 py-5 text-left shadow-sm dark:border-cyan-400/20 dark:bg-[#101b32]/90">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">Level Progress</p>
              <p className="font-mono text-sm font-extrabold text-blue-700 dark:text-cyan-300">
                {levelPercent}%
              </p>
            </div>
            <div
              role="progressbar"
              aria-label={`Level ${level.number} completion`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={levelPercent}
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100 dark:bg-slate-700"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
              <span>
                {completedInLevel} of {levelMissions.length} missions completed
              </span>
              <span className="font-semibold text-blue-700 dark:text-cyan-300">
                {levelIsComplete
                  ? "✓ Level Completed"
                  : availableMissionInLevel
                    ? "● Ready to learn"
                    : "Complete previous levels first"}
              </span>
            </div>
            {availableMissionInLevel && (
              <Link
                href={missionHref(
                  availableMissionInLevel.level,
                  availableMissionInLevel.number,
                )}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:from-cyan-300 dark:to-cyan-400 dark:text-[#061329]"
              >
                Continue Mission {availableMissionInLevel.number}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </header>

        {/* Objective and Given are separate from the roadmap so learners can refer to them. */}
        <section
          aria-label="Level preparation"
          className="mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-2"
        >
          <div className="rounded-[24px] border border-blue-200/80 bg-white/85 p-6 shadow-sm backdrop-blur-sm dark:border-cyan-400/20 dark:bg-[#101b32]/90 sm:p-7">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-cyan-300">
              01 / Your objective
            </p>
            <h3 className="mt-3 text-xl font-extrabold">
              What you will achieve
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {level.goal}
            </p>
          </div>
          <div className="rounded-[24px] border border-blue-200/80 bg-white/85 p-6 shadow-sm backdrop-blur-sm dark:border-cyan-400/20 dark:bg-[#101b32]/90 sm:p-7">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-cyan-300">
              02 / Your given
            </p>
            <h3 className="mt-3 text-xl font-extrabold">
              Tools and starting knowledge
            </h3>
            <ul className="mt-4 space-y-2.5">
              {level.given.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 font-bold text-blue-600 dark:text-cyan-300"
                  >
                    ✓
                  </span>
                  <span>{readableGiven(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mx-auto mt-16 max-w-5xl text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            03 / Follow the path
          </p>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            Your Missions
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Select a mission to preview its expected result, then open the
            workspace when it is available.
          </p>
        </div>

        {/* Zigzag route: center rail on desktop, left rail on mobile. */}
        <section
          aria-label="Connected mission roadmap"
          className="relative mx-auto mt-12 max-w-6xl"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-20 left-[23px] top-10 w-[3px] rounded-full bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="relative space-y-8 md:space-y-10">
            {levelMissions.map((mission, index) => {
              const isCompleted = completedMissionIds.has(mission.id);
              const isCurrent = currentMission?.id === mission.id;
              const isLocked = !isCompleted && !isCurrent;

              return (
                <li key={mission.number} className="relative min-h-[215px]">
                  {/* Horizontal connector from roadmap center to card, desktop only. */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-[60px] hidden h-[2px] w-16 bg-cyan-400/75 shadow-[0_0_10px_rgba(34,211,238,0.55)] md:block ${index % 2 === 0 ? "left-[calc(50%-64px)]" : "left-1/2"}`}
                  />

                  {/* Roadmap markers now reflect real completion status. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[38px] z-20 flex h-12 w-12 items-center justify-center rounded-full border-[3px] bg-[#f5f9ff] font-mono text-lg font-extrabold dark:bg-[#061329] md:left-1/2 md:-translate-x-1/2 ${
                      isCompleted
                        ? "border-emerald-400 text-emerald-700 shadow-[0_0_18px_rgba(16,185,129,0.25)] dark:text-emerald-300"
                        : isCurrent
                          ? "border-cyan-400 text-blue-700 shadow-[0_0_0_5px_rgba(34,211,238,0.12),0_0_22px_rgba(6,182,212,0.35)] dark:text-white"
                          : "border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </span>

                  <div
                    className={`ml-[72px] w-[calc(100%-72px)] md:w-[calc(50%-64px)] ${index % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:ml-auto"}`}
                  >
                    <details className="group relative isolate overflow-hidden rounded-[26px] border border-blue-200 bg-white/95 shadow-[0_15px_45px_rgba(26,80,160,0.07)] transition-all duration-300 open:border-cyan-400 open:shadow-[0_20px_55px_rgba(6,182,212,0.15)] dark:border-cyan-400/25 dark:bg-[#111d35]/95 dark:shadow-[0_18px_55px_rgba(0,0,0,0.28)] dark:open:border-cyan-300/75 dark:open:shadow-[0_18px_60px_rgba(6,182,212,0.18)]">
                      {/* Edge lighting, never obstructing the content. */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-20 -right-12 h-40 w-56 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/25"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                      />

                      <summary className="relative cursor-pointer list-none p-5 outline-offset-[-5px] marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 [&::-webkit-details-marker]:hidden sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full border border-cyan-300/70 bg-cyan-50 px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
                            Mission {mission.number}
                          </span>
                          <span
                            className={`ml-auto rounded-full px-3 py-1 text-[10px] font-bold ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
                                : isCurrent
                                  ? "bg-blue-100 text-blue-800 dark:bg-cyan-400/10 dark:text-cyan-300"
                                  : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                            }`}
                          >
                            {isCompleted
                              ? "✓ Completed"
                              : isCurrent
                                ? "● Available"
                                : "🔒 Locked"}
                          </span>
                          <span
                            aria-hidden="true"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-xl font-bold text-blue-700 transition-transform duration-300 group-open:rotate-45 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
                          >
                            +
                          </span>
                        </div>

                        <div className="mt-5 flex items-start gap-4">
                          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-200 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 dark:border-cyan-400/20 dark:from-cyan-400/20 dark:to-blue-500/10 dark:text-cyan-300">
                            <MissionIcon
                              kind={missionIcons[mission.number] ?? "code"}
                            />
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-lg font-extrabold leading-snug sm:text-xl">
                              {mission.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {mission.why}
                            </p>
                            <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-500/10 dark:from-cyan-300 dark:to-cyan-400 dark:text-[#061329]">
                              View Mission Preview{" "}
                              <span aria-hidden="true">→</span>
                            </span>
                          </div>
                        </div>
                      </summary>

                      <div className="relative border-t border-slate-200/80 px-5 pb-6 pt-5 dark:border-white/10 sm:px-6">
                        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-cyan-300">
                          Expected result
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {mission.completedWhen ||
                            mission.check ||
                            "Complete the steps described in this mission."}
                        </p>
                        {mission.image ? (
                          // The image stays medium-sized here and opens a larger
                          // accessible popup without leaving the roadmap page.
                          <MissionImagePreview
                            src={mission.image}
                            alt={`Expected result of Mission ${mission.number}: ${mission.title}`}
                            missionNumber={mission.number}
                            missionTitle={mission.title}
                          />
                        ) : (
                          <p className="mt-4 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4 text-xs leading-6 text-blue-800 dark:border-cyan-400/20 dark:bg-cyan-400/5 dark:text-cyan-200">
                            This mission prepares the HTML foundation, so the
                            result is mainly a valid page structure rather than
                            a visual section.
                          </p>
                        )}
                        {/* Workspace links only appear for completed/available missions. */}
                        <div className="mt-6">
                          {isLocked ? (
                            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                              <span aria-hidden="true">🔒</span>
                              Complete earlier missions to unlock
                            </span>
                          ) : (
                            <Link
                              href={missionHref(mission.level, mission.number)}
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/15 transition-opacity hover:opacity-90 dark:from-cyan-300 dark:to-cyan-400 dark:text-[#061329]"
                            >
                              {isCompleted
                                ? "Review Completed Mission"
                                : "Start / Continue Mission"}
                              <span aria-hidden="true">→</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </details>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Level previews remain browsable; mission workspaces enforce prerequisites. */}
        <nav
          aria-label="Level navigation"
          className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-blue-200/70 pt-8 dark:border-cyan-400/20"
        >
          <Link
            href={
              previousLevel
                ? `${baseRoute}/levels/${previousLevel}`
                : `${baseRoute}#levels`
            }
            className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-cyan-400/30 dark:bg-[#111d35] dark:text-cyan-200 dark:hover:bg-cyan-400/10"
          >
            ← {previousLevel ? "Previous Level" : "Project Overview"}
          </Link>
          <Link
            href={
              nextLevel
                ? `${baseRoute}/levels/${nextLevel}`
                : `${baseRoute}#levels`
            }
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/15 transition-opacity hover:opacity-90 dark:from-cyan-300 dark:to-cyan-400 dark:text-[#061329]"
          >
            {nextLevel ? "Preview Next Level" : "Back to All Levels"} →
          </Link>
        </nav>

        <p className="mt-12 text-center text-xs font-semibold tracking-[0.2em] text-blue-600 dark:text-cyan-300">
          LEARN. BUILD. GROW.
        </p>
      </div>
    </main>
  );
}
