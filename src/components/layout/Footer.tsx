
import Link from "next/link";

// Shared footer displayed across the website.
export default function Footer() {
  // Automatically update the copyright year.
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-[#f8fafc] text-slate-900 transition-colors duration-300 dark:border-cyan-400/10 dark:bg-[#080d1e] dark:text-white">
      {/* Soft decorative lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-14 lg:px-8">
        <div className="grid gap-10 border-b border-slate-200 pb-12 dark:border-slate-700/50 md:grid-cols-2">
          {/* Brand information */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-2xl font-extrabold tracking-tight"
            >
              <span className="text-[#0066FF]">961</span>
              <span className="text-slate-900 dark:text-white">
                -Dev
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
              Transform programming knowledge into practical
              skills through guided projects, step-by-step
              missions, and hands-on learning.
            </p>

            <p className="mt-5 font-mono text-sm font-semibold text-cyan-700 dark:text-cyan-300">
              Learn. Build. Grow.
            </p>
          </div>

          {/* Quick navigation links */}
          <div className="md:justify-self-center">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
              >
                Home
              </Link>

              <Link
                href="/#about"
                className="text-sm text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
              >
                About Us
              </Link>

              <Link
                href="/#projects-preview"
                className="text-sm text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright area */}
        <div className="flex flex-col items-center justify-between gap-3 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {currentYear} 961-Dev. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
