import { Settings, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold text-text-primary">
          Zoom Clone
        </span>

        <div className="flex items-center gap-3">
          <button
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition hover:bg-background"
          >
            <Settings size={18} />
          </button>
          <button
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-hover"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}