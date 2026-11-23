"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

import { useAuthModal } from "@/components/auth/AuthModalContext";

export default function RegisterForm() {
    // Switch to Login without leaving the homepage.
  const { openAuthModal, nextPath } = useAuthModal();
  // Store the registration form values.
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Store error messages for each field.
  const [errors, setErrors] = useState({});

  // Track the submission status.
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  // Update the input value and clear its previous error.
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

  // Check all registration fields.
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

    // Clear previous messages.
    setStatusMessage("");
    setStatusType("");

    // Validate name, email, password, and password confirmation.
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
    } catch (error) {
      setStatusType("error");

      // Show a safe general error message.
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
          <input
            id="registerPassword"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            placeholder="Enter your password"
            className="w-full rounded-lg border p-3"
          />
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
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            aria-invalid={Boolean(errors.confirmPassword)}
            placeholder="Confirm your password"
            className="w-full rounded-lg border p-3"
          />
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
