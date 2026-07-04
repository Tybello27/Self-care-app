export type ActivityType =
  | "journaling"
  | "spa"
  | "skincare"
  | "rest"
  | "meditation"
  | "reading"
  | "walk"
  | "music";

export interface ActivityMeta {
  type: ActivityType;
  label: string;
  emoji: string;
  gradient: string; // tailwind gradient classes
  soft: string; // soft bg
  ring: string;
  blurb: string;
  defaultDuration: number;
}

export const ACTIVITY_TYPES: Record<ActivityType, ActivityMeta> = {
  journaling: {
    type: "journaling",
    label: "Journaling",
    emoji: "📓",
    gradient: "from-violet-400 to-purple-500",
    soft: "bg-violet-50",
    ring: "ring-violet-200",
    blurb: "Pour your thoughts onto the page.",
    defaultDuration: 20,
  },
  spa: {
    type: "spa",
    label: "Spa Day",
    emoji: "🛁",
    gradient: "from-pink-400 to-rose-400",
    soft: "bg-rose-50",
    ring: "ring-rose-200",
    blurb: "A little luxury, just for you.",
    defaultDuration: 60,
  },
  skincare: {
    type: "skincare",
    label: "Skincare Night",
    emoji: "🧴",
    gradient: "from-fuchsia-400 to-pink-400",
    soft: "bg-fuchsia-50",
    ring: "ring-fuchsia-200",
    blurb: "Glow from the inside out.",
    defaultDuration: 25,
  },
  rest: {
    type: "rest",
    label: "Rest Day",
    emoji: "🌙",
    gradient: "from-indigo-400 to-violet-400",
    soft: "bg-indigo-50",
    ring: "ring-indigo-200",
    blurb: "You deserve deep, gentle rest.",
    defaultDuration: 90,
  },
  meditation: {
    type: "meditation",
    label: "Meditation",
    emoji: "🧘‍♀️",
    gradient: "from-teal-300 to-emerald-400",
    soft: "bg-emerald-50",
    ring: "ring-emerald-200",
    blurb: "Breathe in calm, breathe out tension.",
    defaultDuration: 15,
  },
  reading: {
    type: "reading",
    label: "Reading",
    emoji: "📖",
    gradient: "from-amber-300 to-orange-400",
    soft: "bg-amber-50",
    ring: "ring-amber-200",
    blurb: "Escape into another world.",
    defaultDuration: 30,
  },
  walk: {
    type: "walk",
    label: "Walk",
    emoji: "🌿",
    gradient: "from-lime-300 to-green-400",
    soft: "bg-lime-50",
    ring: "ring-lime-200",
    blurb: "Fresh air clears the mind.",
    defaultDuration: 30,
  },
  music: {
    type: "music",
    label: "Music",
    emoji: "🎧",
    gradient: "from-sky-400 to-blue-400",
    soft: "bg-sky-50",
    ring: "ring-sky-200",
    blurb: "Let the melody hold you.",
    defaultDuration: 20,
  },
};

export const ACTIVITY_LIST = Object.values(ACTIVITY_TYPES);

export interface Goal {
  id: string;
  label: string;
  emoji: string;
}

export const GOALS: Goal[] = [
  { id: "stress", label: "Stress relief", emoji: "🌸" },
  { id: "sleep", label: "Better sleep", emoji: "😴" },
  { id: "burnout", label: "Avoid burnout", emoji: "🔥" },
  { id: "balance", label: "Emotional balance", emoji: "⚖️" },
];

export const MOODS = [
  { value: 1, emoji: "😢", label: "Low", color: "text-indigo-400" },
  { value: 2, emoji: "😕", label: "Meh", color: "text-violet-400" },
  { value: 3, emoji: "😐", label: "Okay", color: "text-purple-400" },
  { value: 4, emoji: "🙂", label: "Good", color: "text-pink-400" },
  { value: 5, emoji: "😊", label: "Great", color: "text-rose-400" },
];

export function moodMeta(value: number | null | undefined) {
  if (!value) return null;
  return MOODS.find((m) => m.value === value) ?? null;
}

export const AFFIRMATIONS = [
  "You deserve rest. 🌙",
  "Softness is a strength. 🌸",
  "One gentle step at a time. 🌿",
  "Your peace is a priority. ✨",
  "You are allowed to slow down. 🕊️",
  "Taking care of you is not selfish. 💗",
  "Breathe. You're doing beautifully. 🌼",
  "Small moments of care add up. 💫",
];

// Suggestions for the "I Need Care" flow based on how you feel now.
export const CARE_SUGGESTIONS: Record<number, ActivityType[]> = {
  1: ["rest", "journaling", "meditation"],
  2: ["walk", "journaling", "music"],
  3: ["meditation", "reading", "music"],
  4: ["skincare", "walk", "reading"],
  5: ["spa", "walk", "music"],
};

export const CARE_MESSAGE: Record<number, string> = {
  1: "It's okay to not be okay. Let's ease you gently.",
  2: "Let's lift the fog together, one small step.",
  3: "A little care can turn this around.",
  4: "You're doing well — let's keep the glow going.",
  5: "Wonderful! Let's celebrate this feeling.",
};
