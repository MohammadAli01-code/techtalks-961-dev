
import Link from "next/link";

type TechnologyCardProps = {
  title: string;
  description: string;
  slug: string;
};

export default function TechnologyCard({
  title,
  description,
  slug,
}: TechnologyCardProps) {
  return (
    <Link
      href={`/projects#${slug}`}
      className="block rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <h2 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="mb-6 text-sm leading-7 text-slate-300">
        {description}
      </p>

      <span className="font-semibold text-cyan-400">
        Explore Projects →
      </span>
    </Link>
  );
}
