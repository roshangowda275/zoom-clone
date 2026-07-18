"use client";

import { Calendar, Clock } from "lucide-react";
import { Meeting } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

interface MeetingListProps {
  meetings: Meeting[];
  loading: boolean;
  emptyMessage: string;
  onMeetingClick?: (meeting: Meeting) => void;
}

function formatMeetingDateTime(meeting: Meeting) {
  const rawDate = meeting.scheduled_time ?? meeting.created_at;
  const date = new Date(rawDate);
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dateLabel} · ${timeLabel}`;
}

export default function MeetingList({
  meetings,
  loading,
  emptyMessage,
  onMeetingClick,
}: MeetingListProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white">
        <LoadingSpinner message="Loading meetings…" />
      </div>
    );
  }

  if (meetings.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {meetings.map((meeting) => {
        const content = (
          <>
            <div>
              <p className="font-medium text-text-primary">{meeting.title}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                <Calendar size={14} />
                {formatMeetingDateTime(meeting)}
                {meeting.duration_minutes && (
                  <>
                    <span className="mx-1">·</span>
                    <Clock size={14} />
                    {meeting.duration_minutes} min
                  </>
                )}
              </p>
            </div>
            <span className="rounded-md bg-bg px-3 py-1 text-xs font-medium text-text-secondary">
              {meeting.meeting_code}
            </span>
          </>
        );

        if (onMeetingClick) {
          return (
            <button
              key={meeting.id}
              onClick={() => onMeetingClick(meeting)}
              className="animate-fade-in flex items-center justify-between rounded-xl border border-border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm"
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={meeting.id}
            className="animate-fade-in flex items-center justify-between rounded-xl border border-border bg-white p-4"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
