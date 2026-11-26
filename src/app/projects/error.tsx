
"use client";

import Link from "next/link";
import { useEffect } from "react";

type ProjectsErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ProjectsError({
  error,
  reset,
}: ProjectsErrorProps) {
  // Log technical details for developers only.
  useEffect(() => {
    console.error("Project catalog error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16 text-foreground">
      <section
        role="alert"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-[#151d34] sm:p-10"
      >
        {/* Error indicator */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 font-mono text-3xl font-bold text-rose-600 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
          !
        </div>

        <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-300">
          Catalog Error
        </p>

        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
          Unable to Load Projects
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
          Something went wrong while loading the project
          catalog. Please try again.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {/* Retry rendering the failed route segment. */}
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
