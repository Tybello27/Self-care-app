"use client";

import { useState } from "react";
import Sheet from "./Sheet";
import MoodPicker from "./MoodPicker";
import { ACTIVITY_TYPES, moodMeta } from "@/lib/constants";
import { useStore } from "@/lib/store";
import type { ActivityDTO } from "@/lib/types";

export default function MoodFlow({
  activity,
  phase,
  onClose,
}: {
  activity: ActivityDTO | null;
  phase: "before" | "after";
  onClose: () => void;
}) {
  const { updateActivity } = useStore();
  const [mood, setMood] = useState<number | null>(null);
  const [result, setResult] = useState<{ before: number; after: number } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  if (!activity) return null;
  const meta = ACTIVITY_TYPES[activity.type];

  const save = async () => {
    if (mood == null) return;
    setBusy(true);
    if (phase === "before") {
      await updateActivity(activity.id, { moodBefore: mood });
      setBusy(false);
      onClose();
    } else {
      await updateActivity(activity.id, { moodAfter: mood, completed: true });
      setBusy(false);
      setResult({ before: activity.moodBefore ?? mood, after: mood });
    }
  };

  if (result) {
    const delta = result.after - result.before;
    const b = moodMeta(result.before);
    const a = moodMeta(result.after);
    return (
      <Sheet open onClose={onClose}>
        <div className="animate-pop py-4 text-center">
          <div className="mb-3 text-6xl">
            {delta > 0 ? "🌷" : delta === 0 ? "🕊️" : "💗"}
          </div>
          <h3 className="font-display text-3xl text-[#4a3f55]">
            {delta > 0
              ? "Look at you glow!"
              : delta === 0
                ? "A gentle, steady moment"
                : "You showed up for you"}
          </h3>
          <p className="mt-2 px-4 text-sm text-[#7c6f8a]">
            {delta > 0
              ? `Your ${meta.label.toLowerCase()} lifted your mood. That matters.`
              : "Every moment of care counts, even the quiet ones."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-4xl">{b?.emoji}</div>
              <div className="mt-1 text-xs font-semibold text-[#a99cb8]">
                Before
              </div>
            </div>
            <div className="text-2xl text-pink-400">→</div>
            <div className="text-center">
              <div className="text-4xl">{a?.emoji}</div>
              <div className="mt-1 text-xs font-semibold text-[#a99cb8]">
                After
              </div>
            </div>
          </div>
          {delta !== 0 && (
            <div
              className={`mx-auto mt-5 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
                delta > 0
                  ? "bg-rose-100 text-rose-500"
                  : "bg-violet-100 text-violet-500"
              }`}
            >
              {delta > 0 ? `+${delta} mood ${delta > 1 ? "levels" : "level"}` : "Be gentle with yourself"}
            </div>
          )}
          <button
            onClick={onClose}
            className="press mt-7 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg shadow-pink-200"
          >
            Beautiful ✨
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet open onClose={onClose}>
      <div className="py-2 text-center">
        <div
          className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-3xl shadow-md`}
        >
          {meta.emoji}
        </div>
        <h3 className="mt-4 font-display text-3xl text-[#4a3f55]">
          {phase === "before" ? "How do you feel?" : "How do you feel now?"}
        </h3>
        <p className="mt-1 text-sm text-[#7c6f8a]">
          {phase === "before"
            ? `Before your ${meta.label.toLowerCase()}`
            : `After your ${meta.label.toLowerCase()}`}
        </p>
        <div className="mt-7">
          <MoodPicker value={mood} onChange={setMood} size="md" />
        </div>
        <button
          onClick={save}
          disabled={mood == null || busy}
          className="press mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg shadow-pink-200 disabled:opacity-40"
        >
          {phase === "before" ? "Begin ritual" : "Complete ritual"}
        </button>
      </div>
    </Sheet>
  );
}
