"use client";

import { MOODS } from "@/lib/constants";

export default function MoodPicker({
  value,
  onChange,
  size = "md",
}: {
  value: number | null;
  onChange: (v: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-2xl w-11 h-11",
    md: "text-3xl w-14 h-14",
    lg: "text-4xl w-16 h-16",
  }[size];

  return (
    <div className="flex items-center justify-between gap-1.5">
      {MOODS.map((m) => {
        const active = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={`press flex flex-col items-center gap-1 rounded-2xl transition-all ${
              active ? "scale-110" : "opacity-55 hover:opacity-90"
            }`}
          >
            <span
              className={`grid place-items-center rounded-full ${sizes} ${
                active
                  ? "bg-white shadow-md ring-2 ring-pink-200"
                  : "bg-white/40"
              }`}
            >
              {m.emoji}
            </span>
            <span
              className={`text-[10px] font-semibold ${
                active ? "text-[#6b5b7e]" : "text-[#a99cb8]"
              }`}
            >
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
