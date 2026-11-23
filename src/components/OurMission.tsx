
const missionValues = [
  {
    number: "01",
    icon: "◈",
    title: "Guided Learning",
    description:
      "Follow a clear learning path with structured missions, helpful hints, and step-by-step guidance that makes every project easier to approach.",
    color: "cyan",
  },
  {
    number: "02",
    icon: "⌘",
    title: "Hands-On Experience",
    description:
      "Move beyond tutorials and apply your knowledge by building real projects, solving practical challenges, and creating something of your own.",
    color: "emerald",
  },
  {
    number: "03",
    icon: "↗",
    title: "Continuous Growth",
    description:
      "Unlock new missions as you progress, take on increasingly challenging tasks, and develop the confidence to keep improving.",
    color: "violet",
  },
];

export default function OurMission() {
  return (
    <section
      id="mission"
      className="relative overflow-hidden bg-[#f8fafc] px-6 py-12 text-slate-900 transition-colors duration-300 dark:bg-[#0b1224] dark:text-white sm:py-14 lg:px-8"
    >

{/* Decorative programming grid - matches the Hero Section */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 opacity-20"
  style={{
    backgroundImage:
      "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
    backgroundSize: "64px 64px",
    maskImage:
      "linear-gradient(to bottom, black, transparent)",
  }}
/>

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 transition-colors duration-300 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-600 dark:bg-cyan-300" />
            Our Mission
          </span>

          <h2 className="mt-7 text-3xl font-extrabold tracking-tight sm:text-3xl lg:text-5xl">
            Turning Knowledge Into
            <span className="mt-2 block bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-violet-400">
              Real Skills.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-600 transition-colors duration-300 dark:text-slate-400 sm:text-lg">
            At 961-Dev, we believe learning programming should go
            beyond watching tutorials. Our mission is to empower
            aspiring developers to transform what they learn into
            practical experience through guided, hands-on projects.
          </p>
        </div>

        {/* Mission cards */}
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {missionValues.map((value) => (
            <div
              key={value.number}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_15px_45px_rgba(34,211,238,0.10)] dark:border-cyan-400/10 dark:bg-[#151d34]/90 dark:shadow-[0_10px_35px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_15px_45px_rgba(34,211,238,0.12)] sm:p-8"
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-3xl transition-colors duration-300 ${
                  value.color === "cyan"
                    ? "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
                    : value.color === "emerald"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                      : "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300"
                }`}
                >
                  {value.icon}
                </span>

                <span className="font-mono text-sm text-slate-500 dark:text-slate-600">
                  {value.number}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {value.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-sm">
                {value.description}
              </p>

              
            </div>
          ))}
        </div>

        {/* Closing message */}
        <p className="mt-12 text-center text-sm font-medium tracking-wide text-slate-600 dark:text-slate-500">
          Learn with purpose. Build with confidence. Grow with every project.
        </p>
      </div>
    </section>
  );
}
