import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isProjectEnrolled } from "@/lib/guided-projects/enrollment";
import ProjectEnrollmentButton from "@/components/guided-projects/ProjectEnrollmentButton";

// Keep the database as the only source of truth for lesson content.
import { getGuidedLearningPath } from "@/lib/guided-projects/guided-server";

const projectRoute = "/projects/ecommerce-frontend";

function missionHref(levelNumber: number, missionNumber: number) {
  return `${projectRoute}/levels/${levelNumber}/missions/${missionNumber}`;
}

export default async function EcommerceFrontendPage() {
  // Preserve the existing authentication protection.
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect(`/login?next=${encodeURIComponent(projectRoute)}`);
  }

  // Read the same ordered lessons used by the Mission Workspace.
  const {
    levels: levelRecords,
    missions,
    projectId,
  } = await getGuidedLearningPath("ecommerce-frontend");

  // Returning learners resume their saved progress; new learners must enroll.
  const isEnrolled = await isProjectEnrolled(data.claims.sub, projectId);

  // Progress is always scoped to the signed-in learner.
  const { data: savedProgress, error: progressError } = await supabase
    .from("mission_progress")
    .select("mission_id")
    .eq("user_id", data.claims.sub)
    .in(
      "mission_id",
      missions.map((mission) => mission.id),
    );

  if (progressError) {
    console.error("Unable to load guided progress:", progressError.message);
    throw new Error("Unable to load your guided progress. Please try again.");
  }

  const completedMissionIds = new Set(
    (savedProgress ?? []).map((record) => record.mission_id),
  );

  const totalMissions = missions.length;
  const completedMissions = missions.filter((mission) =>
    completedMissionIds.has(mission.id),
  ).length;
  const progressPercent =
    totalMissions > 0
      ? Math.round((completedMissions / totalMissions) * 100)
      : 0;

  // A project is complete only after the learner finishes its missions
  // AND submits the final assessment. Mission progress alone is not enough.
  let projectCompleted = false;
  let assessmentScore: {
    correctAnswers: number;
    totalQuestions: number;
  } | null = null;

  if (totalMissions > 0 && completedMissions === totalMissions) {
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("id")
      .eq("project_id", projectId)
      .maybeSingle();

    if (assessmentError) {
      console.error(
        "Unable to find guided assessment:",
        assessmentError.message,
      );
      throw new Error("Unable to load your project completion status.");
    }

    if (assessment) {
      const { data: result, error: resultError } = await supabase
        .from("assessment_progress")
        .select("correct_answers, total_questions")
        .eq("user_id", data.claims.sub)
        .eq("assessment_id", assessment.id)
        .maybeSingle();

      if (resultError) {
        console.error(
          "Unable to load guided assessment progress:",
          resultError.message,
        );
        throw new Error("Unable to load your project completion status.");
      }

      projectCompleted = Boolean(result);
      if (result?.correct_answers != null && result?.total_questions != null) {
        assessmentScore = {
          correctAnswers: result.correct_answers,
          totalQuestions: result.total_questions,
        };
      }
    }
  }

  // The first unfinished mission is the only new mission currently available.
  const currentMissionIndex = missions.findIndex(
    (mission) => !completedMissionIds.has(mission.id),
  );
  const currentMission =
    currentMissionIndex === -1 ? null : missions[currentMissionIndex];

  // Display numbers come from the ordered database records. URLs use
  // each mission's real level and mission numbers, not array positions.
  const overviewMissions = missions.map((mission, index) => ({
    ...mission,
    displayNumber: index + 1,
    status: completedMissionIds.has(mission.id)
      ? ("completed" as const)
      : isEnrolled && index === currentMissionIndex
        ? ("available" as const)
        : ("locked" as const),
  }));

  const levels = Object.values(levelRecords)
    .sort((a, b) => a.number - b.number)
    .map((level) => {
      const levelMissions = overviewMissions.filter(
        (mission) => mission.level === level.number,
      );
      const completedCount = levelMissions.filter(
        (mission) => mission.status === "completed",
      ).length;

      const status =
        levelMissions.length > 0 && completedCount === levelMissions.length
          ? "completed"
          : levelMissions.some((mission) => mission.status === "available")
            ? "available"
            : "locked";

      return {
        number: level.number,
        title: level.name,
        description: level.description,
        outcome: level.goal,
        missions: levelMissions,
        completedCount,
        status,
      };
    });

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#080d1e] dark:text-white">
      {/* Decorative background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[700px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300"
          >
            <span aria-hidden="true">←</span>
            Back to Projects
          </Link>
        </nav>

        {/* PROJECT HERO */}
        <section className="mt-9 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                Hard Level
              </span>

              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                Guided Project 03
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Build a Responsive
              <span className="mt-1 block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
                E-commerce Frontend
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Build a responsive online store with a product catalog, search and
              filtering, a shopping cart, and a simulated checkout.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              You will create the store step by step: write semantic HTML, style
              responsive product cards, then implement search, cart
              calculations, and Local Storage persistence.
            </p>

            {/* Technologies */}
            <div className="mt-7 flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript"].map((technology) => (
                <span
                  key={technology}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-[#151d34] dark:text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>

            {/* Project statistics */}
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/70 dark:bg-[#151d34]">
                <p className="text-2xl font-extrabold text-blue-600 dark:text-cyan-300">
                  {levels.length}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Levels
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/70 dark:bg-[#151d34]">
                <p className="text-2xl font-extrabold text-blue-600 dark:text-cyan-300">
                  {totalMissions}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Missions
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/70 dark:bg-[#151d34]">
                <p className="text-2xl font-extrabold text-blue-600 dark:text-cyan-300">
                  3
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Technologies
                </p>
              </div>
            </div>

            {/* Working in-page navigation */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#levels"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                Explore Learning Levels
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href="#preview"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-[#151d34] dark:text-slate-200 dark:hover:border-cyan-400"
              >
                View Final Result
              </a>

              {!isEnrolled ? (
                <div className="flex flex-col items-start gap-2">
                  <ProjectEnrollmentButton slug="ecommerce-frontend" id="enrollment" />
                  <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">
                    Start this project to unlock the roadmap and save your progress.
                  </p>
                </div>
              ) : currentMission ? (
                <Link
                  href={missionHref(
                    currentMission.level,
                    currentMission.number,
                  )}
                  className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-6 py-3.5 text-sm font-bold text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200 dark:hover:bg-cyan-400/20"
                >
                  Continue Learning →
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-xl bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  All Missions Completed ✓
                </span>
              )}
            </div>
          </div>

          {/* ACTUAL PORTFOLIO SCREENSHOTS */}
          <section
            id="preview"
            aria-label="Finished store previews"
            className="scroll-mt-24"
          >
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50 dark:border-slate-700/70 dark:bg-[#151d34] dark:shadow-black/20 sm:p-4">
              <div className="mb-4 flex items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <span className="font-mono text-[10px] text-slate-400 sm:text-xs">
                  index.html
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <Image
                  src="/projects/ecommerce-frontend/mission-14.png"
                  alt="Completed store interface with a product grid and shopping cart."
                  width={1101}
                  height={602}
                  priority
                  className="h-auto w-full"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="relative h-36 bg-slate-100 dark:bg-slate-800 sm:h-44">
                    <Image
                      src="/projects/ecommerce-frontend/mission-08.png"
                      alt="Project screenshot of store progress."
                      fill
                      sizes="(max-width: 1024px) 45vw, 250px"
                      className="object-cover object-top"
                    />
                  </div>

                  <p className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Product Showcase
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="relative h-36 bg-slate-100 dark:bg-slate-800 sm:h-44">
                    <Image
                      src="/projects/ecommerce-frontend/mission-12.png"
                      alt="Another preview of the store application."
                      fill
                      sizes="(max-width: 1024px) 45vw, 250px"
                      className="object-cover object-top"
                    />
                  </div>

                  <p className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Shopping Cart
                  </p>
                </div>
              </div>

              <p className="mt-4 px-2 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                This is what you&apos;ll build by completing all {levels.length}{" "}
                levels.
              </p>
            </div>
          </section>
        </section>

        {/* LEARNING OUTCOMES */}
        <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700/70 dark:bg-[#151d34] sm:p-8">
          <div className="grid gap-8 md:grid-cols-[0.65fr_1fr]">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                What you will achieve
              </p>

              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Learn by Building
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Each concept is introduced when you need it, so you understand
                how your code contributes to the finished application.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                "Structure a store with semantic HTML and reusable sections.",
                "Build a responsive product catalog using CSS Grid.",
                "Render product data dynamically with JavaScript.",
                "Implement search and category filters.",
                "Manage quantities and calculate cart totals accurately.",
                "Preserve cart state and test a simulated checkout.",
              ].map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300"
                  >
                    ✓
                  </span>

                  <span className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FIVE LEVELS AND ROADMAP PREVIEWS */}
        <section
          id="levels"
          aria-labelledby="levels-heading"
          className="mt-20 scroll-mt-24"
        >
          <div className="mb-8">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
              Your learning journey
            </p>

            <h2
              id="levels-heading"
              className="mt-3 text-3xl font-extrabold sm:text-4xl"
            >
              {levels.length} Levels. One Complete Store.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Follow the levels in order. Each level contains missions that
              break the work into smaller, understandable steps. Select a level
              below to preview its mission roadmap and track your progress.
            </p>
          </div>

          <div className="space-y-4">
            {levels.map((level) => (
              <details
                key={level.number}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors open:border-blue-300 dark:border-slate-700/70 dark:bg-[#151d34] dark:open:border-cyan-400/40"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 marker:hidden [&::-webkit-details-marker]:hidden sm:gap-6 sm:p-6">
                  {/* Level number */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 font-mono text-xl font-extrabold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                    {String(level.number).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                      Level {level.number}
                    </p>

                    <h3 className="text-base font-bold sm:text-xl">
                      {level.title}
                    </h3>

                    <p className="mt-2 hidden text-sm leading-6 text-slate-500 dark:text-slate-400 sm:block">
                      {level.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:inline-flex">
                      {level.completedCount}/{level.missions.length} Missions
                    </span>

                    <span
                      className={
                        level.status === "completed"
                          ? "rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                          : level.status === "available"
                            ? "rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                            : "rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }
                    >
                      {level.status === "completed"
                        ? "Completed"
                        : level.status === "available"
                          ? "In Progress"
                          : "Locked"}
                    </span>

                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-xl text-blue-600 transition-transform group-open:rotate-180 dark:border-slate-700 dark:text-cyan-300"
                    >
                      ↓
                    </span>
                  </div>
                </summary>

                {/* Expandable mission roadmap */}
                <div className="border-t border-slate-200 px-5 pb-7 pt-6 dark:border-slate-700/70 sm:px-8">
                  <div className="mb-7 rounded-xl bg-blue-50 p-4 dark:bg-[#101b31]">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300">
                      Level Objective
                    </p>

                    <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {level.outcome}
                    </p>
                  </div>

                  <p className="mb-6 text-sm font-bold text-slate-900 dark:text-white">
                    Mission Roadmap
                  </p>

                  <ol className="relative ml-5 space-y-7 border-l-2 border-blue-200 pl-9 dark:border-cyan-400/30">
                    {level.missions.map((mission, index) => {
                      const details = (
                        <>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Mission {mission.displayNumber}
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                            {mission.title}
                          </p>

                          <p
                            className={
                              mission.status === "completed"
                                ? "mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300"
                                : mission.status === "available"
                                  ? "mt-2 text-xs font-semibold text-blue-600 dark:text-cyan-300"
                                  : "mt-2 text-xs font-semibold text-slate-400"
                            }
                          >
                            {mission.status === "completed"
                              ? "✓ Completed"
                              : mission.status === "available"
                                ? "● Ready to work on"
                                : "🔒 Locked"}
                          </p>
                        </>
                      );

                      return (
                        <li key={mission.id} className="relative">
                          <span
                            aria-hidden="true"
                            className={
                              mission.status === "completed"
                                ? "absolute -left-[55px] top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 font-mono text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                                : mission.status === "available"
                                  ? "absolute -left-[55px] top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-500 bg-white font-mono text-xs font-bold text-blue-600 dark:border-cyan-400 dark:bg-[#151d34] dark:text-cyan-300"
                                  : "absolute -left-[55px] top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 font-mono text-xs font-bold text-slate-500 dark:border-slate-600 dark:bg-slate-800"
                            }
                          >
                            {index + 1}
                          </span>

                          {mission.status === "locked" ? (
                            <div className="rounded-lg p-2 opacity-60">
                              {details}
                            </div>
                          ) : (
                            <Link
                              href={missionHref(mission.level, mission.number)}
                              className="block rounded-lg p-2 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-cyan-400/10"
                            >
                              {details}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {level.completedCount} of {level.missions.length} missions
                      completed
                    </p>

                    {level.status === "locked" ? (
                      <span className="text-xs font-semibold text-slate-400">
                        {isEnrolled
                          ? "Complete earlier missions to unlock this level"
                          : "Start this project to unlock its missions"}
                      </span>
                    ) : (
                      <Link
                        href={`${projectRoute}/levels/${level.number}`}
                        className="text-sm font-bold text-blue-600 hover:underline dark:text-cyan-300"
                      >
                        Open Level Roadmap →
                      </Link>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* LIVE LEARNER PROGRESS */}
        <section
          aria-labelledby="portfolio-progress-heading"
          className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/70 p-6 dark:border-cyan-400/20 dark:bg-cyan-400/5 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300"
              >
                ◉
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    id="portfolio-progress-heading"
                    className="text-lg font-bold"
                  >
                    Your Learning Progress
                  </h2>
                  {projectCompleted ? (
                    <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                      ✓ Project Completed
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {completedMissions} of {totalMissions} missions officially
                  completed. {isEnrolled
                    ? "Your progress is saved to your account."
                    : "Start this project to begin saving progress."}
                </p>
              </div>
            </div>

            <span className="font-mono text-3xl font-extrabold text-blue-600 dark:text-cyan-300">
              {progressPercent}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="E-commerce Frontend mission progress"
            aria-valuemin={0}
            aria-valuemax={totalMissions}
            aria-valuenow={completedMissions}
            className="mt-6 h-3 overflow-hidden rounded-full bg-blue-100 dark:bg-slate-800"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {!isEnrolled
                ? "Enroll to unlock your learning journey."
                : currentMission
                  ? `Up next: ${currentMission.title}`
                : projectCompleted
                  ? `Project complete!${assessmentScore ? ` Assessment score: ${assessmentScore.correctAnswers}/${assessmentScore.totalQuestions}.` : ""}`
                  : "All missions completed! Finish the final assessment to complete the project."}
            </p>

            {!isEnrolled ? (
              <ProjectEnrollmentButton slug="ecommerce-frontend" />
            ) : currentMission ? (
              <Link
                href={missionHref(currentMission.level, currentMission.number)}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                Continue Mission →
              </Link>
            ) : (
              <Link
                href={`${projectRoute}/assessment`}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white transition-opacity hover:opacity-90 dark:from-cyan-300 dark:to-cyan-400 dark:text-slate-950"
              >
                {projectCompleted
                  ? "View Saved Results →"
                  : "Take Final Assessment →"}
              </Link>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <div className="mt-16 border-t border-slate-200 pt-8 text-center dark:border-slate-700/70">
          <p className="text-sm font-bold text-blue-600 dark:text-cyan-300">
            Learn. Build. Grow.
          </p>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Build a responsive online store, one meaningful mission at a time.
          </p>

          <Link
            href="/projects"
            className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-cyan-300"
          >
            Explore Other Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
