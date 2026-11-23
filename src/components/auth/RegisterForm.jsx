"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthModal } from "@/components/auth/AuthModalContext";

export default function RegisterForm() {
  // Switch between registration and login within the modal.
  const { openAuthModal, nextPath } = useAuthModal();

  // Store the registration form values.
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Store validation errors and submission status.
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  // Control the visibility of each password field independently.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update input values and clear previous errors.
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

  // Validate all registration fields.
  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

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

      // Create a real Supabase Auth account.
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
        // Email confirmation may be disabled.
        setStatusMessage("Account created successfully! You are signed in.");
      } else {
        // Common when email confirmation is enabled.
        setStatusMessage(
          "If registration is successful, check your email for a confirmation link before logging in.",
        );
      }

      // Clear password inputs after successful submission.
      setFormData((previous) => ({
        ...previous,
        password: "",
        confirmPassword: "",
      }));

      // Return both fields to their hidden state.
      setShowPassword(false);
      setShowConfirmPassword(false);
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

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="mb-2 text-center text-2xl font-bold">
        Create Your Account
      </h1>

      <p className="mb-6 text-center text-gray-600">
        Start your learning journey with 961-Dev.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="mb-1 block">
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
            placeholder="Enter your full name"
            className="w-full rounded-lg border p-3"
          />

          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="registerEmail" className="mb-1 block">
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
            placeholder="Enter your email"
            className="w-full rounded-lg border p-3"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="registerPassword" className="mb-1 block">
            Password
          </label>

          <div className="relative">
            <input
              id="registerPassword"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              placeholder="Enter your password"
              className="w-full rounded-lg border p-3 pr-12"
            />

            {/* Show or hide the registration password. */}
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 transition-colors hover:text-blue-600 focus-visible:text-blue-600"
            >
              {showPassword ? (
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
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-1 block">
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
              placeholder="Confirm your password"
              className="w-full rounded-lg border p-3 pr-12"
            />

            {/* Control confirmation visibility independently. */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirmation password"
                  : "Show confirmation password"
              }
              aria-pressed={showConfirmPassword}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 transition-colors hover:text-blue-600 focus-visible:text-blue-600"
            >
              {showConfirmPassword ? (
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

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
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

      {/* Switch to Login inside the same modal */}
      <p className="mt-5 text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => openAuthModal("login", nextPath)}
          className="text-blue-600 underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
