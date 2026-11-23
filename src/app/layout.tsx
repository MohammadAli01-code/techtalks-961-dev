import type { Metadata } from "next";

// Google fonts used across 961-Dev.
import { Geist, Geist_Mono } from "next/font/google";

// Global website styling.
import "./globals.css";

// Shared layout components.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Shared authentication popup.
import { AuthModalProvider } from "@/components/auth/AuthModalContext";

// Restore the user's saved appearance preference.
import ThemeInitializer from "@/components/theme/ThemeInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "961-Dev",
  description: "Guided projects for aspiring developers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        {/* Apply the saved light/dark theme. */}
        <ThemeInitializer />

        {/* Make Login/Register modal available site-wide. */}
        <AuthModalProvider>
          {/* Shared navigation */}
          <Header />

          {/* Current page content */}
          <main className="w-full flex-1">{children}</main>

          {/* Shared footer */}
          <Footer />
        </AuthModalProvider>
      </body>
    </html>
  );
}
