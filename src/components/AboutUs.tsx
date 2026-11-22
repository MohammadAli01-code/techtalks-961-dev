
const benefits = [
  {
    number: "01",
    title: "Learn by Building",
    description:
      "Turn programming concepts into practical skills by building real projects instead of only watching tutorials.",
  },
  {
    number: "02",
    title: "Step-by-Step Guidance",
    description:
      "Follow structured missions with helpful explanations and hints that guide you through every stage.",
  },
  {
    number: "03",
    title: "Grow with Confidence",
    description:
      "Progress from beginner-friendly challenges to more advanced projects while developing your problem-solving skills.",
  },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0b1224] px-6 py-12 text-white sm:py-14 lg:px-8"
    >

{/* Programming grid background - matches Hero Section */}
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

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
            About 961-Dev
          </span>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built by Developers,
            <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              for Future Developers.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            961-Dev is a learning platform designed to help
            aspiring developers bridge the gap between
            programming knowledge and real-world experience.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16 rounded-2xl border border-cyan-400/10 bg-[#151d34]/90 p-6 shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_15px_45px_rgba(34,211,238,0.08)] sm:p-9">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
            Our Story
          </span>

          <h3 className="mt-4 text-2xl font-bold">
            From Graduates to Creators
          </h3>

          <p className="mt-5 text-sm leading-8 text-slate-400 sm:text-base">
            As Computer Science graduates from the Lebanese
            University, we understand how challenging it can
            be to move from studying programming concepts
            to building complete, practical projects.
          </p>

          <p className="mt-4 text-sm leading-8 text-slate-400 sm:text-base">
            We created 961-Dev to make that journey clearer
            and more accessible. Our goal is to provide
            aspiring developers with structured projects,
            guided missions, and practical challenges that
            help them turn theoretical knowledge into
            meaningful experience.
          </p>
        </div>

        {/* Meet the Developers */}
        <div className="mb-16">
          <div className="mb-9 text-center">
            <h3 className="text-2xl font-bold sm:text-3xl">
              Meet the Developers
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              The people behind 961-Dev.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Mohammad Ali */}
            <div className="rounded-2xl border border-cyan-400/10 bg-[#151d34]/90 p-7 shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_15px_45px_rgba(34,211,238,0.12)]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl font-bold text-cyan-300">
                MA
              </div>

              <h4 className="text-lg font-bold">
                Mohammad Ali Nabil Noureddine
              </h4>

              <p className="mt-2 text-sm font-medium text-cyan-300">
                Computer Science Graduate
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Lebanese University
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                Passionate about software development
                and practical learning, Mohammad Ali
                contributes to building a platform
                that helps students develop their
                programming skills through real projects.
              </p>
            </div>

            {/* Fatima */}
            <div className="rounded-2xl border border-slate-700/60 bg-[#151d34] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl font-bold text-cyan-300">
                FK
              </div>

              <h4 className="text-lg font-bold">
                Fatima Ali Kassem
              </h4>

              <p className="mt-2 text-sm font-medium text-cyan-300">
                Computer Science Graduate
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Lebanese University
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                Interested in creating meaningful digital
                experiences, Fatima contributes to making
                programming education more engaging,
                accessible, and practical for aspiring
                developers.
              </p>
            </div>
          </div>
        </div>

        {/* Why 961-Dev */}
        <div>
          <div className="mb-9 text-center">
            <h3 className="text-2xl font-bold sm:text-3xl">
              Why 961-Dev?
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
              Because learning to code should lead to
              the confidence to build something real.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.number}
                className="rounded-2xl border border-cyan-400/10 bg-[#151d34]/90 p-6 shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_15px_45px_rgba(34,211,238,0.12)]"
              >
                <span className="font-mono text-sm text-cyan-300">
                  {benefit.number}
                </span>

                <h4 className="mt-4 text-lg font-bold">
                  {benefit.title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
