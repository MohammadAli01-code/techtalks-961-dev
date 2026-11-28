"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { savePortfolioTaskProgress } from "@/app/projects/personal-portfolio/portfolio-progress-actions";
import { completePortfolioMission } from "@/app/projects/personal-portfolio/portfolio-completion-actions";
import { completeGuidedMission } from "@/app/projects/guided-completion-actions";

// Keep this interface compatible with the existing Portfolio mission data.
// Other guided projects can reuse the same workspace later.
export type GuidedMission = {
  id: number;
  taskItems: { id: number; number: number; instruction: string }[];
  number: number;
  level: number;
  levelTitle: string;
  title: string;
  why: string;
  workIn: string;
  tasks: string[];
  completedWhen: string;
  hint1: string;
  hint2: string;
  solutionLanguage: string;
  solution: string;
  check: string;
};

type MissionWorkspaceProps = {
  mission: GuidedMission;
  projectName: string;
  totalMissions: number;
  levelGoal: string;
  levelGiven: string[];
  roadmapHref: string;
  previousMission?: { label: string; href: string };
  nextMission?: { label: string; href: string; level?: number };
  imagePreview?: ReactNode;
  initialCompletedTaskIds: number[];
  initialMissionCompleted: boolean;
  projectSlug?: "quiz-application" | "ecommerce-frontend";
  finalAssessmentHref?: string;
};

type IconName =
  | "arrow"
  | "back"
  | "check"
  | "code"
  | "copy"
  | "file"
  | "flag"
  | "image"
  | "lightbulb"
  | "list"
  | "route"
  | "sparkle"
  | "terminal";

// Small inline icons; no icon library or extra dependency required.
function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const shared = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "arrow":
      return (
        <svg {...shared}>
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      );
    case "back":
      return (
        <svg {...shared}>
          <path d="M19 12H5m6-6-6 6 6 6" />
        </svg>
      );
    case "check":
      return (
        <svg {...shared}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "code":
      return (
        <svg {...shared}>
          <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14" />
        </svg>
      );
    case "copy":
      return (
        <svg {...shared}>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      );
    case "file":
      return (
        <svg {...shared}>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <path d="M14 3v6h6M8 14h8m-8 4h5" />
        </svg>
      );
    case "flag":
      return (
        <svg {...shared}>
          <path d="M5 21V5m0 0c6-4 8 4 14 0v11c-6 4-8-4-14 0" />
        </svg>
      );
    case "image":
      return (
        <svg {...shared}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 16-5-5L5 21" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg {...shared}>
          <path d="M9 18h6m-5 3h4M9 15c-1.5-1.1-3-2.7-3-5a6 6 0 0 1 12 0c0 2.3-1.5 3.9-3 5l-.5 1.5h-5L9 15Z" />
        </svg>
      );
    case "list":
      return (
        <svg {...shared}>
          <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      );
    case "route":
      return (
        <svg {...shared}>
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
          <path d="M8 18h7a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h7" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...shared}>
          <path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Zm7 13 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...shared}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 9 3 3-3 3m6 0h4" />
        </svg>
      );
  }
}

// Preserve inline **bold** and `code` from our approved mission tutorial.
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={index}
              className="font-bold text-slate-950 dark:text-white"
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="break-words rounded-md border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

const panel =
  "overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,45,94,0.045)] dark:border-white/10 dark:bg-[#0d1930] dark:shadow-[0_18px_65px_rgba(0,0,0,0.18)]";

