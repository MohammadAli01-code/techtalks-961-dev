
// Reusable Footer component shared across all pages.
export default function Footer() {
  // Automatically display the current year.
  const currentYear = new Date().getFullYear();

  return (
    // Footer stays below the main page content.
    <footer className="w-full border-t border-gray-200 bg-white">

      {/* Responsive centered container. */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">

        {/* Website name using our brand colors. */}
        <p className="text-sm font-semibold">
          <span className="text-primary">961</span>
          <span className="text-black">-Dev</span>
        </p>

        {/* Copyright text with automatically updated year. */}
        <p className="text-center text-sm text-gray-500">
          © {currentYear} 961-Dev. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
