"use client";

type ThemeToggleProps = {
  showLabel?: boolean;
};

export default function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  // Use the same theme preference as the Navbar.
  function toggleTheme() {
    const html = document.documentElement;

    const nextIsDark = !html.classList.contains("dark");

    html.classList.toggle("dark", nextIsDark);

    localStorage.setItem("961dev-theme", nextIsDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark and light mode"
      title="Toggle dark and light mode"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-cyan-400/50 dark:hover:bg-white/10"
    >
      <span aria-hidden="true" className="text-lg">
        <span className="hidden dark:inline">☀</span>
        <span className="dark:hidden">☾</span>
      </span>

      {showLabel && <span>Appearance</span>}
    </button>
  );
}
