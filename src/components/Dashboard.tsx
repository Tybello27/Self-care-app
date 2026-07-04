"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { AFFIRMATIONS, moodMeta } from "@/lib/constants";
import { greeting, todayISO } from "@/lib/utils";
import MoodPicker from "./MoodPicker";
import ActivityCard from "./ActivityCard";
import type { ActivityDTO } from "@/lib/types";

export default function Dashboard({
  onAdd,
  onBegin,
  onComplete,
  onEdit,
  onCare,
}: {
  onAdd: () => void;
  onBegin: (a: ActivityDTO) => void;
  onComplete: (a: ActivityDTO) => void;
  onEdit: (a: ActivityDTO) => void;
  onCare: () => void;
}) {
  const { prefs, activities, moods, addMood } = useStore();
  const [checkMood, setCheckMood] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const today = todayISO();
  const todays = useMemo(
    () =>
      activities
        .filter((a) => a.date === today)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [activities, today],
  );

  const affirmation = useMemo(
    () => AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length],
    [],
  );

  const lastMood = moods[0] ? moodMeta(moods[0].mood) : null;
  const doneCount = todays.filter((a) => a.completed).length;

  const submitMood = async (v: number) => {
    setCheckMood(v);
    await addMood(v);
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div className="stagger space-y-5 px-5 pb-32 pt-8">
      {/* header */}
      <header>
        <p className="text-sm font-semibold text-[#a99cb8]">{greeting()},</p>
        <h1 className="font-display text-4xl leading-tight text-[#4a3f55]">
          {prefs?.name ?? "Rita"}{" "}
          <span className="inline-block animate-float">🌸</span>
        </h1>
        <p className="mt-1 text-sm text-[#7c6f8a]">
          {todays.length === 0
            ? "A clear day — a perfect time for a little care."
            : `You have ${todays.length} ritual${todays.length > 1 ? "s" : ""} planned · ${doneCount} done`}
        </p>
      </header>

      {/* affirmation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 p-5 text-white shadow-lg shadow-pink-200">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-lg" />
        <div className="absolute -bottom-6 -left-2 h-20 w-20 rounded-full bg-white/10 blur-lg animate-breathe" />
        <p className="text-xs font-bold uppercase tracking-widest text-white/80">
          A gentle reminder
        </p>
        <p className="mt-1 font-display text-2xl leading-snug">{affirmation}</p>
      </div>

      {/* mood check-in */}
      <section className="glass rounded-3xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-[#4a3f55]">Quick mood check-in</h2>
          {lastMood && (
            <span className="text-xs font-medium text-[#a99cb8]">
              last: {lastMood.emoji}
            </span>
          )}
        </div>
        {saved ? (
          <div className="animate-pop py-3 text-center">
            <p className="text-3xl">{moodMeta(checkMood!)?.emoji}</p>
            <p className="mt-1 text-sm font-semibold text-[#6b5b7e]">
              Thank you for checking in 💗
            </p>
          </div>
        ) : (
          <MoodPicker value={checkMood} onChange={submitMood} size="md" />
        )}
      </section>

      {/* I need care */}
      <button
        onClick={onCare}
        className="press flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-rose-400 to-pink-500 p-5 text-left text-white shadow-lg shadow-rose-200"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/25 text-2xl animate-breathe">
          🫂
        </span>
        <span className="flex-1">
          <span className="block font-display text-xl">I need care</span>
          <span className="block text-xs text-white/85">
            Feeling overwhelmed? Let&apos;s find you comfort now.
          </span>
        </span>
        <span className="text-xl">→</span>
      </button>

      {/* today's rituals */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[#4a3f55]">Today&apos;s self-care</h2>
          <button
            onClick={onAdd}
            className="press rounded-full bg-white/70 px-3 py-1 text-sm font-bold text-violet-500"
          >
            + Add
          </button>
        </div>

        {todays.length === 0 ? (
          <button
            onClick={onAdd}
            className="glass flex w-full flex-col items-center gap-2 rounded-3xl border border-dashed border-violet-200 py-8 text-center"
          >
            <span className="text-4xl">🌼</span>
            <span className="text-sm font-semibold text-[#6b5b7e]">
              Plan your first ritual today
            </span>
            <span className="text-xs text-[#a99cb8]">
              You deserve a moment for yourself
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            {todays.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                onBegin={onBegin}
                onComplete={onComplete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
