import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default async function AccountPage() {
  const supabase = await createClient();

  // Verify the signed-in user on the server.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Load only the current user's profile.
  // Supabase RLS continues to protect the data.
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  // Use the saved profile name first.
  // Fall back to registration metadata when necessary.
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const displayName =
    profile?.display_name?.trim() || metadataName || "Developer";

  const email = user.email || "Email unavailable";

  // Display the real account creation date.
  const joinedDate = new Date(user.created_at);

  const memberSince = Number.isNaN(joinedDate.getTime())
    ? "Unavailable"
    : joinedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f8fafc] px-5 py-12 text-slate-900 transition-colors duration-300 dark:bg-[#080d1e] dark:text-white sm:px-8 lg:py-16">
      {/* Background programming grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-12 h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-72 h-96 w-96 rounded-full bg-violet-500/10 blur-[110px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Dashboard heading */}
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              My Learning Space
            </span>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Welcome back,
              <span className="mt-2 block bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-violet-400">
                {displayName}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Your personal space to explore programming projects, develop
              practical skills, and follow your learning journey with 961-Dev.
            </p>
          </div>

          {/* Account controls */}
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <ThemeToggle showLabel />

            <form action={logout}>
              <button
                type="submit"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-rose-400/50 dark:hover:text-rose-300"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>

        {/* Profile and progress dashboard */}
        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Profile information */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#151d34] lg:col-span-2">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />

            <div className="p-7 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">My Profile</h2>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Member
                </span>
              </div>

              {/* Profile avatar */}
              <div className="mt-8 flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-emerald-400/20 via-cyan-400/20 to-violet-400/20 text-4xl font-extrabold text-cyan-700 shadow-lg shadow-cyan-500/10 dark:text-cyan-300">
                  {initial}
                </div>

                <h3 className="mt-5 break-words text-xl font-bold">
                  {displayName}
                </h3>

                <p className="mt-2 break-all text-sm text-slate-500 dark:text-slate-400">
                  {email}
                </p>
              </div>

              {/* User information */}
              <div className="mt-8 space-y-5 border-t border-slate-200 pt-7 dark:border-white/10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {displayName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email Address
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Member Since
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Learning progress */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#151d34] lg:col-span-3">
            <div className="h-1.5 bg-gradient-to-r from-cyan-400 to-violet-400" />

            <div className="p-7 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
                    Your Development Journey
                  </span>

                  <h2 className="mt-3 text-2xl font-bold">Learning Progress</h2>
                </div>

                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                  Progress Overview
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                This is where your project missions, achievements, and learning
                progress will be displayed.
              </p>

              {/* Honest empty state until real progress data
                  is connected to the account dashboard. */}
              <div className="mt-8 rounded-2xl border border-dashed border-cyan-500/25 bg-cyan-500/5 px-6 py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-3xl text-cyan-600 dark:text-cyan-300">
                  {"</>"}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Your Learning Journey Starts Here
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Explore the available projects and prepare for guided
                  missions. Your saved completion progress will be shown here
                  when progress tracking is connected to this dashboard.
                </p>

                <Link
                  href="/projects"
                  className="mt-7 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-1 hover:shadow-cyan-500/20"
                >
                  Explore Projects
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 font-mono font-bold text-emerald-600 dark:text-emerald-300"
                >
                  ✓
                </span>

                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Build your skills through practical work, one mission at a
                  time.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Next steps */}
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
                Keep Growing
              </span>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                What Will You Build Next?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Discover programming paths and choose your next challenge.
              </p>
            </div>

            <Link
              href="/projects"
              className="text-sm font-bold text-cyan-700 transition hover:text-blue-600 dark:text-cyan-300 dark:hover:text-emerald-300"
            >
              View Project Catalog →
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {/* React */}
            <Link
              href="/projects#react"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-[#151d34]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl text-cyan-600 dark:text-cyan-300">
                  ⚛
                </span>

                <span className="text-sm text-slate-400 transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold">React</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Create interactive interfaces using reusable components.
              </p>

              <p className="mt-6 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                Explore React Projects
              </p>
            </Link>

            {/* HTML / CSS / JavaScript */}
            <Link
              href="/projects#html-css-js"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-[#151d34]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-300">
                  {"</>"}
                </span>

                <span className="text-sm text-slate-400 transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold">
                HTML / CSS / JavaScript
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Build responsive websites with fundamental web technologies.
              </p>

              <p className="mt-6 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Explore Web Projects
              </p>
            </Link>

            {/* PHP: Listed for the future, not clickable */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#151d34]">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 font-mono text-2xl font-bold text-violet-600 dark:text-violet-300">
                  {"<?"}
                </span>

                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                  Coming Soon
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold">PHP</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Guided backend programming projects are planned for future
                releases.
              </p>

              <p className="mt-6 text-xs font-semibold text-amber-600 dark:text-amber-300">
                Projects Coming Soon
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard footer */}
        <div className="mt-16 border-t border-slate-200 pt-8 text-center dark:border-white/10">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Learn. Build. Grow.
          </p>
        </div>
      </div>
    </main>
  );
}
