"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthModal } from "@/components/auth/AuthModalContext";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { nextPath, closeAuthModal, openAuthModal } = useAuthModal();
  const searchParams = useSearchParams();

  // Use the requested destination from the URL when available.
  // Otherwise use the destination stored by the shared popup.
  const requestedNext = searchParams.get("next");

  // Allow safe, internal destinations only.
  const isSafePath = (path) =>
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\");

  const redirectTo = isSafePath(requestedNext)
    ? requestedNext
    : isSafePath(nextPath)
      ? nextPath
      : "/";
  // Store the user's input values.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Store validation error messages.
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  // Update the field when the user types.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear the previous error for this field.
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  // Check whether the entered data is valid.
  function validateForm() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Clear previous status messages.
    setStatusMessage("");
    setStatusType("");

    // Keep Developer 2's existing form validation.
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create the existing Supabase browser client.
      const supabase = createClient();

      // Ask Supabase to authenticate the user.
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      // Authentication succeeded.
      setStatusType("success");
      setStatusMessage("Login successful!");

      // Close the authentication popup.
      closeAuthModal();

      // Navigate to the correct destination.
      router.push(redirectTo);

      // Refresh server-rendered authentication state.
      router.refresh();
    } catch (error) {
      setStatusType("error");

      // Avoid leaking unnecessary authentication details.
      setStatusMessage(
        error?.code === "invalid_credentials"
          ? "Invalid email or password."
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="mb-2 text-center text-2xl font-bold">Welcome Back</h1>

      <p className="mb-6 text-center text-gray-600">
        Log in to continue your learning journey.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email field */}
        <div>
          <label htmlFor="email" className="mb-1 block">
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            placeholder="Enter your email"
            className="w-full rounded-lg border p-3"
          />

          {errors.email && (
            <p
              id="login-email-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="mb-1 block">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              placeholder="Enter your password"
              className="w-full rounded-lg border p-3 pr-12"
            />

            {/* Toggle password visibility without submitting the form. */}
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 transition-colors hover:text-blue-600 focus-visible:text-blue-600"
            >
              {showPassword ? (
                // Eye with slash: hide password
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5 0 9.3 3.1 11 7-0.5 1.2-1.3 2.3-2.2 3.2" />
                  <path d="M6.1 6.1C3.9 7.5 2.5 9.6 1 12c1.7 3.9 6 7 11 7 1.6 0 3.1-.3 4.5-.9" />
                </svg>
              ) : (
                // Open eye: show password
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="login-password-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Logging In..." : "Log In"}
        </button>
      </form>

      {statusMessage && (
        <p
          role="status"
          className={`mt-4 rounded-lg p-3 text-sm ${
            statusType === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {statusMessage}
        </p>
      )}

      {/* Switch to Register inside the same modal */}
      <p className="mt-5 text-center">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => openAuthModal("register", nextPath)}
          className="text-blue-600 underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
