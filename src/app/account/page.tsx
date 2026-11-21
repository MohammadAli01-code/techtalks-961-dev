
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function AccountPage() {
  const supabase = await createClient();

  // Preserve existing server-side authentication.
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  // Read only the authenticated user's profile.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Unable to load account profile");
  }

  const displayName = profile?.display_name || "Developer";

  // Create a simple avatar using the user's first initial.
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <section className="relative isolate min-h-[calc(100vh-90px)] overflow-hidden bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      {/* Programming grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl space-y-8">
        {/* Page introduction */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-xs text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            DEVELOPER WORKSPACE
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            My <span className="text-primary">Account.</span>
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
            Manage your developer identity and get ready to
            build your next project with 961-Dev.
          </p>
        </div>

        {/* Main dashboard */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          {/* Profile card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between border-b border-border bg-background/50 px-5 py-4">
              <span className="font-mono text-xs font-semibold text-muted">
                developer.profile
              </span>

              <span className="rounded-lg bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                AUTHENTICATED
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-4xl font-bold text-primary">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
                    Developer Profile
                  </p>

                  <h2 className="break-words text-2xl font-bold tracking-tight">
                    {displayName}
                  </h2>

                  <p className="mt-2 text-sm text-muted">
                    Your 961-Dev workspace is ready.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
                  Account Information
                </h3>

                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <p className="mb-2 text-xs text-muted">
                      Display Name
                    </p>

                    <p className="break-words text-sm font-semibold">
                      {profile?.display_name || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <p className="mb-2 text-xs text-muted">
                      Account Status
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold">
                        Signed In
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <p className="mb-2 text-xs text-muted">
                      Authentication
                    </p>

                    <p className="text-sm font-semibold">
                      Supabase Auth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Security card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-primary/5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-mono text-xl text-primary">
                  {"{}"}
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Account Security
                  </h2>

                  <p className="text-xs text-muted">
                    Protected developer access
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-500">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      Verified Authentication Token
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Your authentication claims were
                      verified on the server.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-500">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      Protected Account Page
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Guests must sign in before accessing
                      this page.
                    </p>
                  </div>
                </div>
              </div>

              {/* Existing logout Server Action */}
              <form action={logout} className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                >
                  Log Out
                </button>
              </form>
            </div>

            {/* Quick navigation */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-primary/5">
              <p className="mb-2 font-mono text-xs font-semibold text-primary">
                QUICK ACCESS
              </p>

              <h2 className="text-lg font-bold">
                Developer Hub
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Return to the 961-Dev homepage and
                explore your learning environment.
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                Back to Home →
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative terminal */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between border-b border-border bg-background/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>

            <span className="font-mono text-xs text-muted">
              961-dev — terminal preview
            </span>

            <span className="font-mono text-xs text-primary">
              {"</>"}
            </span>
          </div>

          <div className="space-y-3 p-5 font-mono text-xs sm:p-6 sm:text-sm">
            <p>
              <span className="text-emerald-500">
                developer@961-dev $
              </span>{" "}
              echo &quot;Welcome back&quot;
            </p>

            <p className="text-muted">
              Welcome back
            </p>

            <p>
              <span className="text-emerald-500">
                developer@961-dev $
              </span>{" "}
              echo &quot;Ready to build&quot;
            </p>

            <p className="text-primary">
              Ready to build
            </p>

            <p>
              <span className="text-emerald-500">
                developer@961-dev $
              </span>{" "}
              <span className="inline-block h-3 w-1.5 animate-pulse bg-primary" />
            </p>
          </div>

          <div className="flex items-center justify-between bg-primary px-4 py-2 font-mono text-[10px] text-white">
            <span>961-Dev Workspace</span>
            <span>Account · Ready</span>
          </div>
        </div>

        <p className="text-center font-mono text-xs text-muted">
          {"// Learn. Build. Grow."}
        </p>
      </div>
    </section>
  );
}
