
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Decorative developer workspace for the Login page.
// The editor, project explorer, and terminal are visual previews.
function DeveloperWorkspace() {
  const files = [
    { name: "src", level: 0, folder: true },
    { name: "components", level: 1, folder: true },
    { name: "missions", level: 1, folder: true },
    { name: "MissionCard.jsx", level: 2 },
    { name: "ProgressBar.jsx", level: 2 },
    { name: "login.jsx", level: 1, active: true },
    { name: "package.json", level: 0 },
  ];

  return (
    <div className="space-y-7">
      {/* Developer introduction */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-xs text-primary">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          YOUR DEVELOPER WORKSPACE
        </span>

        <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
          Welcome back.
          <span className="block text-primary">
            Keep building.
          </span>
        </h2>

        <p className="mt-5 max-w-lg text-base leading-7 text-muted">
          Pick up where you left off. Continue your guided
          missions, build real projects, and grow your
          development skills with 961-Dev.
        </p>
      </div>

      {/* Developer IDE window */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-primary/10">
        {/* IDE title bar */}
        <div className="flex items-center justify-between border-b border-border bg-background/60 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>

          <span className="font-mono text-[11px] text-muted">
            961-dev — workspace
          </span>

          <span className="font-mono text-primary">
            {"</>"}
          </span>
        </div>

        {/* Explorer and editor */}
        <div className="grid grid-cols-[115px_minmax(0,1fr)] xl:grid-cols-[145px_minmax(0,1fr)]">
          {/* Project Explorer */}
          <div className="min-w-0 border-r border-border bg-background/40 py-4">
            <p className="mb-4 px-3 font-mono text-[10px] font-bold tracking-widest text-muted">
              EXPLORER
            </p>

            <p className="mb-3 px-3 font-mono text-xs font-semibold">
              <span className="mr-1 text-primary">⌄</span>
              961-DEV
            </p>

            {files.map((file) => (
              <div
                key={file.name}
                style={{
                  paddingLeft: `${8 + file.level * 9}px`,
                }}
                className={`flex min-w-0 items-center gap-1 border-l-2 py-1.5 pr-1 font-mono text-[10px] ${
                  file.active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted"
                }`}
              >
                <span className="text-primary">
                  {file.folder ? "▸" : "◇"}
                </span>

                <span className="truncate">
                  {file.name}
                </span>
              </div>
            ))}
          </div>

          {/* Code Editor */}
          <div className="min-w-0">
            {/* Editor tabs */}
            <div className="flex border-b border-border bg-background/40 font-mono text-xs">
              <div className="border-r border-t-2 border-r-border border-t-primary bg-surface px-3 py-3">
                <span className="mr-1 text-primary">
                  ◇
                </span>
                login.jsx
              </div>

              <div className="truncate px-3 py-3 text-muted">
                missions.js
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 py-2 font-mono text-[10px] text-muted">
              src / login.jsx
            </div>

            {/* Decorative code */}
            <div className="overflow-x-auto border-t border-border px-4 py-5 font-mono text-xs leading-7">
              <div className="min-w-max space-y-1">
                <p className="text-muted">
                  {"// Continue your developer journey"}
                </p>

                <p>
                  <span className="text-violet-500">
                    const
                  </span>{" "}
                  <span className="text-primary">
                    developer
                  </span>
                  {" = {"}
                </p>

                <p>
                  {"  "}name:{" "}
                  <span className="text-emerald-500">
                    &quot;You&quot;
                  </span>,
                </p>

                <p>
                  {"  "}platform:{" "}
                  <span className="text-emerald-500">
                    &quot;961-Dev&quot;
                  </span>,
                </p>

                <p>
                  {"  "}learning:{" "}
                  <span className="text-amber-500">
                    true
                  </span>,
                </p>

                <p>
                  {"  "}building:{" "}
                  <span className="text-amber-500">
                    true
                  </span>
                </p>

                <p>{"};"}</p>

                <p className="pt-2">
                  <span className="text-primary">
                    developer
                  </span>
                  .continueJourney();
                </p>
              </div>
            </div>

            {/* Mission preview */}
            <div className="border-t border-border bg-background/20 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-muted">
                  GUIDED MISSIONS
                </span>

                <span className="rounded bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">
                  PREVIEW
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["Setup", "Build", "Ship"].map(
                  (mission, index) => (
                    <div
                      key={mission}
                      className={`min-w-0 rounded-lg border p-2 ${
                        index === 0
                          ? "border-primary/50 bg-primary/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <p className="font-mono text-xs font-bold text-primary">
                        0{index + 1}
                      </p>

                      <p className="mt-2 truncate text-[11px]">
                        {mission}
                      </p>

                      <div className="mt-3 h-1 rounded-full bg-border">
                        {index === 0 && (
                          <div className="h-1 w-1/3 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <div className="border-t border-border bg-background/60">
          <div className="flex gap-5 border-b border-border px-4 py-3 font-mono text-[10px] font-semibold">
            <span className="border-b-2 border-primary pb-1 text-primary">
              TERMINAL
            </span>

            <span className="text-muted">
              OUTPUT
            </span>

            <span className="text-muted">
              PROBLEMS
            </span>
          </div>

          <div className="space-y-2 px-4 py-4 font-mono text-xs">
            <p>
              <span className="text-emerald-500">
                961-dev $
              </span>{" "}
              npm run dev
            </p>

            <p className="text-muted">
              Initializing developer workspace...
            </p>

            <p className="text-emerald-500">
              ✓ Project environment ready
            </p>

            <p className="text-emerald-500">
              ✓ Guided missions available
            </p>

            <p>
              <span className="text-primary">
                961-dev $
              </span>{" "}
              <span className="inline-block h-3 w-1.5 animate-pulse bg-primary" />
            </p>
          </div>
        </div>

        {/* IDE status bar */}
        <div className="flex justify-between bg-primary px-4 py-2 font-mono text-[10px] text-white">
          <span>961-Dev Workspace</span>
          <span>JavaScript · Ready</span>
        </div>
      </div>

      <p className="text-center font-mono text-xs text-muted">
        {"// Learn. Build. Grow."}
      </p>
    </div>
  );
}

// Main Login Form
export default function LoginForm() {
  const router = useRouter();

  // Form values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Validation and feedback
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Update input values
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  // Validate fields
  function validateForm() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // Real Supabase login
  async function handleSubmit(event) {
    event.preventDefault();

    setStatusMessage("");
    setStatusType("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (error) {
        throw error;
      }

      setStatusType("success");
      setStatusMessage("Login successful!");

      // Preserve the existing redirect behavior
      router.refresh();
      router.push("/");
    } catch (error) {
      setStatusType("error");

      setStatusMessage(
        error?.code === "invalid_credentials"
          ? "Invalid email or password."
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Shared input styling
  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <section className="relative isolate min-h-[calc(100vh-90px)] overflow-hidden bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Blue background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Main layout */}
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Left developer workspace */}
        <div className="hidden lg:block">
          <DeveloperWorkspace />
        </div>

        {/* Right login card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-2xl shadow-primary/10 sm:p-9">
            {/* Card heading */}
            <div className="mb-8">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-mono text-xl font-bold text-primary">
                {"</>"}
              </div>

              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Developer access
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                Log in to continue building real projects
                with 961-Dev.
              </p>
            </div>

            {/* Login form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="loginEmail"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email
                      ? "login-email-error"
                      : undefined
                  }
                  placeholder="you@example.com"
                  className={inputClass}
                />

                {errors.email && (
                  <p
                    id="login-email-error"
                    role="alert"
                    className="mt-2 text-sm text-red-500"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="loginPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="loginPassword"
                    name="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password
                        ? "login-password-error"
                        : undefined
                    }
                    placeholder="Enter your password"
                    className={`${inputClass} pr-16`}
                  />

                  {/* Show / Hide password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted hover:text-primary"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <p
                    id="login-password-error"
                    role="alert"
                    className="mt-2 text-sm text-red-500"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Logging In..."
                  : "Log In →"}
              </button>
            </form>

            {/* Supabase status messages */}
            {statusMessage && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-5 rounded-xl border p-4 text-sm ${
                  statusType === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {statusMessage}
              </p>
            )}

            {/* Registration link */}
            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-sm text-muted">
                New to 961-Dev?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center font-mono text-xs text-muted">
            {"// Your next commit starts here."}
          </p>
        </div>
      </div>
    </section>
  );
}
