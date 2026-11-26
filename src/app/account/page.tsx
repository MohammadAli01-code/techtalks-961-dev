
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileCard from "./ProfileCard";

// Available programming paths.
const technologies = [
  {
    name: "React",
    icon: "⚛",
    description: "Build interactive interfaces using reusable components.",
    href: "/projects#react",
  },
  {
    name: "HTML / CSS / JavaScript",
    icon: "</>",
    description: "Build responsive websites using core web technologies.",
    href: "/projects#html-css-js",
  },
  {
    name: "PHP",
    icon: "<?",
    description: "Explore backend programming and server-side development.",
    href: null,
  },
];

// Shared card styling for light and dark themes.
const cardClass =
  "min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#11182b]";

export default async function AccountPage() {
  const supabase = await createClient();

  // Verify the authenticated user on the server.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Retrieve the authenticated user's profile.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  // Use registration metadata as a fallback.
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const displayName =
    profile?.display_name?.trim() || metadataName || "Developer";

  const email = user.email || "Email unavailable";

  // Format the real account creation date.
  const joinedDate = new Date(user.created_at);

  const memberSince = Number.isNaN(joinedDate.getTime())
    ? "Unavailable"
    : joinedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

  const firstName = displayName.split(/\s+/)[0];

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-[#080d1e] dark:text-white sm:px-6 lg:px-8">

      {/* Subtle programming grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl">

        {/* Dashboard heading */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
              {"// developer.workspace"}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active session
            </span>
          </div>

          <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back,{" "}
            <span className="text-[#0066FF] dark:text-cyan-400">
              {firstName}
            </span>
            <span className="text-blue-600 dark:text-cyan-400">.</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            Manage your developer profile, explore projects, and continue
            building your programming skills.
          </p>
        </header>

        {/* Profile and learning dashboard */}
        <div className="grid items-start gap-6 lg:grid-cols-5">

          {/* Editable profile */}
          <div className="min-w-0 lg:col-span-2">
            <ProfileCard
              displayName={displayName}
              email={email}
              memberSince={memberSince}
              profileAvailable={Boolean(profile) && !profileError}
            />
          </div>

          {/* Learning progress */}
          <section className={`${cardClass} lg:col-span-3`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
                  {"// learning.progress"}
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Learning Progress
                </h2>
              </div>

              <span className="rounded-lg bg-blue-500/10 px-3 py-2 font-mono text-xs text-blue-600 dark:text-cyan-400">
                {"<missions />"}
              </span>
            </div>

            {/* Progress data has not been connected yet. */}
            <div className="mt-6 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/[0.04] px-5 py-9 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-mono text-2xl font-bold text-blue-600 dark:text-cyan-400">
                {"</>"}
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Your Next Mission Awaits
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
                Explore guided projects and build real programming skills.
                Your saved progress will appear here once progress tracking
                is connected.
              </p>

              <Link
                href="/projects"
                className="mt-6 inline-flex items-center justify-center gap-3 rounded-lg bg-[#0066FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                Explore Projects
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="shrink-0 font-mono text-blue-600 dark:text-cyan-400">
                {">_"}
              </span>

              <p className="text-xs leading-6 text-slate-600 dark:text-slate-400 sm:text-sm">
                Build something new. Learn from every line of code.
              </p>
            </div>
          </section>
        </div>

        {/* Available programming paths */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
                {"// explore.stack"}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                What Will You Build Next?
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Choose your technology and start your next challenge.
              </p>
            </div>

            <Link
              href="/projects"
              className="text-sm font-semibold text-blue-600 hover:underline dark:text-cyan-400"
            >
              View Project Catalog →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technologies.map((technology) => {
              const content = (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10 font-mono text-xl font-bold text-blue-600 dark:text-cyan-400">
                      {technology.icon}
                    </span>

                    {technology.href ? (
                      <span
                        aria-hidden="true"
                        className="text-slate-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-base font-bold">
                    {technology.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {technology.description}
                  </p>

                  <p className="mt-5 text-xs font-semibold text-blue-600 dark:text-cyan-400">
                    {technology.href
                      ? "Explore Projects →"
                      : "Planned for a future release"}
                  </p>
                </>
              );

              return technology.href ? (
                <Link
                  key={technology.name}
                  href={technology.href}
                  className={`${cardClass} group transition duration-200 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg`}
                >
                  {content}
                </Link>
              ) : (
                <div key={technology.name} className={cardClass}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center dark:border-white/10">
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {"< Learn. Build. Grow. />"}
          </p>
        </div>
      </div>
    </main>
  );
}
