
import type { HTMLAttributes, ReactNode } from "react";

// Define the properties accepted by our Card component.
// Inherit standard HTML div properties for flexibility.
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// Reusable Card component for displaying grouped content.
export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  // Common card styles used across the website.
  const cardStyles =
    "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

  return (
    <div
      // Combine default card styles with optional custom styles.
      className={`${cardStyles} ${className}`}
      // Forward extra HTML properties to the card container.
      {...props}
    >
      {/* Display any content passed inside the Card. */}
      {children}
    </div>
  );
}
