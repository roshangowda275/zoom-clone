export interface Meeting {
  id: number;
  meeting_code: string;
  title: string;
  description: string | null;
  host_name: string;
  meeting_type: "instant" | "scheduled";
  scheduled_time: string | null;
  duration_minutes: number | null;
  created_at: string;
}

export interface Participant {
  id: number;
  meeting_id: number;
  display_name: string;
  joined_at: string;
}