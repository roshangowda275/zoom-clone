import { API_BASE_URL } from "./config";
import { Meeting } from "../types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.detail || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function createInstantMeeting(): Promise<Meeting> {
  return request<Meeting>(`${API_BASE_URL}/meetings/instant`, {
    method: "POST",
  });
}

export async function scheduleMeeting(data: {
  title: string;
  description?: string;
  scheduled_time: string;
  duration_minutes: number;
}): Promise<Meeting> {
  return request<Meeting>(`${API_BASE_URL}/meetings/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getUpcomingMeetings(): Promise<Meeting[]> {
  return request<Meeting[]>(`${API_BASE_URL}/meetings/upcoming`);
}

export async function getRecentMeetings(): Promise<Meeting[]> {
  return request<Meeting[]>(`${API_BASE_URL}/meetings/recent`);
}

export async function getMeetingByCode(meetingCode: string): Promise<Meeting> {
  return request<Meeting>(`${API_BASE_URL}/meetings/${meetingCode}`);
}

export async function joinMeeting(
  meetingCode: string,
  displayName: string
): Promise<Meeting> {
  return request<Meeting>(`${API_BASE_URL}/meetings/join/${meetingCode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ display_name: displayName }),
  });
}