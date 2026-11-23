"use client";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useRef, useState } from "react";
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

  // Track whether the user has scrolled down the page.
  const [isScrolled, setIsScrolled] = useState(false);

  // Control whether the Navbar is visible.
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Remember the previous scroll position.
  const lastScrollY = useRef(0);

  const pathname = usePathname();

  // Use the existing shared Login/Register modal.
  const { openAuthModal } = useAuthModal();

  function handleOpenAuth(mode: "login" | "register") {
    setIsMenuOpen(false);
    openAuthModal(mode, "/projects");
  }

  // Restore the user's saved theme.
  useEffect(() => {
    const savedTheme = localStorage.getItem("961dev-theme");

    // Dark mode is the default unless light mode was saved.
    const isDark = savedTheme !== "light";

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Toggle between light and dark modes.

  // Hide the Navbar while scrolling down.
  // Reveal it when scrolling up or returning to the top.
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      // Keep navigation visible while the mobile menu is open.
      if (isMenuOpen) {
        setIsNavbarVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Always display the Navbar near the top of the page.
      if (currentScrollY <= 20) {
        setIsNavbarVisible(true);
      } else {
        const scrollDifference = currentScrollY - lastScrollY.current;

        // Ignore tiny movements to prevent flickering.
        if (scrollDifference > 5) {
          setIsNavbarVisible(false);
        } else if (scrollDifference < -5) {
          setIsNavbarVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  // Projects destination depends on authentication.
  const projectsHref = isAuthenticated ? "/projects" : "/#projects-preview";

  const links = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/#about" },
    { label: "Projects", href: projectsHref },
  ];

  const navLinkClass =
    "text-sm font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-emerald-300";

  const buttonClass =
    "rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110";

  // Display different controls for guests and signed-in users.
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

  // Preserve the existing theme toggle.
  function renderThemeButton() {
    return <ThemeToggle />;
  }

  return (
    <nav
      aria-label="Main navigation"
      className={[
        "relative w-full border-b",
        "shadow-lg shadow-black/5 dark:shadow-black/10",
        "transition-[transform,background-color,border-color,box-shadow]",
        "duration-300 ease-in-out",

        // Hide when scrolling down.
        isNavbarVisible || isMenuOpen ? "translate-y-0" : "-translate-y-full",

        // Fully opaque at the top or while the mobile menu is open.
        !isScrolled || isMenuOpen
          ? "border-slate-200 bg-white dark:border-white/10 dark:bg-[#080d1e]"
          : [
              // Semi-transparent when returning on scroll up.
              "border-slate-200/70 bg-white/80 backdrop-blur-xl",
              "dark:border-white/10 dark:bg-[#080d1e]/80",

              // Become opaque on hover or keyboard focus.
              "hover:bg-white focus-within:bg-white",
              "dark:hover:bg-[#080d1e]",
              "dark:focus-within:bg-[#080d1e]",
            ].join(" "),
      ].join(" ")}
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        {/* Website logo */}
        <Link
          href="/"
          aria-label="961-Dev Home"
          className="shrink-0"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Light mode logo */}
          <Image
            src="/logo.png"
            alt="961-Dev Logo"
            width={180}
            height={60}
            className="h-auto w-[135px] dark:hidden lg:w-[160px]"
            priority
          />

          {/* Dark mode logo */}
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
                pathname === link.href && !link.href.includes("#")
                  ? "page"
                  : undefined
              }
              className={navLinkClass}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop authentication and theme controls */}
        <div className="hidden items-center gap-4 lg:flex">
          {renderAuthButtons()}
          {renderThemeButton()}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="rounded-xl border border-slate-300 bg-slate-100 p-2 text-2xl text-slate-800 transition hover:bg-slate-200 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5 lg:hidden"
          onClick={() => setIsMenuOpen((previous) => !previous)}
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
                aria-current={
                  pathname === link.href && !link.href.includes("#")
                    ? "page"
                    : undefined
                }
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
