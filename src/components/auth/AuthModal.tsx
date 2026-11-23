
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// Define the information received from Navbar.
type AuthModalProps = {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "register") => void;
};

export default function AuthModal({
  isOpen,
  mode,
  onClose,
}: AuthModalProps) {
  // Allow users to close the popup with Escape.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;;

  return createPortal(
  <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020617]/80 px-4 py-8 backdrop-blur-md"
      onMouseDown={(event) => {
        // Close only when clicking outside the form.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          mode === "login" ? "Log in to 961-Dev" : "Register for 961-Dev"
        }
        className="relative my-auto w-full max-w-md rounded-3xl border border-cyan-400/20 bg-white p-4 shadow-[0_25px_100px_rgba(34,211,238,0.15)] sm:p-6"
      >
        {/* Close popup */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication form"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
        >
          ×
        </button>

        {/* Branding */}
        <div className="pt-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            961-Dev
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Learn. Build. Grow.
          </p>
        </div>

        {/* Reuse the existing Supabase authentication forms */}
        <div className="text-slate-900">
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>

      </div>
        </div>,
    document.body
  );
}
