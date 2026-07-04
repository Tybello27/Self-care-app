"use client";

import { useState } from "react";
import Sheet from "./Sheet";
import MoodPicker from "./MoodPicker";
import {
  CARE_SUGGESTIONS,
  CARE_MESSAGE,
  ACTIVITY_TYPES,
  type ActivityType,
} from "@/lib/constants";
import { useStore } from "@/lib/store";

export default function CareSheet({
  open,
  onClose,
  onPlan,
}: {
  open: boolean;
  onClose: () => void;
  onPlan: (type: ActivityType) => void;
}) {
  const { addMood } = useStore();
  const [mood, setMood] = useState<number | null>(null);
  const [breathing, setBreathing] = useState(false);

  const reset = () => {
    setMood(null);
    setBreathing(false);
    onClose();
  };

  const pick = async (v: number) => {
    setMood(v);
    await addMood(v, "I Need Care check-in");
  };

  if (!open) return null;

  if (breathing) {
    return (
      <Sheet open onClose={reset}>
        <div className="py-6 text-center">
          <h3 className="font-display text-3xl text-[#4a3f55]">Breathe with me</h3>
          <p className="mt-1 text-sm text-[#7c6f8a]">In… hold… out…</p>
          <div className="my-10 grid place-items-center">
            <div className="grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-pink-300 animate-breathe">
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white/50 text-sm font-bold text-[#6b5b7e]">
                breathe
              </div>
            </div>
          </div>
          <button
            onClick={reset}
            className="press w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 py-4 font-bold text-white shadow-lg shadow-pink-200"
          >
            I feel a little lighter 🕊️
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onClose={reset} title="I need care 🫂">
      {mood == null ? (
        <div className="py-2 text-center">
          <p className="mb-6 text-sm text-[#7c6f8a]">
            You&apos;re here, and that&apos;s enough. How are you feeling right
            now?
          </p>
          <MoodPicker value={mood} onChange={pick} size="md" />
        </div>
      ) : (
        <div className="animate-fade-up">
          <div className="rounded-3xl bg-gradient-to-br from-violet-100 to-pink-100 p-4 text-center">
            <p className="font-display text-xl text-[#4a3f55]">
              {CARE_MESSAGE[mood]}
            </p>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[#a99cb8]">
            Try one of these now
          </p>
          <div className="mt-3 space-y-3">
            {CARE_SUGGESTIONS[mood].map((t) => {
              const meta = ACTIVITY_TYPES[t];
              return (
                <button
                  key={t}
                  onClick={() => {
                    reset();
                    onPlan(t);
                  }}
                  className="press glass flex w-full items-center gap-3 rounded-2xl p-3 text-left"
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient} text-xl shadow-sm`}
                  >
                    {meta.emoji}
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold text-[#4a3f55]">
                      {meta.label}
                    </span>
                    <span className="block text-xs text-[#a99cb8]">
                      {meta.blurb}
                    </span>
                  </span>
                  <span className="text-violet-400">+</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setBreathing(true)}
            className="press mt-4 w-full rounded-2xl bg-white/70 py-3.5 text-sm font-bold text-violet-500"
          >
            🌬️ Take a breathing moment
          </button>
        </div>
      )}
    </Sheet>
  );
}
