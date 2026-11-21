
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="w-full border-b border-border bg-surface transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
    </header>
  );
}
