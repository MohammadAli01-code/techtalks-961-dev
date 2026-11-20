
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
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
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
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

  setStatusMessage("");
  setStatusType("");

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

  try {
    // Demo only — Supabase login is not connected.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatusType("success");
    setStatusMessage(
      "Demo: Login form validated successfully. You are not signed in."
    );
  } catch {
    setStatusType("error");
    setStatusMessage("Unable to log in. Please try again.");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="mb-2 text-center text-2xl font-bold">
        Welcome Back
      </h1>

      <p className="mb-6 text-center text-gray-600">
        Log in to continue your learning journey.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
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
            <p id="login-email-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="mb-1 block">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            placeholder="Enter your password"
            className="w-full rounded-lg border p-3"
          />

          {errors.password && (
            <p id="login-password-error" className="mt-1 text-sm text-red-600" role="alert">
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

      <p className="mt-5 text-center">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
