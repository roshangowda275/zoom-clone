import Link from "next/link";
import { Home, Video, Users } from "lucide-react";

export default function Sidebar() {
  return (
    <>
      {/* Tablet & desktop: left rail, hidden below the sm breakpoint */}
      <aside className="sticky top-0 hidden h-screen w-20 flex-shrink-0 flex-col items-center gap-1 border-r border-border bg-white py-6 sm:flex">
        <Link
          href="/"
          aria-label="Home"
          className="flex w-16 flex-col items-center gap-1 rounded-lg py-3 text-text-secondary transition hover:bg-background hover:text-primary"
        >
          <Home size={20} />
          <span className="text-[11px] font-medium">Home</span>
        </Link>
        <Link
          href="/#upcoming-meetings"
          aria-label="Meetings"
          className="flex w-16 flex-col items-center gap-1 rounded-lg py-3 text-text-secondary transition hover:bg-background hover:text-primary"
        >
          <Video size={20} />
          <span className="text-[11px] font-medium">Meetings</span>
        </Link>
        <button
          aria-label="Contacts"
          className="flex w-16 flex-col items-center gap-1 rounded-lg py-3 text-text-secondary transition hover:bg-background hover:text-primary"
        >
          <Users size={20} />
          <span className="text-[11px] font-medium">Contacts</span>
        </button>
      </aside>

      {/* Mobile: fixed bottom tab bar, hidden at sm and above */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-border bg-white py-2 sm:hidden">
        <Link
          href="/"
          aria-label="Home"
          className="flex flex-col items-center gap-1 px-4 py-1 text-text-secondary transition hover:text-primary"
        >
          <Home size={20} />
          <span className="text-[11px] font-medium">Home</span>
        </Link>
        <Link
          href="/#upcoming-meetings"
          aria-label="Meetings"
          className="flex flex-col items-center gap-1 px-4 py-1 text-text-secondary transition hover:text-primary"
        >
          <Video size={20} />
          <span className="text-[11px] font-medium">Meetings</span>
        </Link>
        <button
          aria-label="Contacts"
          className="flex flex-col items-center gap-1 px-4 py-1 text-text-secondary transition hover:text-primary"
        >
          <Users size={20} />
          <span className="text-[11px] font-medium">Contacts</span>
        </button>
      </nav>
    </>
  );
}