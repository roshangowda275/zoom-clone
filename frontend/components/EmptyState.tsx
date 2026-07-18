"use client";

import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message: string;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ message, title, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-white p-8 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg text-text-secondary">
        <Inbox size={18} />
      </span>
      {title && <p className="text-sm font-medium text-text-primary">{title}</p>}
      <p className="text-sm text-text-secondary">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}