
import Link from "next/link";

type TechnologyCardProps = {
  title: string;
  description: string;
  slug: string;
  comingSoon?: boolean;
  projectCount?: number;
  selected?: boolean;
  onSelect?: () => void;
};

const technologyDetails: Record<
  string,
  {
    icon: string;
    number: string;
    label: string;
  }
> = {
  all: {
    icon: "{ }",
    number: "00",
    label: "Explore Everything",
  },
  react: {
    icon: "\u269B",
    number: "01",
    label: "Frontend Development",
  },
  "html-css-js": {
    icon: "</>",
    number: "02",
    label: "Web Fundamentals",
  },
  php: {
    icon: "PHP",
    number: "03",
    label: "Backend Development",
  },
};

export default function TechnologyCard({
  title,
  description,
  slug,
  comingSoon = false,
  projectCount = 3,
  selected = false,
  onSelect,
}: TechnologyCardProps) {
  const details = technologyDetails[slug] ?? {
    icon: "</>",
    number: "00",
    label: "Programming",
  };

  // Shared styling keeps cards consistent across the website.
  const cardClassName = `
    group relative flex h-full w-full flex-col
    overflow-hidden rounded-2xl border text-left
    transition-all duration-300
    motion-reduce:transition-none
    ${
      selected
        ? "border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 dark:border-cyan-400 dark:bg-cyan-950/30 dark:ring-cyan-400/20"
        : "border-slate-200 bg-white dark:border-slate-700/60 dark:bg-[#151d34]"
    }
  `;

  const interactiveClassName = `
    cursor-pointer hover:-translate-y-1
    hover:border-blue-400
    hover:shadow-lg dark:hover:border-cyan-400/60
    motion-reduce:hover:translate-y-0
  `;

  // Reuse the same content for buttons, links and static cards.
  const cardContent = (
    <>
      <div
        className={`h-1 w-full ${
          selected
            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
            : "bg-slate-200 dark:bg-slate-700"
        }`}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Technology icon and selection indicator */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 min-w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-2 font-mono text-lg font-bold text-blue-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            {details.icon}
          </div>

          {selected ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
              {"\u2713"}
            </span>
          ) : (
            <span className="font-mono text-xs text-slate-400">
              {details.number}
            </span>
          )}
        </div>

        {/* Technology information */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-700 dark:text-cyan-300">
          {details.label}
        </span>

        <span className="mt-3 block text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </span>

        <span className="mt-3 block flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </span>

        {/* Dynamic project count */}
        <span className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${
              comingSoon
                ? "bg-amber-400"
                : "bg-emerald-500"
            }`}
          />

          {comingSoon
            ? "Coming Soon"
            : `${projectCount} ${
                projectCount === 1 ? "Project" : "Projects"
              }`}
        </span>

        {/* Selection feedback */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700/60">
          <span
            className={`text-xs font-bold ${
              comingSoon
                ? "text-amber-600 dark:text-amber-400"
                : "text-blue-700 dark:text-cyan-300"
            }`}
          >
            {selected
              ? "Selected"
              : comingSoon
                ? "Coming Soon"
                : "Explore Projects"}
          </span>

          {!selected && (
            <span
              aria-hidden="true"
              className="text-lg text-blue-600 dark:text-cyan-300"
            >
              {"\u2192"}
            </span>
          )}
        </div>
      </div>
    </>
  );

  // Interactive mode used by the project catalog.
  if (onSelect) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        aria-label={`Select ${title}`}
        onClick={onSelect}
        className={`${cardClassName} ${interactiveClassName}`}
      >
        {cardContent}
      </button>
    );
  }

  // Preserve the original static Coming Soon behavior.
  if (comingSoon) {
    return (
      <div className={cardClassName}>
        {cardContent}
      </div>
    );
  }

  // Preserve navigation for existing consumers.
  return (
    <Link
      href={`/projects#${slug}`}
      className={`${cardClassName} ${interactiveClassName}`}
    >
      {cardContent}
    </Link>
  );
}
