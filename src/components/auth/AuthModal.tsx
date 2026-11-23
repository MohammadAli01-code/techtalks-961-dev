"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthModalProps = {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
};

export default function AuthModal({ isOpen, mode, onClose }: AuthModalProps) {
  // Reference the modal dialog for keyboard focus.
  const dialogRef = useRef<HTMLDivElement>(null);

  // Remember which element opened the modal.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const dialog = dialogRef.current;

    // Move keyboard focus inside the dialog.
    const firstFocusable = dialog?.querySelector<HTMLElement>(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
    );

    firstFocusable?.focus();

    // Prevent background scrolling while the modal is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      // Keep focus inside the modal.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      // Return focus to the button that opened the modal.
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          mode === "login" ? "Log in to 961-Dev" : "Register for 961-Dev"
        }
        tabIndex={-1}
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

          <p className="mt-2 text-sm text-slate-500">Learn. Build. Grow.</p>
        </div>

        {/* Existing Supabase authentication forms */}
        <div className="text-slate-900">
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>,
    document.body,
  );
}
