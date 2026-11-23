
import Link from "next/link";

type Difficulty = "Easy" | "Medium" | "Hard";

type ProjectCardProps = {
  title: string;
  description: string;
  difficulty: Difficulty;
  href?: string;
};

const difficultyStyles: Record<Difficulty, string> = {
  Easy:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  Medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  Hard:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300",
};

// Display an icon appropriate for the project.
const projectIcons: Record<string, string> = {
  "Counter App": "±",
  "Todo List": "☑",
  "Expense Tracker": "$",
  "Personal Portfolio": "</>",
  "Quiz Application": "?",
  "E-commerce Frontend": "▦",
  "Contact Form": "@",
  "Blog Application": "✎",
  "Inventory Management": "▤",
};

export default function ProjectCard({
  title,
  description,
  difficulty,
  href,
}: ProjectCardProps) {
  const icon = projectIcons[title] ?? "</>";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_18px_45px_rgba(34,211,238,0.10)] dark:border-slate-700/60 dark:bg-[#151d34] dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)] dark:hover:border-cyan-400/40"
    >
      {/* Dashboard-style top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-700/60 dark:bg-[#10182c]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>

        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
          project.config
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Icon and difficulty */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 font-mono text-xl font-bold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            {icon}
          </div>

          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${difficultyStyles[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>

        {/* Project details */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {/* Availability information */}
        <div className="mt-7 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              href ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />

          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {href ? "Project page available" : "Catalog preview"}
          </span>
        </div>

        {/* Project navigation */}
        <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700/60">
          {href ? (
            <Link
              href={href}
              className="inline-flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:brightness-110"
            >
              View Project
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
              <span>Preview Only</span>
              <span aria-hidden="true">—</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
