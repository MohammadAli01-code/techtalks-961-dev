
"use client";

// useState manages whether the mobile menu is open or closed.
import { useState } from "react";

// Link allows navigation between Next.js pages.
import Link from "next/link";

// Next.js Image optimizes images for website performance.
import Image from "next/image";

// Reusable navigation component for desktop and mobile.
export default function Navbar() {
  // Initially, the mobile menu is closed.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="w-full"
    >
      {/* Main navigation container. */}
      <div className="flex items-center justify-between">

        
{/* Clicking the logo redirects users to the homepage. */}
<Link
  href="/"
  aria-label="961-Dev Home"
  className="flex items-center"
>
  {/* Display the official 961-Dev logo from the public folder. */}
  <Image
    src="/logo.png"
    alt="961-Dev Logo"
    width={180}
    height={60}
    className="h-auto w-[150px] sm:w-[180px]"
    priority
  />
</Link>


        {/* Desktop navigation: visible on medium screens and larger. */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-primary"
          >
            Home
          </Link>
        </div>

        {/* Mobile menu button: hidden on desktop. */}
        <button
          type="button"
          className="rounded-md p-2 text-black md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {/* Show X when open and menu icon when closed. */}
          <span className="text-2xl">
            {isMenuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile navigation: displayed only when menu is open. */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="mt-4 border-t border-gray-200 pt-4 md:hidden"
        >
          <Link
            href="/"
            className="block py-2 text-sm font-medium text-gray-700 hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </div>
      )}
    </nav>
  );
}
