
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Developer-themed illustration.
// This workspace is decorative, not a functional code editor.
function DeveloperWorkspace() {
  const files = [
    { name: "src", level: 0, folder: true },
    { name: "components", level: 1, folder: true },
    { name: "missions", level: 1, folder: true },
    { name: "MissionCard.jsx", level: 2 },
    { name: "ProgressBar.jsx", level: 2 },
    { name: "register.jsx", level: 1, active: true },
    { name: "package.json", level: 0 },
  ];

  return (
    <div className="space-y-7">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-xs text-primary">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          BUILT FOR DEVELOPERS
        </span>

        <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
          Stop watching.
          <span className="block text-primary">
            Start building.
          </span>
        </h2>

        <p className="mt-5 max-w-lg text-base leading-7 text-muted">
          Turn coding knowledge into real projects.
          Complete guided missions and grow your
          development skills with 961-Dev.
        </p>
      </div>

      {/* IDE window */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-primary/10">
        {/* Window header */}
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
            <div className="flex border-b border-border bg-background/40 font-mono text-xs">
              <div className="border-r border-t-2 border-r-border border-t-primary bg-surface px-3 py-3">
                <span className="mr-1 text-primary">◇</span>
                register.jsx
              </div>

              <div className="truncate px-3 py-3 text-muted">
                missions.js
              </div>
            </div>

            <div className="px-4 py-2 font-mono text-[10px] text-muted">
              src / register.jsx
            </div>

            <div className="overflow-x-auto border-t border-border px-4 py-5 font-mono text-xs leading-7">
              <div className="min-w-max space-y-1">
                <p className="text-muted">
                  {"// Your journey begins here"}
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
                  {"  "}skills:{" "}
                  <span className="text-emerald-500">
                    &quot;Growing&quot;
                  </span>,
                </p>

                <p>
                  {"  "}missions:{" "}
                  <span className="text-amber-500">
                    true
                  </span>,
                </p>

                <p>
                  {"  "}ready:{" "}
                  <span className="text-amber-500">
                    true
                  </span>
                </p>

                <p>{"};"}</p>

                <p className="pt-2">
                  <span className="text-primary">
                    developer
                  </span>
                  .startJourney();
                </p>
              </div>
            </div>

            {/* Decorative missions preview */}
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

        {/* Terminal illustration */}
        <div className="border-t border-border bg-background/60">
          <div className="flex gap-5 border-b border-border px-4 py-3 font-mono text-[10px] font-semibold">
            <span className="border-b-2 border-primary pb-1 text-primary">
              TERMINAL
            </span>
            <span className="text-muted">OUTPUT</span>
            <span className="text-muted">PROBLEMS</span>
          </div>

          <div className="space-y-2 px-4 py-4 font-mono text-xs">
            <p>
              <span className="text-emerald-500">
                961-dev $
              </span>{" "}
              start learning
            </p>

            <p className="text-muted">
              Initializing developer journey...
            </p>

            <p className="text-emerald-500">
              ✓ Guided projects ready
            </p>

            <p className="text-emerald-500">
              ✓ Missions available
            </p>

            <p>
              <span className="text-primary">
                961-dev $
              </span>{" "}
              <span className="inline-block h-3 w-1.5 animate-pulse bg-primary" />
            </p>
          </div>
        </div>

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

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // Update fields and clear previous validation errors.
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

  // Existing form validation.
  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // Keep the real Supabase authentication integration.
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

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      setStatusType("success");

      if (data.session) {
        setStatusMessage(
          "Account created successfully! You are signed in.",
        );
      } else {
        setStatusMessage(
          "If registration is successful, check your email for a confirmation link before logging in.",
        );
      }

      setFormData((previous) => ({
        ...previous,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setStatusType("error");

      setStatusMessage(
        error?.code === "weak_password"
          ? "Please choose a stronger password."
          : "Registration could not be completed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

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

      {/* Ambient blue glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Developer illustration */}
        <div className="hidden lg:block">
          <DeveloperWorkspace />
        </div>

        {/* Registration form */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-2xl shadow-primary/10 sm:p-9">
            <div className="mb-8">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-mono text-xl font-bold text-primary">
                {"</>"}
              </div>

              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Join the developer community
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                Start building real projects with 961-Dev.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={
                    errors.fullName
                      ? "register-name-error"
                      : undefined
                  }
                  placeholder="Enter your full name"
                  className={inputClass}
                />

                {errors.fullName && (
                  <p
                    id="register-name-error"
                    role="alert"
                    className="mt-2 text-sm text-red-500"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="registerEmail"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <input
                  id="registerEmail"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email
                      ? "register-email-error"
                      : undefined
                  }
                  placeholder="you@example.com"
                  className={inputClass}
                />

                {errors.email && (
                  <p
                    id="register-email-error"
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
                  htmlFor="registerPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="registerPassword"
                    name="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password
                        ? "register-password-error"
                        : undefined
                    }
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-16`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
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
                    id="register-password-error"
                    role="alert"
                    className="mt-2 text-sm text-red-500"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={Boolean(
                      errors.confirmPassword,
                    )}
                    aria-describedby={
                      errors.confirmPassword
                        ? "register-confirm-error"
                        : undefined
                    }
                    placeholder="Confirm your password"
                    className={`${inputClass} pr-16`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous,
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                    aria-pressed={showConfirmPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted hover:text-primary"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p
                    id="register-confirm-error"
                    role="alert"
                    className="mt-2 text-sm text-red-500"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Creating Account..."
                  : "Create Account →"}
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

            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-sm text-muted">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-xs text-muted">
            {"// Your next commit starts here."}
          </p>
        </div>
      </div>
    </section>
  );
}
