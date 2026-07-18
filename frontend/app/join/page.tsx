"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinMeeting } from "@/lib/api";

// Accepts either a bare code ("rpu-yave-xxz") or a full invite link
// ("http://localhost:3000/meeting/rpu-yave-xxz") and returns just the code.
function extractMeetingCode(input: string): string {
  const match = input.match(/\/meeting\/([^/?#]+)/i);
  return match ? match[1] : input;
}

export default function JoinPage() {
  const router = useRouter();

  const [meetingCode, setMeetingCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<{ meetingCode?: string; displayName?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedCode = extractMeetingCode(meetingCode.trim());
    const trimmedName = displayName.trim();
    const newErrors: { meetingCode?: string; displayName?: string } = {};

    if (!trimmedCode) {
      newErrors.meetingCode = "Meeting code is required.";
    }
    if (!trimmedName) {
      newErrors.displayName = "Your name is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const meeting = await joinMeeting(trimmedCode, trimmedName);
      router.push(`/meeting/${meeting.meeting_code}`);
    } catch {
      setSubmitError("Couldn't join that meeting. Check the code and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-text-primary">
        Join Meeting
      </h1>
      <p className="mt-1 text-text-secondary">
        Enter the meeting code or paste the invite link to join the call.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-white p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={submitting}
              placeholder="e.g. Alex Chen"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-primary disabled:opacity-50"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Meeting Code or Invite Link
            </label>
            <input
              type="text"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              disabled={submitting}
              placeholder="e.g. abc-def-ghi or the full invite link"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-primary disabled:opacity-50"
            />
            {errors.meetingCode && (
              <p className="mt-1 text-sm text-red-600">{errors.meetingCode}</p>
            )}
          </div>

          {submitError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </p>
          )}

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Joining..." : "Join Meeting"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={submitting}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}