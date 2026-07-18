"use client";

import { LucideIcon, Loader2 } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function ActionCard({
  icon: Icon,
  title,
  onClick,
  disabled = false,
  loading = false,
}: ActionCardProps) {
  const isInactive = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isInactive}
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-6 text-center transition hover:border-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
        {loading ? <Loader2 size={22} className="animate-spin" /> : <Icon size={22} />}
      </span>
      <span className="text-sm font-medium text-text-primary">{title}</span>
    </button>
  );
}