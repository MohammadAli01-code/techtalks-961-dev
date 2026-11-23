
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthModal } from "@/components/auth/AuthModalContext";

type NavbarProps = {
  isAuthenticated?: boolean;
  logoutAction?: () => Promise<void>;
};

export default function Navbar({
  isAuthenticated = false,
  logoutAction,
}: NavbarProps) {
  // Control the mobile navigation menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  // Use the existing shared Login/Register modal.
  const { openAuthModal } = useAuthModal();

  function handleOpenAuth(mode: "login" | "register") {
    setIsMenuOpen(false);
    openAuthModal(mode, "/projects");
  }

  // Restore the saved theme when the Navbar mounts.
  useEffect(() => {
    const savedTheme = localStorage.getItem("961dev-theme");

    // Dark mode is the default unless light mode was saved.
    const isDark = savedTheme !== "light";

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Switch themes without using React state.
  function toggleTheme() {
    const html = document.documentElement;

    const nextIsDark = !html.classList.contains("dark");

    // Apply the theme immediately.
    html.classList.toggle("dark", nextIsDark);

    // Save the preference for future visits.
    localStorage.setItem(
      "961dev-theme",
      nextIsDark ? "dark" : "light"
    );
  }

  const links = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/#about" },
    { label: "Projects", href: "/#projects-preview" },
  ];

  const navLinkClass =
    "text-sm font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-emerald-300";

  const buttonClass =
    "rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110";

  // Display authentication controls based on login status.
  function renderAuthButtons() {
    if (isAuthenticated) {
      return (
        <>
          <Link
            href="/account"
            onClick={() => setIsMenuOpen(false)}
            className={navLinkClass}
          >
            Account
          </Link>

          {logoutAction && (
            <form action={logoutAction}>
              <button type="submit" className={buttonClass}>
                Logout
              </button>
            </form>
          )}
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => handleOpenAuth("login")}
          className={navLinkClass}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => handleOpenAuth("register")}
          className={buttonClass}
        >
          Get Started
        </button>
      </>
    );
  }

  // The icons switch automatically through Tailwind's dark classes.
  function renderThemeButton() {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark and light mode"
        title="Toggle dark and light mode"
        className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-lg text-slate-800 transition hover:border-blue-500 hover:bg-slate-200 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:border-emerald-300/50 dark:hover:bg-white/5"
      >
        {/* Shown in dark mode */}
        <span className="hidden dark:inline" aria-hidden="true">
          ☀
        </span>

        {/* Shown in light mode */}
        <span className="inline dark:hidden" aria-hidden="true">
          ☾
        </span>
      </button>
    );
  }

  return (
    <nav
      aria-label="Main navigation"
      className="relative w-full border-b border-slate-200 bg-white shadow-lg shadow-black/5 transition-colors duration-300 dark:border-white/10 dark:bg-[#080d1e] dark:shadow-black/10"
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        {/* Website logo */}
        <Link
          href="/"
          aria-label="961-Dev Home"
          className="shrink-0"
        >
          {/* Light mode: blue and black logo */}
          <Image
            src="/logo.png"
            alt="961-Dev Logo"
            width={180}
            height={60}
            className="h-auto w-[135px] dark:hidden lg:w-[160px]"
            priority
          />

          {/* Dark mode: blue and white logo */}
          <Image
            src="/logo-dark.png"
            alt="961-Dev Logo"
            width={180}
            height={60}
            className="hidden h-auto w-[135px] dark:block lg:w-[160px]"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={
                pathname === link.href &&
                !link.href.includes("#")
                  ? "page"
                  : undefined
              }
              className={navLinkClass}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop authentication and theme */}
        <div className="hidden items-center gap-4 lg:flex">
          {renderAuthButtons()}
          {renderThemeButton()}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="rounded-xl border border-slate-300 bg-slate-100 p-2 text-2xl text-slate-800 transition hover:bg-slate-200 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5 lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-6 py-5 dark:border-white/10 dark:bg-[#080d1e] lg:hidden"
        >
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={navLinkClass}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-5 dark:border-white/10">
              {renderAuthButtons()}
              {renderThemeButton()}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
