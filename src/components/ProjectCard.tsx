
import Link from "next/link";

type Difficulty = "Easy" | "Medium" | "Hard";

type ProjectCardProps = {
  title: string;
  description: string;
  difficulty: Difficulty;
  href?: string;
};

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-400",
  Medium: "bg-yellow-500/10 text-yellow-400",
  Hard: "bg-red-500/10 text-red-400",
};

export default function ProjectCard({
  title,
  description,
  difficulty,
  href,
}: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-slate-700 bg-slate-900 p-6">
      <span
        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${difficultyColors[difficulty]}`}
      >
        {difficulty}
      </span>

      <h3 className="mt-4 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-300">
        {description}
      </p>

      {href && (
        <Link
          href={href}
          className="mt-6 inline-block font-semibold text-cyan-400 hover:underline"
        >
          View Project →
        </Link>
      )}
    </article>
  );
}
