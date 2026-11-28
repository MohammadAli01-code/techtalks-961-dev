import Link from "next/link";

import {
  ecommerceLevels,
  ecommerceMissions,
} from "./ecommerce-missions";

// Generate the learning roadmap from the existing mission data.
const levels = Object.entries(ecommerceLevels)
  .map(([number, level]) => ({
    number: Number(number),
    title: level.name,
    description: level.goal,
    missions: ecommerceMissions.filter(
      (mission) => mission.level === Number(number)
    ),
  }))
  .sort((a, b) => a.number - b.number);


const learningOutcomes = [
  "Build semantic and responsive store interfaces.",
  "Create reusable product card layouts.",
  "Manage product data using JavaScript arrays.",
  "Implement search and category filtering.",
  "Manage shopping cart state and quantities.",
  "Calculate prices and persist data using Local Storage.",
];

// Sample products used only in the visual project preview.
const previewProducts = [
  {
    name: "Wireless Headphones",
    category: "Audio",
    price: 59,
    icon: "🎧",
  },
  {
    name: "Smart Watch",
    category: "Accessories",
    price: 79,
    icon: "⌚",
  },
  {
    name: "Mechanical Keyboard",
    category: "Computing",
    price: 89,
    icon: "⌨️",
  },
];

const totalMissions = levels.reduce(
  (total, level) => total + level.missions.length,
  0,
);

