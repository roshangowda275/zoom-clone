"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { scheduleMeeting } from "@/lib/api";

interface FormErrors {
  title?: string;
  scheduledTime?: string;
  duration?: string;
}

export default function SchedulePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Meeting title is required.";
    }
    if (!scheduledTime) {
      newErrors.scheduledTime = "Date and time are required.";
    }
    if (duration < 15) {
      newErrors.duration = "Duration must be at least 15 minutes.";
    }

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const meeting = await scheduleMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        scheduled_time: new Date(scheduledTime).toISOString(),
        duration_minutes: duration,
      });
      router.push(`/meeting/${meeting.meeting_code}`);
    } catch {
      setSubmitError("Couldn't schedule the meeting. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-text-primary">
        Schedule Meeting
      </h1>
      <p className="mt-1 text-text-secondary">
        Set a title, pick a date and time, and we&apos;ll generate a
        shareable link.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-white p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Meeting Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Sync"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Description{" "}
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this meeting about?"
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />
            {errors.scheduledTime && (
              <p className="mt-1 text-sm text-red-600">
                {errors.scheduledTime}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
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
              {submitting ? "Scheduling..." : "Schedule Meeting"}
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