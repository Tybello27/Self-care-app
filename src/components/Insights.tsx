"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { ACTIVITY_TYPES, type ActivityType } from "@/lib/constants";
import { addDays, toISO } from "@/lib/utils";

export default function Insights() {
  const { activities, moods } = useStore();

  // Effectiveness per activity type (avg mood delta)
  const effectiveness = useMemo(() => {
    const agg: Record<string, { sum: number; n: number }> = {};
    for (const a of activities) {
      if (a.moodBefore != null && a.moodAfter != null) {
        const d = a.moodAfter - a.moodBefore;
        (agg[a.type] ??= { sum: 0, n: 0 });
        agg[a.type].sum += d;
        agg[a.type].n += 1;
      }
    }
    return Object.entries(agg)
      .map(([type, v]) => ({
        type: type as ActivityType,
        avg: v.sum / v.n,
        n: v.n,
      }))
      .sort((a, b) => b.avg - a.avg);
  }, [activities]);

  // Weekly mood (last 7 days) — blend check-ins and activity afters
  const weekly = useMemo(() => {
    const days: { label: string; iso: string; avg: number | null }[] = [];
    const start = addDays(new Date(), -6);
    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      const iso = toISO(d);
      const vals: number[] = [];
      for (const m of moods) {
        if (m.createdAt?.slice(0, 10) === iso) vals.push(m.mood);
      }
      for (const a of activities) {
        if (a.date === iso && a.moodAfter != null) vals.push(a.moodAfter);
      }
      days.push({
        label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
        iso,
        avg: vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null,
      });
    }
    return days;
  }, [moods, activities]);

  const completed = activities.filter((a) => a.completed).length;
  const totalMoodPoints =
    moods.length + activities.filter((a) => a.moodAfter != null).length;
  const best = effectiveness.find((e) => e.avg > 0);
  const avgWeek =
    weekly.filter((d) => d.avg != null).reduce((s, d) => s + (d.avg ?? 0), 0) /
    (weekly.filter((d) => d.avg != null).length || 1);

  const hasData = totalMoodPoints > 0;

  return (
    <div className="stagger space-y-5 px-5 pb-32 pt-8">
      <header>
        <h1 className="font-display text-4xl text-[#4a3f55]">Your Insights</h1>
        <p className="mt-1 text-sm text-[#7c6f8a]">
          Gentle patterns in how you care for yourself.
        </p>
      </header>

      {!hasData ? (
        <div className="glass rounded-3xl py-12 text-center">
          <p className="text-5xl">📊</p>
          <p className="mt-3 font-display text-xl text-[#4a3f55]">
            Your story begins soon
          </p>
          <p className="mt-1 px-8 text-sm text-[#a99cb8]">
            Check in with your mood and complete a few rituals to reveal what
            lifts you.
          </p>
        </div>
      ) : (
        <>
          {/* stat row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              ["🌷", completed, "rituals"],
              ["💗", totalMoodPoints, "check-ins"],
              ["✨", avgWeek ? avgWeek.toFixed(1) : "—", "avg mood"],
            ].map(([e, n, l]) => (
              <div key={l as string} className="glass rounded-2xl p-3 text-center">
                <div className="text-2xl">{e}</div>
                <div className="mt-1 font-display text-2xl text-[#4a3f55]">
                  {n}
                </div>
                <div className="text-[10px] font-semibold uppercase text-[#a99cb8]">
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* headline insight */}
          {best && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-400 to-pink-400 p-5 text-white shadow-lg shadow-pink-200">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-lg" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Key insight
              </p>
              <p className="mt-1 font-display text-2xl leading-snug">
                {ACTIVITY_TYPES[best.type].emoji}{" "}
                {ACTIVITY_TYPES[best.type].label} lifts your mood most.
              </p>
              <p className="mt-1 text-sm text-white/85">
                On average +{best.avg.toFixed(1)} mood levels across {best.n}{" "}
                session{best.n > 1 ? "s" : ""}.
              </p>
            </div>
          )}

          {/* weekly trend */}
          <section className="glass rounded-3xl p-5">
            <h2 className="mb-4 font-bold text-[#4a3f55]">Weekly mood trend</h2>
            <div className="flex h-36 items-end justify-between gap-2">
              {weekly.map((d) => {
                const h = d.avg ? (d.avg / 5) * 100 : 4;
                return (
                  <div
                    key={d.iso}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div className="flex h-28 w-full items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          d.avg
                            ? "bg-gradient-to-t from-violet-400 to-pink-400"
                            : "bg-[#e7dff1]"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#a99cb8]">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* effectiveness */}
          {effectiveness.length > 0 && (
            <section className="glass rounded-3xl p-5">
              <h2 className="mb-4 font-bold text-[#4a3f55]">
                Activity effectiveness
              </h2>
              <div className="space-y-3">
                {effectiveness.map((e) => {
                  const meta = ACTIVITY_TYPES[e.type];
                  const pct = Math.min(100, Math.abs(e.avg) * 25 + 10);
                  const pos = e.avg >= 0;
                  return (
                    <div key={e.type} className="flex items-center gap-3">
                      <span className="w-6 text-lg">{meta.emoji}</span>
                      <div className="flex-1">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-semibold text-[#5c4f6b]">
                            {meta.label}
                          </span>
                          <span
                            className={`font-bold ${pos ? "text-rose-400" : "text-indigo-400"}`}
                          >
                            {pos ? "+" : ""}
                            {e.avg.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/60">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              pos ? meta.gradient : "from-indigo-300 to-violet-300"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs italic text-[#a99cb8]">
                Based on your mood before &amp; after each completed ritual.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
