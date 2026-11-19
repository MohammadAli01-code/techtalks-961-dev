
// Import the reusable Navbar component.
import Navbar from "./Navbar";

// Header is shared across all website pages.
export default function Header() {
  return (
    // Header provides spacing, background, and bottom border.
    <header className="w-full border-b border-gray-200 bg-white">

      {/* Container keeps content centered on large screens. */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

        {/* Display the desktop and mobile navigation. */}
        <Navbar />

      </div>
    </header>
  );
}
