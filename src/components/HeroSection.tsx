
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-950 px-6 py-20 text-center text-white">
      <span className="mb-5 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
        Learn by Building
      </span>

      <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
        Build Real Projects.
        <span className="block text-cyan-400">
          Learn Step by Step.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        961-Dev helps aspiring developers gain practical skills
        through guided projects, clear missions, and hands-on learning.
        Choose a technology, follow each mission, and track your progress.
      </p>

      <Link
        href="/projects"
        className="mt-9 rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Explore Projects
      </Link>
    </section>
  );
}
