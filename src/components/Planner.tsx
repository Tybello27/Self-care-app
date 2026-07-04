"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ACTIVITY_TYPES } from "@/lib/constants";
import {
  monthMatrix,
  toISO,
  todayISO,
  prettyDate,
  parseISO,
} from "@/lib/utils";
import ActivityCard from "./ActivityCard";
import type { ActivityDTO } from "@/lib/types";

const WD = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Planner({
  onAddForDate,
  onBegin,
  onComplete,
  onEdit,
}: {
  onAddForDate: (date: string) => void;
  onBegin: (a: ActivityDTO) => void;
  onComplete: (a: ActivityDTO) => void;
  onEdit: (a: ActivityDTO) => void;
}) {
  const { activities } = useStore();
  const now = new Date();
  const [cursor, setCursor] = useState({
    y: now.getFullYear(),
    m: now.getMonth(),
  });
  const [selected, setSelected] = useState(todayISO());

  const byDate = useMemo(() => {
    const map: Record<string, ActivityDTO[]> = {};
    for (const a of activities) {
      (map[a.date] ??= []).push(a);
    }
    return map;
  }, [activities]);

  const weeks = useMemo(() => monthMatrix(cursor.y, cursor.m), [cursor]);
  const selList = (byDate[selected] ?? []).sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  const shift = (d: number) => {
    let m = cursor.m + d;
    let y = cursor.y;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setCursor({ y, m });
  };

  return (
    <div className="px-5 pb-32 pt-8">
      <header className="mb-5">
        <h1 className="font-display text-4xl text-[#4a3f55]">Your Planner</h1>
        <p className="mt-1 text-sm text-[#7c6f8a]">
          Weave gentle rituals into your days.
        </p>
      </header>

      <div className="glass rounded-3xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => shift(-1)}
            className="press grid h-9 w-9 place-items-center rounded-full bg-white/70 text-[#8a7c99]"
          >
            ‹
          </button>
          <h2 className="font-display text-xl text-[#4a3f55]">
            {MONTHS[cursor.m]} {cursor.y}
          </h2>
          <button
            onClick={() => shift(1)}
            className="press grid h-9 w-9 place-items-center rounded-full bg-white/70 text-[#8a7c99]"
          >
            ›
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 text-center">
          {WD.map((d, i) => (
            <span
              key={i}
              className="text-[11px] font-bold uppercase text-[#b6aac2]"
            >
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((d) => {
            const iso = toISO(d);
            const inMonth = d.getMonth() === cursor.m;
            const isToday = iso === todayISO();
            const isSel = iso === selected;
            const list = byDate[iso] ?? [];
            return (
              <button
                key={iso}
                onClick={() => setSelected(iso)}
                className={`press relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-all ${
                  isSel
                    ? "bg-gradient-to-br from-violet-500 to-pink-500 font-bold text-white shadow-md"
                    : isToday
                      ? "bg-white/80 font-bold text-violet-500"
                      : inMonth
                        ? "text-[#5c4f6b] hover:bg-white/50"
                        : "text-[#cbc1d8]"
                }`}
              >
                {d.getDate()}
                {list.length > 0 && (
                  <span className="mt-0.5 flex gap-0.5">
                    {list.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className={`h-1 w-1 rounded-full ${
                          isSel
                            ? "bg-white"
                            : `bg-gradient-to-r ${ACTIVITY_TYPES[a.type].gradient}`
                        }`}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="font-bold text-[#4a3f55]">
          {prettyDate(selected)}
          <span className="ml-2 text-sm font-medium text-[#a99cb8]">
            {parseISO(selected).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </h3>
        <button
          onClick={() => onAddForDate(selected)}
          className="press rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-1.5 text-sm font-bold text-white shadow-sm"
        >
          + Ritual
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {selList.length === 0 ? (
          <div className="glass rounded-3xl py-8 text-center">
            <p className="text-3xl">🌙</p>
            <p className="mt-2 text-sm font-semibold text-[#6b5b7e]">
              Nothing planned yet
            </p>
            <p className="text-xs text-[#a99cb8]">Add a moment of calm.</p>
          </div>
        ) : (
          selList.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              onBegin={onBegin}
              onComplete={onComplete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
