"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Video, CalendarPlus, Users } from "lucide-react";
import ActionCard from "@/components/ActionCard";
import MeetingList from "@/components/MeetingList";
import { Meeting } from "@/types";
import {
  getUpcomingMeetings,
  getRecentMeetings,
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUpcomingMeetings()
      .then(setUpcomingMeetings)
      .catch(() => setError("Couldn't load upcoming meetings."))
      .finally(() => setUpcomingLoading(false));

    getRecentMeetings()
      .then(setRecentMeetings)
      .catch(() => setError("Couldn't load recent meetings."))
      .finally(() => setRecentLoading(false));
  }, []);

  function goToMeetingRoom(meeting: Meeting) {
    router.push(`/meeting/${meeting.meeting_code}`);
  }

  function handleNewMeeting() {
    router.push("/new-meeting");
  }

  function handleScheduleMeeting() {
    router.push("/schedule");
  }

  function handleJoinMeeting() {
    router.push("/join");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-text-primary">
        Welcome back 👋
      </h1>
      <p className="mt-1 text-text-secondary">
        Start, schedule, or join a meeting in seconds.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ActionCard icon={Video} title="New Meeting" onClick={handleNewMeeting} />
        <ActionCard icon={Users} title="Join Meeting" onClick={handleJoinMeeting} />
        <ActionCard
          icon={CalendarPlus}
          title="Schedule Meeting"
          onClick={handleScheduleMeeting}
        />
      </div>

      <section id="upcoming-meetings" className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary">
          Upcoming Meetings
        </h2>
        <div className="mt-4">
          <MeetingList
            meetings={upcomingMeetings}
            loading={upcomingLoading}
            emptyMessage="No upcoming meetings. Schedule one to see it here."
            onMeetingClick={goToMeetingRoom}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary">
          Recent Meetings
        </h2>
        <div className="mt-4">
          <MeetingList
            meetings={recentMeetings}
            loading={recentLoading}
            emptyMessage="No recent meetings yet."
            onMeetingClick={goToMeetingRoom}
          />
        </div>
      </section>
    </main>
  );
}