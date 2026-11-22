
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Use the shared authentication popup across the website.
  const { openAuthModal } = useAuthModal();
  // Open the shared popup and close the mobile menu.
function handleOpenAuth(mode: "login" | "register") {
  setIsMenuOpen(false);
  openAuthModal(mode, "/projects");
}

  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
  const savedTheme = localStorage.getItem("961dev-theme");
  const dark = savedTheme !== "light";

  document.documentElement.classList.toggle("dark", dark);
}, []);

  function toggleTheme() {
    const nextTheme = !isDark;

    setIsDark(nextTheme);
    document.documentElement.classList.toggle(
      "dark",
      nextTheme
    );
    localStorage.setItem(
      "961dev-theme",
      nextTheme ? "dark" : "light"
    );
  }

  const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Projects", href: "/#projects-preview" },
];

  const navLinkClass =
    "text-sm font-medium text-slate-300 transition-colors hover:text-emerald-300";

  const buttonClass =
    "rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110";

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

  function renderThemeButton() {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        className="rounded-xl border border-white/15 px-3 py-2 text-lg text-white transition hover:border-emerald-300/50"
      >
        {isDark ? "☀" : "☾"}
      </button>
    );
  }

  return (
    <nav
      aria-label="Main navigation"
      className="relative w-full border-b border-white/10 bg-[#080d1e] shadow-lg shadow-black/10"
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="961-Dev Home"
          className="shrink-0"
        >
          <Image
            src="/logo-dark.png"
            alt="961-Dev Logo"
            width={180}
            height={60}
            className="h-auto w-[135px] lg:w-[160px]"
            priority
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

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-xl border border-white/15 p-2 text-2xl text-white lg:hidden"
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
          className="border-t border-white/10 bg-[#080d1e] px-6 py-5 lg:hidden"
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

            <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
              {renderAuthButtons()}
              {renderThemeButton()}
            </div>
          </div>
        </div>
            )}

      
    </nav>
  );
}
