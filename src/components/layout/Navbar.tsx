
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Keep the Navbar updated when authentication changes.
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;

        setIsLoggedIn(Boolean(session?.user));
        setIsCheckingAuth(false);
      }
    );

    // Check the current authenticated user.
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (!error) {
        setIsLoggedIn(Boolean(data.user));
      }

      setIsCheckingAuth(false);
    }

    void checkUser();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const linkClass =
    "text-sm font-medium text-foreground/80 " +
    "transition-colors hover:text-primary";

  const mobileLinkClass =
    "block rounded-lg px-3 py-2.5 text-sm " +
    "font-medium text-foreground/80 " +
    "transition-colors hover:bg-primary/10 " +
    "hover:text-primary";

  const logoutClass =
    "rounded-xl border border-border px-4 py-2 " +
    "text-sm font-medium text-foreground " +
    "transition-colors hover:border-primary " +
    "hover:text-primary";

  return (
    <nav
      aria-label="Main navigation"
      className="w-full"
    >
      {/* Main Navbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="961-Dev Home"
          className="flex shrink-0 items-center"
          onClick={closeMenu}
        >
          <Image
            src="/logo.png"
            alt="961-Dev Logo"
            width={180}
            height={60}
            className="h-auto w-[150px] sm:w-[180px]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={linkClass}
          >
            Home
          </Link>

          {!isCheckingAuth && (
            <>
              {isLoggedIn ? (
                <>
                  {/* Signed-in user */}
                  <Link
                    href="/account"
                    className={linkClass}
                  >
                    Account
                  </Link>

                  {/* Use existing Logout Server Action */}
                  <form action={logout}>
                    <button
                      type="submit"
                      className={logoutClass}
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* Guest user */}
                  <Link
                    href="/login"
                    className={linkClass}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}

          {/* Existing Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="rounded-lg border border-border bg-surface p-2 text-foreground transition-colors hover:border-primary"
          >
            <span
              aria-hidden="true"
              className="text-xl leading-none"
            >
              {isMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="mt-4 space-y-2 rounded-2xl border border-border bg-surface p-4 shadow-lg md:hidden"
        >
          <Link
            href="/"
            onClick={closeMenu}
            className={mobileLinkClass}
          >
            Home
          </Link>

          {!isCheckingAuth && (
            <>
              {isLoggedIn ? (
                <>
                  {/* Signed-in user */}
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Account
                  </Link>

                  {/* Same Server Action on mobile */}
                  <form action={logout}>
                    <button
                      type="submit"
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* Guest user */}
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:brightness-110"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