export default function EcommerceFrontendPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#080d1e] dark:text-white">

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-16 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Breadcrumb */}
        <Link
          href="/projects"
          className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300"
        >
          ← Back to Projects
        </Link>

        {/* PROJECT HERO */}
        <section className="mt-5 grid items-center gap-6 lg:grid-cols-2 lg:gap-10">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
                Hard Level
              </span>

              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                Guided Project 03
              </span>

            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Build Your Own

              <span className="mt-1 block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
                E-commerce Frontend
              </span>
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
              Build a modern online store with a dynamic product
              catalog, search functionality, category filters,
              and an interactive shopping cart.
            </p>

            <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">
              Apply advanced JavaScript concepts through a practical
              shopping experience with persistent cart data.
            </p>

            {/* Technology badges */}
            <div className="mt-4 flex flex-wrap gap-2">

              {["HTML", "CSS", "JavaScript"].map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-[#151d34] dark:text-slate-300"
                >
                  {technology}
                </span>
              ))}

            </div>

            {/* Project statistics */}
            <div className="mt-5 grid max-w-sm grid-cols-3 gap-2">

              {[
                { value: levels.length, label: "Levels" },
                { value: totalMissions, label: "Missions" },
                { value: 3, label: "Technologies" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-[#151d34]"
                >

                  <p className="text-xl font-extrabold text-blue-600 dark:text-cyan-300">
                    {stat.value}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>

                </div>
              ))}

            </div>

            {/* Project navigation */}
            <div className="mt-5 flex flex-wrap gap-2">

              <Link
                href="/projects/ecommerce-frontend/levels/1/missions/1"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950"
              >
                Start Project →
              </Link>

              <a
                href="#levels"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:bg-[#151d34] dark:text-white"
              >
                Explore Levels
              </a>

              <a
                href="#preview"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:bg-[#151d34] dark:text-white"
              >
                View Preview
              </a>

            </div>

          </div>

          {/* E-COMMERCE DESIGN PREVIEW */}
          <section
            id="preview"
            aria-label="E-commerce application design preview"
            className="mx-auto w-full max-w-lg scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-[#151d34]"
          >

            {/* Browser window header */}
            <div className="mb-3 flex items-center justify-between px-1">

              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>

              <span className="font-mono text-[10px] text-slate-400">
                store-preview.html
              </span>

            </div>

            {/* Store interface mockup */}
            <div className="rounded-xl bg-[#080d1e] p-3 text-white sm:p-4">

              {/* Store navigation */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">

                <p className="font-mono text-sm font-extrabold">
                  <span className="text-cyan-300">Tech</span>
                  Store
                </p>

                <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1.5 text-[10px] font-bold text-cyan-300">
                  Cart (2)
                </div>

              </div>

              <p className="mt-4 text-base font-extrabold">
                Explore Our Products
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Discover technology for your everyday needs.
              </p>

              {/* Search field preview */}
              <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[10px] text-slate-400">
                Search products...
              </div>

              {/* Category filter preview */}
              <div className="mt-3 flex flex-wrap gap-1.5">

                {["All", "Audio", "Accessories", "Computing"].map(
                  (category, index) => (
                    <span
                      key={category}
                      className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                        index === 0
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {category}
                    </span>
                  ),
                )}

              </div>

              {/* Product cards */}
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">

                {previewProducts.map((product) => (
                  <div
                    key={product.name}
                    className="min-w-0 rounded-lg border border-slate-700 bg-[#151d34] p-2"
                  >

                    <div
                      aria-hidden="true"
                      className="flex h-16 items-center justify-center rounded-md bg-slate-800 text-3xl"
                    >
                      {product.icon}
                    </div>

                    <p className="mt-2 text-[9px] text-cyan-300">
                      {product.category}
                    </p>

                    <p className="mt-1 min-h-8 break-words text-[10px] font-bold leading-4">
                      {product.name}
                    </p>

                    <p className="mt-1 text-sm font-extrabold">
                      ${product.price}
                    </p>

                    <div className="mt-2 rounded-md bg-blue-600 px-1 py-2 text-center text-[9px] font-bold">
                      Add to Cart
                    </div>

                  </div>
                ))}

              </div>

              {/* Cart summary preview */}
              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3">

                <div>
                  <p className="text-[10px] text-slate-400">
                    Cart Total
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-cyan-300">
                    $138.00
                  </p>
                </div>

                <div className="rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-bold">
                  Checkout
                </div>

              </div>

            </div>

            <p className="mt-2 text-center text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Design preview of the store you will build.
            </p>

          </section>

        </section>

        {/* LEARNING OUTCOMES */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#151d34] sm:p-5">

          <div className="grid gap-4 md:grid-cols-[0.65fr_1fr] md:gap-6">

            <div>

              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                What you will achieve
              </p>

              <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
                Build Advanced Skills
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                Combine everything you have learned to create
                a complete frontend shopping experience.
              </p>

            </div>

            <ul className="grid gap-3 sm:grid-cols-2">

              {learningOutcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-2"
                >

                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300"
                  >
                    ✓
                  </span>

                  <span className="text-xs leading-5 text-slate-700 dark:text-slate-300">
                    {outcome}
                  </span>

                </li>
              ))}

            </ul>

          </div>

        </section>

        {/* LEARNING ROADMAP */}
        <section
          id="levels"
          className="mt-10 scroll-mt-24"
        >

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
            Your learning journey
          </p>

          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            5 Levels. One Complete Store.
          </h2>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600 dark:text-slate-400">
            Progress from a basic HTML structure to an advanced
            interactive shopping application.
          </p>

          <div className="mt-5 space-y-3">

            {levels.map((level) => (
              <details
                key={level.number}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white open:border-blue-300 dark:border-slate-700 dark:bg-[#151d34] dark:open:border-cyan-400/40"
              >

                {/* Level heading */}
                <summary className="flex cursor-pointer list-none items-center gap-3 p-3 marker:hidden [&::-webkit-details-marker]:hidden sm:p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-mono text-base font-extrabold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                    {String(level.number).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                      Level {level.number}
                    </p>

                    <h3 className="mt-0.5 text-sm font-bold sm:text-base">
                      {level.title}
                    </h3>

                    <p className="mt-1 hidden text-xs leading-5 text-slate-500 dark:text-slate-400 sm:block">
                      {level.description}
                    </p>

                  </div>

                  <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:inline-flex">
                    {level.missions.length} Missions
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-lg text-blue-600 transition-transform group-open:rotate-180 dark:text-cyan-300"
                  >
                    ↓
                  </span>

                </summary>

                {/* Expanded level content */}
                <div className="border-t border-slate-200 p-4 dark:border-slate-700">

                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-[#101b31]">

                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300">
                      Level Objective
                    </p>

                    <p className="mt-1 text-xs leading-6 text-slate-700 dark:text-slate-300">
                      {level.description}
                    </p>

                  </div>

                  <h4 className="mb-3 mt-4 text-sm font-bold">
                    Mission Roadmap
                  </h4>

                  <ol className="space-y-2">

                    {level.missions.map((mission) => {

                      const missionNumber = mission.number;

                      return (
                        <li
                          key={mission.number}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#10182c]"
                        >

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-mono text-xs font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                            {String(missionNumber).padStart(2, "0")}
                          </span>

                          <div className="min-w-0 flex-1">

                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              Mission {missionNumber}
                            </p>

                            <Link
                              href={`/projects/ecommerce-frontend/levels/${mission.level}/missions/${mission.number}`}
                              className="mt-1 block text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-cyan-300 sm:text-sm"
                            >
                              {mission.title} →
                            </Link>

                          </div>

                        </li>
                      );
                    })}

                  </ol>

                </div>

              </details>
            ))}

          </div>

        </section>

        {/* Current implementation status */}
        <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/5">

          <h2 className="text-base font-bold">
            Your Learning Progress
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
            All 15 missions are available for guided practice. Account progress tracking and official project completion are not connected yet.
          </p>

        </section>

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 pt-5 text-center dark:border-slate-700">

          <p className="font-mono text-xs font-bold tracking-widest text-blue-600 dark:text-cyan-300">
            LEARN. BUILD. GROW.
          </p>

          <Link
            href="/projects"
            className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-300"
          >
            Explore Other Projects →
          </Link>

        </div>

      </div>

    </main>
  );
}
