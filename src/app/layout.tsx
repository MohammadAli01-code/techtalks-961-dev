
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
export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    // Main HTML document with English as the default language.
    // Apply font variables and text smoothing.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      
{/* Flex column keeps the footer below the page content. */}
<body className="flex min-h-screen flex-col">

  {/* Shared responsive website header. */}
  <Header />

  {/* Main content changes depending on the current page. */}
  <main className="w-full flex-1">
    {children}
  </main>

  {/* Shared website footer. */}
  <Footer />

</body>

      
    </html>
  );
}
