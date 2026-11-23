
"use client";

import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { createClient } from "@/lib/supabase/client";

const steps = [
  {
    number: "01",
    title: "Choose Your Project",
    description:
      "Explore projects in React, HTML/CSS/JavaScript, and PHP. Choose a project based on your interests and difficulty level.",
  },
  {
    number: "02",
    title: "Build Step by Step",
    description:
      "Follow guided missions, discover helpful hints, and complete each level to unlock the next challenge.",
  },
  {
    number: "03",
    title: "Assess and Track Your Progress",
    description:
      "Test your understanding with a final assessment, track completed missions, and continue learning at your own pace.",
  },
];

export default function HowItWorks() {
  const router = useRouter();

  // Access the shared Login/Register modal.
  const { openAuthModal } = useAuthModal();

  // Check authentication before opening the projects page.
  async function handleStartBuilding() {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // Open Login/Register on the same homepage.
      openAuthModal("login", "/projects");
      return;
    }

    // Signed-in users go directly to projects.
    router.push("/projects");
  }

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-[#f8fafc] px-6 py-12 text-slate-900 transition-colors duration-300 dark:bg-[#0b1224] dark:text-white lg:px-8"
    >
      {/* Programming grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black, transparent)",
        }}
      />

      {/* Soft ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
            How It Works
          </span>

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Your Journey Starts
            <span className="block text-cyan-700 dark:text-cyan-300">
              Here.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            From choosing your first project to completing
            your final challenge, 961-Dev guides you
            through every step.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_15px_45px_rgba(34,211,238,0.10)] dark:border-cyan-400/10 dark:bg-[#151d34]/90 dark:shadow-[0_10px_35px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_15px_45px_rgba(34,211,238,0.12)]"
            >
              {/* Step number */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-lg font-bold text-cyan-700 transition-colors duration-300 dark:bg-cyan-400/10 dark:text-cyan-300">
                {step.number}
              </div>

              {/* Step title */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>

              {/* Step description */}
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Ready to turn your knowledge into real skills?
          </p>

          <button
            type="button"
            onClick={handleStartBuilding}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-400/30"
          >
            Start Building
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
