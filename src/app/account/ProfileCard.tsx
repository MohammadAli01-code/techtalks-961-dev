
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "./profile-actions";

type ProfileCardProps = {
  displayName: string;
  email: string;
  memberSince: string;
  profileAvailable: boolean;
};

export default function ProfileCard({
  displayName,
  email,
  memberSince,
  profileAvailable,
}: ProfileCardProps) {
  const router = useRouter();

  // Profile editing and feedback states.
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Generate avatar initials from the authenticated user's name.
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // Open the edit form.
  function handleEdit() {
    setName(displayName);
    setError("");
    setSuccess("");
    setIsEditing(true);
  }

  // Cancel editing without saving changes.
  function handleCancel() {
    setName(displayName);
    setError("");
    setSuccess("");
    setIsEditing(false);
  }

  // Validate and save profile changes.
  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Please enter a name with at least 2 characters.");
      return;
    }

    if (trimmedName.length > 80) {
      setError("Your name cannot exceed 80 characters.");
      return;
    }

    if (trimmedName === displayName) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      // Save the authenticated user's profile on the server.
      const result = await updateProfile(trimmedName);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setName(trimmedName);
      setSuccess("Your profile has been updated successfully.");
      setIsEditing(false);

      // Refresh the server-rendered profile and welcome heading.
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#11182b]">

      {/* Profile heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
            {"// user.profile"}
          </p>

          <h2 className="mt-2 text-xl font-bold">
            My Profile
          </h2>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            disabled={!profileAvailable || isSaving}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-cyan-400"
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m16 3 5 5L9 20H4v-5L16 3Z" />
              <path d="m13 6 5 5" />
            </svg>

            Edit Profile
          </button>
        )}
      </div>

      {/* Developer avatar */}
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0066FF] to-cyan-500 font-mono text-xl font-bold text-white">
          {initials || "D"}
        </div>

        <div className="min-w-0">
          <p className="font-mono text-xs text-blue-600 dark:text-cyan-400">
            {"<Developer />"}
          </p>

          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            961-Dev Member
          </p>
        </div>
      </div>

      {/* Profile loading error */}
      {!profileAvailable && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300"
        >
          Your saved profile is currently unavailable. Profile editing
          is temporarily disabled.
        </div>
      )}

      {/* Success feedback */}
      {success && (
        <div
          role="status"
          className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-5">

        {/* Editable full name */}
        <div>
          <label
            htmlFor="profile-name"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Full Name
          </label>

          {isEditing ? (
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              maxLength={80}
              required
              autoFocus
              autoComplete="name"
              disabled={isSaving}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "profile-error" : undefined}
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 dark:border-white/10 dark:bg-[#080d1e] dark:text-white"
            />
          ) : (
            <p className="mt-2 break-words text-sm font-semibold">
              {displayName}
            </p>
          )}
        </div>

        {/* Read-only authenticated email */}
        <div className="border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email Address
            </p>

            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
              read-only
            </span>
          </div>

          <p className="mt-2 break-all text-sm font-medium">
            {email}
          </p>
        </div>

        {/* Real account creation date */}
        <div className="border-t border-slate-200 pt-4 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Member Since
          </p>

          <p className="mt-2 text-sm font-medium">
            {memberSince}
          </p>
        </div>

        {/* Error feedback */}
        {error && (
          <div
            id="profile-error"
            role="alert"
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Edit form controls */}
        {isEditing && (
          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}

              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
