import ThemeInitializer from "@/components/theme/ThemeInitializer";
import type { Metadata } from "next";

// Import Google fonts provided by Next.js.
import { Geist, Geist_Mono } from "next/font/google";

// Import global styles applied throughout the website.
import "./globals.css";

// Import shared layout components.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Configure the main font used for website text.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure the monospace font used for code-related text.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define website metadata for the browser and search engines.
export const metadata: Metadata = {
  title: "961-Dev",
  description: "Guided projects for aspiring developers",
};

// RootLayout is shared across all pages of the website.
// children represents the content of the currently displayed page.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        {/* Restore the theme without an inline script. */}
        <ThemeInitializer />

        <Header />

        <main className="w-full flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
