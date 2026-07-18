"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createInstantMeeting } from "@/lib/api";

export default function NewMeetingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createInstantMeeting()
      .then((meeting) => {
        router.push(`/meeting/${meeting.meeting_code}`);
      })
      .catch(() => {
        setError("Couldn't start a new meeting. Please try again.");
      });
  }, [router]);

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 text-center">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
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
      <LoadingSpinner message="Setting up your meeting..." />
    </main>
  );
}