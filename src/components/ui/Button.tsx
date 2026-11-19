
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Define the properties accepted by our Button component.
// We also inherit standard HTML button properties.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

// Reusable Button component.
// Primary is the default style when no variant is provided.
export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  // Common styles shared by all button variants.
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  // Different appearance depending on the selected variant.
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-blue-700",
    secondary:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  };

  return (
    <button
      // Use the supplied button type, defaulting to button.
      type={type}
      // Combine common styles, variant styles, and custom styles.
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      // Pass additional HTML properties such as disabled or onClick.
      {...props}
    >
      {/* Display the content placed inside the Button. */}
      {children}
    </button>
  );
}
