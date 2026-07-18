"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, Check, Calendar, Clock } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getMeetingByCode } from "@/lib/api";
import { Meeting } from "@/types";

function formatDateTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MeetingRoomPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [hasLeft, setHasLeft] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    getMeetingByCode(code)
      .then(setMeeting)
      .catch(() =>
        setError(
          "We couldn't find that meeting. It may have ended or the code is incorrect."
        )
      )
      .finally(() => setLoading(false));
  }, [code]);

  async function handleCopyCode() {
    if (!meeting) return;
    try {
      await navigator.clipboard.writeText(meeting.meeting_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Couldn't copy — please copy the code manually.");
      setTimeout(() => setCopyError(null), 2000);
    }
  }

  async function handleCopyLink() {
    if (!meeting) return;
    const inviteLink = `${window.location.origin}/meeting/${meeting.meeting_code}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setCopyError("Couldn't copy — please copy the link manually.");
      setTimeout(() => setCopyError(null), 2000);
    }
  }

  if (hasLeft) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">
          Meeting Ended
        </h1>
        <p className="mt-2 text-text-secondary">
          You have left the meeting. Thanks for using Zoom Clone.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <LoadingSpinner message="Loading meeting..." />
      </main>
    );
  }

  if (error || !meeting) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 text-center">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error ?? "Something went wrong."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">
          {meeting.title}
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
          <span>Code: {meeting.meeting_code}</span>
          {meeting.scheduled_time && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDateTime(meeting.scheduled_time)}
            </span>
          )}
          {meeting.duration_minutes && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {meeting.duration_minutes} min
            </span>
          )}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-white p-6">
        <dl className="flex flex-col gap-4">
          <div>
            <dt className="text-xs font-medium uppercase text-text-secondary">
              Meeting Title
            </dt>
            <dd className="mt-1 text-sm text-text-primary">{meeting.title}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-text-secondary">
              Meeting Code
            </dt>
            <dd className="mt-1 text-sm text-text-primary">
              {meeting.meeting_code}
            </dd>
          </div>
          {origin && (
            <div>
              <dt className="text-xs font-medium uppercase text-text-secondary">
                Invite Link
              </dt>
              <dd className="mt-1 truncate text-sm text-text-primary">
                {origin}/meeting/{meeting.meeting_code}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-medium uppercase text-text-secondary">
              Created
            </dt>
            <dd className="mt-1 text-sm text-text-primary">
              {formatDateTime(meeting.created_at)}
            </dd>
          </div>
          {meeting.scheduled_time && (
            <div>
              <dt className="text-xs font-medium uppercase text-text-secondary">
                Scheduled Time
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {formatDateTime(meeting.scheduled_time)}
              </dd>
            </div>
          )}
          {meeting.duration_minutes && (
            <div>
              <dt className="text-xs font-medium uppercase text-text-secondary">
                Duration
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {meeting.duration_minutes} minutes
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={handleCopyCode}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:border-primary"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <button
              onClick={handleCopyLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:border-primary"
            >
              {linkCopied ? <Check size={16} /> : <Copy size={16} />}
              {linkCopied ? "Copied!" : "Copy Invite Link"}
            </button>
          </div>
          <button
            onClick={() => setHasLeft(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            Leave Meeting
          </button>
        </div>
        {copyError && (
          <p className="mt-3 text-sm text-red-600">{copyError}</p>
        )}
      </div>
    </main>
  );
}