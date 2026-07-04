"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { todayISO, formatTime } from "@/lib/utils";
import type { ActivityDTO } from "@/lib/types";

const LINES = [
  "Your self-care session starts in {m} mins ✨",
  "Time to relax 🌙 — {t} is coming up",
  "A gentle nudge: {t} in {m} mins 💗",
  "Pause soon for {t} 🌸",
];

function line(a: ActivityDTO, mins: number) {
  const t = ACTIVITY_TYPES[a.type].label.toLowerCase();
  const l = LINES[a.id % LINES.length];
  return l.replace("{m}", String(mins)).replace("{t}", t);
}

export default function Reminders() {
  const { activities } = useStore();
  const notified = useRef<Set<number>>(new Set());
  const [toast, setToast] = useState<{ a: ActivityDTO; text: string } | null>(
    null,
  );

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = todayISO();
      for (const a of activities) {
        if (!a.reminder || a.completed || a.date !== today) continue;
        if (notified.current.has(a.id)) continue;
        const [h, m] = a.time.split(":").map(Number);
        const start = new Date();
        start.setHours(h, m, 0, 0);
        const diffMin = Math.round((start.getTime() - now.getTime()) / 60000);
        if (diffMin <= 30 && diffMin >= -2) {
          notified.current.add(a.id);
          const text = line(a, Math.max(0, diffMin));
          setToast({ a, text });
          setTimeout(() => setToast(null), 7000);
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification("Treat Yourself 🌸", {
                body: text,
                icon: "/icons/icon-192.png",
                badge: "/icons/icon-192.png",
              });
            } catch {
              /* ignore */
            }
          }
        }
      }
    };
    check();
    const id = setInterval(check, 20000);
    return () => clearInterval(id);
  }, [activities]);

  if (!toast) return null;
  const meta = ACTIVITY_TYPES[toast.a.type];

  return (
    <div className="fixed inset-x-0 top-0 z-[60] mx-auto flex max-w-md justify-center px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="animate-fade-up glass-strong flex w-full items-center gap-3 rounded-2xl p-3 shadow-xl">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient} text-xl animate-breathe`}
        >
          {meta.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#4a3f55]">{toast.text}</p>
          <p className="text-xs text-[#a99cb8]">
            {toast.a.title} · {formatTime(toast.a.time)}
          </p>
        </div>
        <button
          onClick={() => setToast(null)}
          className="press grid h-7 w-7 place-items-center rounded-full bg-white/70 text-[#8a7c99]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