function SectionHeading({
  step,
  eyebrow,
  title,
  description,
  icon,
}: {
  step: string;
  eyebrow: string;
  title: string;
  description?: string;
  icon: IconName;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] font-extrabold uppercase tracking-[0.22em] text-blue-600 dark:text-cyan-300">
          {step} / {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function MissionWorkspace({
  mission,
  projectName,
  totalMissions,
  levelGoal,
  levelGiven,
  roadmapHref,
  previousMission,
  nextMission,
  imagePreview,
  initialCompletedTaskIds,
  initialMissionCompleted,
  projectSlug,
  finalAssessmentHref,
}: MissionWorkspaceProps) {
  // Task checkmarks and official completion are loaded from Supabase on the server.
  const router = useRouter();
  const confirmationDialogRef = useRef<HTMLDialogElement>(null);
  const [readyConfirmed, setReadyConfirmed] = useState(false);
  const [checkedTaskIds, setCheckedTaskIds] = useState<number[]>(
    initialCompletedTaskIds,
  );
  const [missionCompleted, setMissionCompleted] = useState(
    initialMissionCompleted,
  );
  const [savingTaskId, setSavingTaskId] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [visibleHint, setVisibleHint] = useState<0 | 1 | 2>(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalTasks = mission.taskItems.length;
  const tasksChecked = checkedTaskIds.length;
  const practicePercent = totalTasks
    ? Math.round((tasksChecked / totalTasks) * 100)
    : 0;
  const allTasksChecked =
    totalTasks > 0 && tasksChecked === totalTasks && savingTaskId === null;
  const canConfirm = allTasksChecked && !isCompleting;
  const enteringNextLevel = Boolean(
    nextMission &&
    nextMission.level !== undefined &&
    nextMission.level !== mission.level,
  );
  // The assessment belongs to the project that owns this level roadmap.
  // Derive the link from the existing route to keep this workspace reusable.
  const assessmentHref = finalAssessmentHref ?? `${roadmapHref.split("/levels/")[0]}/assessment`;

  function askToContinue() {
    if (missionCompleted) {
      router.push(nextMission?.href ?? assessmentHref);
      return;
    }
    if (!canConfirm) return;
    setReadyConfirmed(false);
    setCompletionError(null);
    confirmationDialogRef.current?.showModal();
  }

  async function confirmAndContinue() {
    if (!canConfirm || !readyConfirmed || missionCompleted) return;
    setIsCompleting(true);
    setCompletionError(null);

    try {
      // Save an official mission_progress record before changing screens.
      const result = projectSlug
        ? await completeGuidedMission(projectSlug, mission.id)
        : await completePortfolioMission(mission.id);
      if (!result.success) {
        setCompletionError(result.error);
        return;
      }

      setMissionCompleted(true);
      confirmationDialogRef.current?.close();
      // After the last mission is saved, go directly to the assessment.
      // It stays locked on the server until all missions are completed.
      router.push(nextMission?.href ?? assessmentHref);
    } catch {
      setCompletionError("Could not complete your mission. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  }

  async function toggleTask(taskId: number) {
    // Completed missions stay read-only, and writes are serialized.
    if (savingTaskId !== null || missionCompleted || isCompleting) return;

    const shouldComplete = !checkedTaskIds.includes(taskId);
    setSaveError(null);
    setSavingTaskId(taskId);

    try {
      const result = await savePortfolioTaskProgress(
        mission.id,
        taskId,
        shouldComplete,
      );

      if (!result.success) {
        setSaveError(result.error);
        return;
      }

      // Update the visual checkmark only after the database accepts the write.
      setCheckedTaskIds((current) =>
        result.completed
          ? current.includes(taskId)
            ? current
            : [...current, taskId]
          : current.filter((id) => id !== taskId),
      );
    } catch {
      setSaveError("We couldn't save your task. Please try again.");
    } finally {
      setSavingTaskId(null);
    }
  }

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(mission.solution);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f4f7fc] text-slate-900 dark:bg-[#060c1c] dark:text-slate-100">
      {/* Background texture keeps the learning space consistent with the neon roadmap. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045] dark:opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-48 h-[520px] w-[520px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-cyan-400/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-[800px] h-[560px] w-[560px] rounded-full bg-cyan-300/10 blur-[110px] dark:bg-blue-500/10"
      />

      <div className="relative mx-auto max-w-[1540px] px-4 pb-20 pt-7 sm:px-6 lg:px-8">
        {/* Navigation stays understated so the mission objective stands out. */}
        <nav
          aria-label="Mission breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm"
        >
          <Link
            href="/projects"
            className="transition-colors hover:text-blue-600 dark:hover:text-cyan-300"
          >
            Projects
          </Link>
          <span
            aria-hidden="true"
            className="text-slate-300 dark:text-slate-600"
          >
            /
          </span>
          <Link
            href={projectSlug ? `/projects/${projectSlug}` : "/projects/personal-portfolio"}
            className="transition-colors hover:text-blue-600 dark:hover:text-cyan-300"
          >
            {projectName}
          </Link>
          <span
            aria-hidden="true"
            className="text-slate-300 dark:text-slate-600"
          >
            /
          </span>
          <Link
            href={roadmapHref}
            className="transition-colors hover:text-blue-600 dark:hover:text-cyan-300"
          >
            Level {mission.level}
          </Link>
          <span
            aria-hidden="true"
            className="text-slate-300 dark:text-slate-600"
          >
            /
          </span>
          <span className="font-bold text-blue-700 dark:text-cyan-300">
            Mission {mission.number}
          </span>
        </nav>

        {/* Cinematic hero: visually marks this as the core learning screen. */}
        <header className="relative mt-7 overflow-hidden rounded-[32px] border border-cyan-400/20 bg-[#07142d] text-white shadow-[0_25px_80px_rgba(10,31,76,0.18)] dark:border-cyan-300/20 dark:shadow-[0_25px_85px_rgba(0,0,0,0.28)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[80px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-32 bottom-0 h-52 w-52 rounded-full bg-cyan-400/15 blur-[75px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(#7dd3fc 1px, transparent 1px), linear-gradient(90deg, #7dd3fc 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "linear-gradient(90deg,transparent,black)",
            }}
          />

          <div className="relative grid gap-8 px-6 py-9 sm:px-9 sm:py-11 lg:grid-cols-[1fr_290px] lg:items-center lg:gap-14 lg:px-12 lg:py-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />{" "}
                  Guided mission
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-widest text-slate-300">
                  LEVEL {String(mission.level).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-7 flex items-end gap-3">
                <span className="font-mono text-5xl font-black leading-none tracking-tighter text-cyan-300/70 sm:text-6xl">
                  {String(mission.number).padStart(2, "0")}
                </span>
                <span className="mb-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  / {String(totalMissions).padStart(2, "0")} missions
                </span>
              </div>
              <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.19em] text-cyan-300">
                {mission.levelTitle}
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-[44px]">
                {mission.title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                {mission.why}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#your-tasks"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0867f7] to-[#16b9ee] px-5 py-3 text-sm font-extrabold text-white shadow-[0_10px_28px_rgba(0,102,255,0.25)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  Start building <Icon name="arrow" className="h-4 w-4" />
                </a>
                <Link
                  href={roadmapHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-cyan-300/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  <Icon name="back" className="h-4 w-4" /> Level roadmap
                </Link>
              </div>
            </div>

            {/* Decorative code editor illustration; does not claim to be a real coding environment. */}
            <div
              aria-hidden="true"
              className="hidden rotate-[-3deg] rounded-2xl border border-cyan-300/20 bg-[#081226]/85 p-3 shadow-[0_25px_70px_rgba(0,0,0,0.32)] lg:block"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-2 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-auto font-mono text-[10px] text-slate-400">
                  learning-path.ts
                </span>
              </div>
              <div className="space-y-2.5 px-3 py-5 font-mono text-xs">
                <p className="text-slate-500">
                  01 <span className="text-violet-300">const</span>{" "}
                  <span className="text-cyan-300">mission</span> ={" "}
                  <span className="text-slate-200">&#123;</span>
                </p>
                <p className="pl-4 text-slate-500">
                  02 <span className="text-blue-200">learn</span>:{" "}
                  <span className="text-amber-200">true</span>,
                </p>
                <p className="pl-4 text-slate-500">
                  03 <span className="text-blue-200">build</span>:{" "}
                  <span className="text-amber-200">true</span>,
                </p>
                <p className="pl-4 text-slate-500">
                  04 <span className="text-blue-200">grow</span>:{" "}
                  <span className="text-amber-200">true</span>
                </p>
                <p className="text-slate-500">
                  05 <span className="text-slate-200">&#125;;</span>
                </p>
                <p className="pt-2 text-emerald-300">✓ Ready to build</p>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
              </div>
            </div>
          </div>
          <div className="relative flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 bg-white/[0.035] px-6 py-4 font-mono text-[11px] text-slate-300 sm:px-9 lg:px-12">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
              Follow the steps
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Compare
              your result
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Learn at
              your pace
            </span>
          </div>
        </header>

        {/* Give the full content width to the learning workspace. Mission tools
            move beneath it instead of stealing width from the tasks and image. */}
        <div className="mt-8 grid items-start gap-7">
          <div className="min-w-0 space-y-7">
            {/* GIVEN */}
            <section
              id="mission-brief"
              aria-labelledby="mission-brief-title"
              className={`${panel} scroll-mt-8 p-6 sm:p-8`}
            >
              <SectionHeading
                step="01"
                eyebrow="Prepare"
                title="Your mission brief"
                description="Everything you need before writing your first line of code."
                icon="file"
              />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-cyan-300/15 dark:bg-[#101f3c]">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-cyan-300">
                    <Icon name="terminal" className="h-4 w-4" /> Where to work
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                    <RichText text={mission.workIn} />
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#0a1428]">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                    <Icon name="flag" className="h-4 w-4" /> Level objective
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                    {levelGoal}
                  </p>
                </div>
              </div>
              <div className="mt-7">
                <p className="mb-4 text-sm font-extrabold text-slate-900 dark:text-white">
                  Provided tools &amp; starting point
                </p>
                <ul className="grid gap-3">
                  {levelGiven.map((given, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3.5 rounded-xl border border-slate-200/90 px-4 py-3.5 text-sm leading-7 text-slate-600 dark:border-white/10 dark:bg-white/[0.025] dark:text-slate-300"
                    >
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-mono text-[11px] font-bold text-blue-700 dark:bg-cyan-300/10 dark:text-cyan-200">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <RichText text={given} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Wide reading area for the tasks; a clearly separated visual reference.
                On smaller screens the two panels stack at full width. */}
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] 2xl:gap-8">
              {/* TASKS */}
              <section
                id="your-tasks"
                aria-labelledby="task-title"
                className={`${panel} min-w-0 scroll-mt-8 p-6 sm:p-8 xl:p-9`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <SectionHeading
                    step="02"
                    eyebrow="Create"
                    title="Build it, step by step"
                    description="One small task at a time. Check each step as you complete it."
                    icon="list"
                  />
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 font-mono text-xs font-bold text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300">
                    {tasksChecked} / {totalTasks}
                  </span>
                </div>
                <div
                  className="mt-7 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
                  role="progressbar"
                  aria-label="Saved task completion progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={practicePercent}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#43d9ec] transition-[width] duration-300"
                    style={{ width: `${practicePercent}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Saved task progress</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-cyan-300">
                    {practicePercent}% checked
                  </span>
                </div>
                <ol className="relative mt-7 space-y-3 before:absolute before:bottom-7 before:left-[22px] before:top-6 before:w-px before:bg-blue-200 dark:before:bg-cyan-300/20">
                  {mission.taskItems.map((task, index) => {
                    const done = checkedTaskIds.includes(task.id);
                    const isSavingThisTask = savingTaskId === task.id;
                    return (
                      <li key={task.id} className="relative">
                        <label
                          className={`group/task relative flex cursor-pointer items-start gap-4 rounded-2xl border px-4 py-5 transition-colors sm:px-5 ${done ? "border-emerald-300 bg-emerald-50/65 dark:border-emerald-400/25 dark:bg-emerald-400/[0.07]" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 dark:border-white/10 dark:bg-[#0a162c] dark:hover:border-cyan-300/30"}`}
                        >
                          <input
                            type="checkbox"
                            checked={done}
                            disabled={
                              savingTaskId !== null ||
                              missionCompleted ||
                              isCompleting
                            }
                            onChange={() => void toggleTask(task.id)}
                            aria-label={`Mark task ${task.number} ${done ? "not done" : "done"}`}
                            className="peer sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-black transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500 ${done ? "border-emerald-400 bg-emerald-500 text-white" : "border-blue-200 bg-blue-50 text-blue-600 dark:border-cyan-300/25 dark:bg-[#122543] dark:text-cyan-300"}`}
                          >
                            {done ? (
                              <Icon name="check" className="h-5 w-5" />
                            ) : (
                              String(index + 1).padStart(2, "0")
                            )}
                          </span>
                          <span
                            className={`min-w-0 flex-1 break-words pt-1 text-sm leading-8 sm:text-[15px] ${done ? "text-slate-600 dark:text-slate-300" : "text-slate-700 dark:text-slate-200"}`}
                          >
                            <RichText text={task.instruction} />
                          </span>
                          <span
                            aria-hidden="true"
                            className={`mt-2 hidden shrink-0 text-[10px] font-bold uppercase tracking-wider 2xl:block ${done ? "text-emerald-700 dark:text-emerald-300" : "text-slate-400 dark:text-slate-500"}`}
                          >
                            {isSavingThisTask
                              ? "Saving..."
                              : done
                                ? "Saved"
                                : "To do"}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-white/10 dark:bg-white/[0.025] dark:text-slate-400">
                  {missionCompleted
                    ? "Mission officially completed. Its task checklist is now read-only."
                    : "Checked tasks are saved to your account. After saving them all, confirm your completed work to finish the mission."}
                </p>
                {missionCompleted ? (
                  <p
                    role="status"
                    className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200"
                  >
                    <Icon name="check" className="mr-2 inline h-4 w-4" />{" "}
                    Mission officially completed
                  </p>
                ) : null}
                <p
                  aria-live="polite"
                  className="mt-2 text-xs text-blue-700 dark:text-cyan-300"
                >
                  {savingTaskId !== null ? "Saving your change..." : ""}
                </p>
                {saveError ? (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200"
                  >
                    {saveError}
                  </p>
                ) : null}
              </section>

              {/* EXPECTED RESULT */}
              <section
                id="expected-result"
                aria-labelledby="expected-title"
                className={`${panel} min-w-0 scroll-mt-8 p-5 sm:p-7 lg:sticky lg:top-6`}
              >
                <SectionHeading
                  step="03"
                  eyebrow="Review"
                  title="See what success looks like"
                  description="Compare your work with the expected result before continuing."
                  icon="image"
                />
                <p className="mt-6 text-sm leading-8 text-slate-600 dark:text-slate-300">
                  <RichText text={mission.completedWhen} />
                </p>
                {imagePreview ? (
                  <div className="mt-5 min-w-0 rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,#e8f6ff,#f7faff_58%)] p-2 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,#122a4c,#08152a_60%)] sm:p-3">
                    {imagePreview}
                  </div>
                ) : (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-7 text-blue-900 dark:border-cyan-300/20 dark:bg-cyan-300/[0.06] dark:text-cyan-100">
                    <Icon name="file" className="mt-1 h-5 w-5 shrink-0" />
                    This mission builds the HTML foundation, so the page should
                    look almost empty. Verify your browser tab title and
                    document structure rather than relying on a screenshot.
                  </div>
                )}
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07] dark:text-emerald-100">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                    <Icon name="check" className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="block font-extrabold">
                      Completion check
                    </strong>
                    <RichText text={mission.check} />
                  </div>
                </div>
              </section>
            </div>

            {/* HINTS AND SOLUTIONS */}
            <section
              id="need-help"
              aria-labelledby="help-title"
              className={`${panel} scroll-mt-8 p-6 sm:p-8`}
            >
              <SectionHeading
                step="04"
                eyebrow="Unblock"
                title="Need a little help?"
                description="Try it on your own first, then reveal as much guidance as you need."
                icon="lightbulb"
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  aria-expanded={visibleHint === 1}
                  onClick={() => setVisibleHint(visibleHint === 1 ? 0 : 1)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${visibleHint === 1 ? "border-blue-500 bg-blue-600 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-[#06152d]" : "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-400 dark:border-cyan-300/20 dark:bg-[#0e2341] dark:text-cyan-200"}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon name="lightbulb" /> Hint 1{" "}
                    <span className="text-xs font-normal opacity-75">
                      A gentle nudge
                    </span>
                  </span>
                  <span aria-hidden="true">
                    {visibleHint === 1 ? "−" : "+"}
                  </span>
                </button>
                <button
                  type="button"
                  aria-expanded={visibleHint === 2}
                  onClick={() => setVisibleHint(visibleHint === 2 ? 0 : 2)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${visibleHint === 2 ? "border-blue-500 bg-blue-600 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-[#06152d]" : "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-400 dark:border-cyan-300/20 dark:bg-[#0e2341] dark:text-cyan-200"}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon name="lightbulb" /> Hint 2{" "}
                    <span className="text-xs font-normal opacity-75">
                      A stronger clue
                    </span>
                  </span>
                  <span aria-hidden="true">
                    {visibleHint === 2 ? "−" : "+"}
                  </span>
                </button>
              </div>
              {visibleHint !== 0 ? (
                <div
                  role="region"
                  aria-label={`Hint ${visibleHint}`}
                  className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-300/20 dark:bg-[#0b2a3f]"
                >
                  <p className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-blue-700 dark:text-cyan-300">
                    Hint {visibleHint}
                  </p>
                  <p className="mt-3 text-sm leading-8 text-slate-700 dark:text-slate-200">
                    <RichText
                      text={visibleHint === 1 ? mission.hint1 : mission.hint2}
                    />
                  </p>
                </div>
              ) : null}
              <div className="mt-7 border-t border-slate-200 pt-7 dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
                      <Icon name="code" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        Reference solution
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Only open when you want to compare your work.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-expanded={answerVisible}
                    onClick={() => {
                      setAnswerVisible((current) => !current);
                      setCopied(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 transition-colors hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200"
                  >
                    {answerVisible ? "Hide solution" : "Reveal final answer"}{" "}
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </div>
                {answerVisible ? (
                  <div
                    role="region"
                    aria-label="Final answer"
                    className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-[#081226]"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#101e38] px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-300">
                        <Icon name="terminal" className="h-4 w-4" />{" "}
                        {mission.solutionLanguage}
                      </div>
                      <button
                        type="button"
                        onClick={copyAnswer}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white transition-colors hover:border-cyan-300/40 hover:bg-white/10"
                      >
                        <Icon
                          name={copied ? "check" : "copy"}
                          className="h-4 w-4"
                        />
                        {copied ? "Copied" : "Copy code"}
                      </button>
                    </div>
                    <pre className="max-h-[560px] overflow-auto p-5 font-mono text-xs leading-7 text-slate-100 sm:text-sm">
                      <code>{mission.solution}</code>
                    </pre>
                    <p className="border-t border-white/10 px-5 py-4 text-xs leading-6 text-slate-400">
                      This is the relevant addition or replacement from your
                      tutorial. Keep the code from earlier missions.
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          {/* Secondary mission tools now sit beneath the full-width teaching area. */}
          <aside
            aria-label="Mission guide"
            className="grid items-start gap-5 lg:grid-cols-2"
          >
            <section className={`${panel} p-5 sm:p-6`}>
              <div className="flex items-center gap-2 font-mono text-[11px] font-extrabold uppercase tracking-[0.17em] text-blue-600 dark:text-cyan-300">
                <Icon name="sparkle" className="h-4 w-4" /> Mission control
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div
                  className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#13b8ea ${practicePercent}%, #dce8f7 ${practicePercent}% 100%)`,
                  }}
                >
                  <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-white dark:bg-[#0d1930]">
                    <strong className="text-2xl font-black text-slate-900 dark:text-white">
                      {practicePercent}%
                    </strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      checked
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    Your pace
                  </p>
                  <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                    {tasksChecked} of {totalTasks} tasks saved to your account.
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
                <div className="mb-3 flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Current level
                  </span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {String(mission.level).padStart(2, "0")}
                  </strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Mission number
                  </span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {mission.number} / {totalMissions}
                  </strong>
                </div>
              </div>
              <p className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs leading-6 text-slate-500 dark:border-white/10 dark:bg-white/[0.025] dark:text-slate-400">
                {missionCompleted
                  ? "This mission has a saved completion record in Supabase."
                  : "Your task checkmarks are saved in Supabase and restored when you return."}
              </p>
              {missionCompleted ? (
                <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-6 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
                  ✓ Mission complete — your progress is saved.
                </p>
              ) : practicePercent === 100 && totalTasks > 0 ? (
                <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs leading-6 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
                  All tasks saved! Compare your work with the completion check
                  before confirming this mission.
                </p>
              ) : null}
            </section>
            <section className={`${panel} p-5 sm:p-6`}>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Jump to a section
              </h2>
              <nav aria-label="Mission sections" className="mt-4 space-y-1">
                {[
                  {
                    href: "#mission-brief",
                    label: "Mission brief",
                    icon: "file" as IconName,
                  },
                  {
                    href: "#your-tasks",
                    label: "Your tasks",
                    icon: "list" as IconName,
                  },
                  {
                    href: "#expected-result",
                    label: "Expected result",
                    icon: "image" as IconName,
                  },
                  {
                    href: "#need-help",
                    label: "Hints & solutions",
                    icon: "lightbulb" as IconName,
                  },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
                  >
                    <span className="flex items-center gap-3">
                      <Icon name={item.icon} className="h-4 w-4" />
                      {item.label}
                    </span>
                    <Icon name="arrow" className="h-4 w-4 opacity-40" />
                  </a>
                ))}
              </nav>
            </section>
            <Link
              href={roadmapHref}
              className="flex items-center justify-between gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 lg:col-span-2 text-sm font-bold text-blue-700 transition-colors hover:border-blue-400 dark:border-cyan-300/20 dark:bg-cyan-300/[0.06] dark:text-cyan-200"
            >
              <span className="flex items-center gap-2">
                <Icon name="route" /> Return to roadmap
              </span>
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </aside>
        </div>

        {/* Mission navigation checks this mission's full task checklist first. */}
        <nav
          aria-label="Mission navigation"
          className="mt-11 flex flex-wrap items-center justify-between gap-3 rounded-[26px] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0d1930] sm:p-5"
        >
          <Link
            href={previousMission?.href ?? roadmapHref}
            className="inline-flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:text-slate-200 dark:hover:border-cyan-300/40"
          >
            <Icon name="back" className="h-4 w-4" />
            {previousMission?.label ?? "Level roadmap"}
          </Link>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {missionCompleted && !nextMission ? (
              <div className="flex flex-wrap items-center gap-3">
                <p
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200"
                >
                  ✓ Final mission completed!
                </p>
                <Link
                  href={assessmentHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/10 transition hover:brightness-110 dark:from-cyan-300 dark:to-cyan-400 dark:text-[#061329]"
                >
                  Take Final Assessment{" "}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={!missionCompleted && !canConfirm}
                  aria-describedby="next-mission-requirement"
                  onClick={askToContinue}
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-extrabold text-white shadow-[0_8px_26px_rgba(0,102,255,0.19)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none disabled:hover:brightness-100 dark:disabled:from-slate-700 dark:disabled:to-slate-700 dark:disabled:text-slate-300"
                >
                  {missionCompleted
                    ? "Go to next mission"
                    : !nextMission
                      ? "Complete final mission"
                      : enteringNextLevel
                        ? "Complete & start next level"
                        : `Complete & continue to ${nextMission.label}`}
                  <Icon
                    name={missionCompleted ? "check" : "arrow"}
                    className="h-4 w-4"
                  />
                </button>
                <p
                  id="next-mission-requirement"
                  role="status"
                  className={`max-w-sm text-xs leading-5 ${missionCompleted || allTasksChecked ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}
                >
                  {missionCompleted
                    ? "Official completion saved to your account."
                    : allTasksChecked
                      ? "All tasks saved. Confirm your completed work to continue."
                      : `Save all ${totalTasks} tasks before completing this mission (${tasksChecked}/${totalTasks}).`}
                </p>
              </>
            )}
          </div>
        </nav>

        {/* Save official completion before leaving this page. The final mission
            also uses this dialog even though there is no next mission. */}
        {!missionCompleted ? (
          <dialog
            ref={confirmationDialogRef}
            onCancel={(event) => {
              if (isCompleting) event.preventDefault();
            }}
            onClose={() => {
              setReadyConfirmed(false);
              setCompletionError(null);
            }}
            onClick={(event) => {
              if (!isCompleting && event.target === event.currentTarget)
                event.currentTarget.close();
            }}
            aria-labelledby="mission-finish-dialog-title"
            aria-describedby="mission-finish-dialog-description"
            className="m-auto w-[min(94vw,520px)] max-w-none rounded-[28px] border border-cyan-400/30 bg-white p-0 text-slate-900 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop:bg-[#020917]/80 backdrop:backdrop-blur-sm dark:bg-[#0d1930] dark:text-white"
          >
            <div className="relative overflow-hidden bg-[#07142d] px-6 pb-7 pt-7 text-white sm:px-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-[55px]"
              />
              <div className="relative flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-300">
                  <Icon name="flag" className="h-6 w-6" />
                </span>
                <button
                  type="button"
                  disabled={isCompleting}
                  onClick={() => confirmationDialogRef.current?.close()}
                  aria-label="Close confirmation"
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xl text-slate-200 hover:border-cyan-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  ×
                </button>
              </div>
              <p className="relative mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                {!nextMission
                  ? "Final mission checkpoint"
                  : enteringNextLevel
                    ? "Level checkpoint"
                    : "Mission checkpoint"}
              </p>
              <h2
                id="mission-finish-dialog-title"
                className="relative mt-2 text-2xl font-extrabold leading-snug sm:text-3xl"
              >
                {!nextMission
                  ? "Ready to finish this project journey?"
                  : enteringNextLevel
                    ? "Ready for the next level?"
                    : "Ready for the next mission?"}
              </h2>
              <p
                id="mission-finish-dialog-description"
                className="relative mt-3 text-sm leading-7 text-slate-300"
              >
                {!nextMission
                  ? "This is the final Portfolio mission. Review your finished website before recording your completion."
                  : enteringNextLevel
                    ? `You're leaving Level ${mission.level}. Make sure you've completed every mission in this level and reviewed your work before starting Level ${nextMission.level}.`
                    : "You've checked every task in this mission. Compare your work with the expected result before continuing."}
              </p>
            </div>
            <div className="space-y-5 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                <Icon name="check" className="h-5 w-5 shrink-0" /> {totalTasks}{" "}
                of {totalTasks} tasks saved in this mission
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700 dark:border-white/15 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={readyConfirmed}
                  disabled={isCompleting}
                  onChange={(event) => setReadyConfirmed(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                />
                <span>
                  {!nextMission
                    ? "I confirm that I finished the final mission and tested my portfolio."
                    : enteringNextLevel
                      ? "I confirm that I completed the missions in this level and checked my results."
                      : "I confirm that I finished this mission's work and checked my result."}
                </span>
              </label>
              <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
                Confirming will save your official mission completion to
                Supabase before you continue.
              </p>
              {completionError ? (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200"
                >
                  {completionError}
                </p>
              ) : null}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isCompleting}
                  onClick={() => confirmationDialogRef.current?.close()}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  Review my work
                </button>
                <button
                  type="button"
                  disabled={!readyConfirmed || !canConfirm}
                  aria-busy={isCompleting}
                  onClick={() => void confirmAndContinue()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isCompleting
                    ? "Saving completion..."
                    : !nextMission
                      ? "Finish mission"
                      : enteringNextLevel
                        ? "Save & start next level"
                        : "Save & continue"}{" "}
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </dialog>
        ) : null}
        <p className="mt-9 text-center font-mono text-xs font-bold tracking-[0.2em] text-blue-600 dark:text-cyan-300">
          LEARN. BUILD. GROW.
        </p>
      </div>
    </main>
  );
}
