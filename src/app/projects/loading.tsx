
export default function ProjectsLoading() {
  return (
    <main
      aria-busy="true"
      className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8"
    >
      <p role="status" className="sr-only">
        Loading project catalog...
      </p>

      <div
        aria-hidden="true"
        className="mx-auto max-w-7xl animate-pulse motion-reduce:animate-none"
      >
        {/* Hero skeleton */}
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="h-8 w-48 rounded-full bg-slate-200 dark:bg-slate-800" />

          <div className="mt-7 h-12 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-4 h-12 w-2/3 rounded-xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-6 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 h-24 w-full max-w-xl rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Technology selection skeleton */}
        <div className="mt-16">
          <div className="h-7 w-64 max-w-full rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#151d34]"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />

                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />

                <div className="mt-4 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />

                <div className="mt-3 h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />

                <div className="mt-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty filter skeleton */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#151d34]">
          <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-700" />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-12 rounded-xl bg-slate-200 dark:bg-slate-700"
              />
            ))}
          </div>
        </div>

        {/* Project cards skeleton */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#151d34]"
            >
              <div className="flex justify-between">
                <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />

                <div className="h-7 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>

              <div className="mt-6 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />

              <div className="mt-4 h-4 rounded bg-slate-200 dark:bg-slate-700" />

              <div className="mt-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />

              <div className="mt-8 h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
