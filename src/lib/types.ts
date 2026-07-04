import type { ActivityType } from "./constants";

export interface ActivityDTO {
  id: number;
  type: ActivityType;
  title: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  duration: number;
  notes: string;
  reminder: boolean;
  completed: boolean;
  moodBefore: number | null;
  moodAfter: number | null;
  createdAt: string;
}

export interface PreferencesDTO {
  id: number;
  name: string;
  goals: string[];
  activities: string[];
  onboarded: boolean;
}

export interface MoodDTO {
  id: number;
  mood: number;
  note: string;
  createdAt: string;
}
