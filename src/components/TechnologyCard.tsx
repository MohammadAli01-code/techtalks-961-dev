import Link from "next/link";

type TechnologyCardProps = {
  title: string;
  description: string;
  slug: string;
  comingSoon?: boolean;
};

const technologyDetails: Record<
  string,
  {
    icon: string;
    number: string;
    label: string;
  }
> = {
  react: {
    icon: "⚛",
    number: "01",
    label: "Frontend Development",
  },
  "html-css-js": {
    icon: "</>",
    number: "02",
    label: "Web Fundamentals",
  },
  php: {
    icon: "⌘",
    number: "03",
    label: "Backend Development",
  },
};

export default function TechnologyCard({
  title,
  description,
  slug,
  comingSoon = false,
}: TechnologyCardProps) {
  const details = technologyDetails[slug] ?? {
    icon: "</>",
    number: "00",
    label: "Programming",
  };

  // Common styling for all technology cards.
  const cardClassName =
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-300 dark:border-slate-700/60 dark:bg-[#151d34] dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)]";

  // Keep all card content reusable without duplication.
  const cardContent = (
    <>
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />

      <div className="flex flex-1 flex-col p-6">
        {/* Technology header */}
        <div className="mb-7 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 font-mono text-2xl font-bold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            {details.icon}
          </div>

          <span className="font-mono text-sm text-slate-400 dark:text-slate-500">
            {details.number}
          </span>
        </div>

        {/* Technology information */}
        <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
          {details.label}
        </span>

        <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {/* Project count or Coming Soon status */}
        <div className="mt-6 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              comingSoon ? "bg-amber-400" : "bg-emerald-500"
            }`}
          />

          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {comingSoon ? "Coming Soon" : "3 Projects · Easy / Medium / Hard"}
          </span>
        </div>

        {/* Card action */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-700/60">
          {comingSoon ? (
            // PHP has no available projects yet.
            <span className="text-sm font-bold text-amber-500">
              Projects Coming Soon
            </span>
          ) : (
            // Available technologies keep the Explore Projects action.
            <>
              <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
                Explore Projects
              </span>

              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-lg text-cyan-700 transition-transform duration-300 group-hover:translate-x-1 dark:bg-cyan-400/10 dark:text-cyan-300"
              >
                →
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  // PHP: Display a non-clickable technology card.
  if (comingSoon) {
    return (
      <div className={`${cardClassName} cursor-default`}>{cardContent}</div>
    );
  }

  // React and HTML/CSS/JS: Keep cards clickable.
  return (
    <Link
      href={`/projects#${slug}`}
      className={`${cardClassName} hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_20px_50px_rgba(34,211,238,0.12)] dark:hover:border-cyan-400/50`}
    >
      {cardContent}
    </Link>
  );
}
