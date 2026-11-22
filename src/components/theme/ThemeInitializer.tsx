"use client";

import { useEffect } from "react";

// Restore the user's saved theme after the app mounts.
export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("961-dev-theme");

      // Dark mode is our default theme.
      const theme = savedTheme === "light" ? "light" : "dark";

      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
    } catch {
      // If storage is unavailable, keep dark mode.
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // This component only initializes the theme.
  return null;
}
