
"use client";

import { useSyncExternalStore } from "react";

// Watch for changes to the theme class.
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}

// Read the current theme from the HTML element.
function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

// Use a neutral state during server rendering.
function getServerThemeSnapshot(): null {
  return null;
}

export default function ThemeToggle() {
  // Read the theme without setting state inside useEffect.
  const isDark = useSyncExternalStore<boolean | null>(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  function toggleTheme() {
    // Prevent toggling before the theme is available.
    if (isDark === null) return;

    const nextIsDark = !isDark;

    // Update the theme classes.
    document.documentElement.classList.toggle(
      "dark",
      nextIsDark
    );

    document.documentElement.classList.toggle(
      "light",
      !nextIsDark
    );

    // Save the selected theme.
    localStorage.setItem(
      "961-dev-theme",
      nextIsDark ? "dark" : "light"
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isDark === null}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={isDark ? "Light mode" : "Dark mode"}
      className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground transition-colors hover:border-primary disabled:opacity-50"
    >
      <span aria-hidden="true">
        {isDark === null ? "◐" : isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
