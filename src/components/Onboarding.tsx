"use client";

import { useState } from "react";
import { GOALS, ACTIVITY_LIST } from "@/lib/constants";
import { useStore } from "@/lib/store";

export default function Onboarding() {
  const { savePrefs } = useStore();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [acts, setActs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, id: string) => {
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  const finish = async () => {
    setSaving(true);
    await savePrefs({ goals, activities: acts, onboarded: true });
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-10 pt-14">
      {/* progress */}
      <div className="mb-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step
                ? "bg-gradient-to-r from-violet-400 to-pink-400"
                : "bg-white/60"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div key="s0" className="animate-fade-up flex flex-1 flex-col">
          <div className="mb-6 text-6xl animate-float">🕊️</div>
          <h1 className="font-display text-4xl leading-tight text-[#4a3f55]">
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              Rita
            </span>{" "}
            ✨
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#7c6f8a]">
            This is your soft space to slow down, breathe, and take gentle care
            of yourself. Let&apos;s set up a few things so your rituals feel
            just right.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              ["🗓️", "Plan calming self-care rituals"],
              ["💗", "Track how you feel, before & after"],
              ["📊", "Discover what truly lifts you"],
            ].map(([e, t]) => (
              <div
                key={t}
                className="glass flex items-center gap-3 rounded-2xl p-4"
              >
                <span className="text-2xl">{e}</span>
                <span className="text-sm font-medium text-[#5c4f6b]">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setStep(1)}
            className="press mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg shadow-pink-200"
          >
            Let&apos;s begin
          </button>
        </div>
      )}

      {step === 1 && (
        <div key="s1" className="animate-fade-up flex flex-1 flex-col">
          <h2 className="font-display text-3xl text-[#4a3f55]">
            What are you hoping for?
          </h2>
          <p className="mt-2 text-sm text-[#7c6f8a]">
            Choose your wellness goals — pick as many as you like.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {GOALS.map((g) => {
              const on = goals.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggle(goals, setGoals, g.id)}
                  className={`press flex flex-col items-start gap-2 rounded-3xl p-5 text-left transition-all ${
                    on
                      ? "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg shadow-pink-200"
                      : "glass text-[#5c4f6b]"
                  }`}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <span className="text-sm font-bold leading-tight">
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex-1" />
          <button
            disabled={goals.length === 0}
            onClick={() => setStep(2)}
            className="press mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg shadow-pink-200 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div key="s2" className="animate-fade-up flex flex-1 flex-col">
          <h2 className="font-display text-3xl text-[#4a3f55]">
            Your favourite rituals
          </h2>
          <p className="mt-2 text-sm text-[#7c6f8a]">
            We&apos;ll suggest these first when you plan your days.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {ACTIVITY_LIST.map((a) => {
              const on = acts.includes(a.type);
              return (
                <button
                  key={a.type}
                  onClick={() => toggle(acts, setActs, a.type)}
                  className={`press flex items-center gap-3 rounded-2xl p-4 text-left transition-all ${
                    on
                      ? `bg-gradient-to-br ${a.gradient} text-white shadow-md`
                      : "glass text-[#5c4f6b]"
                  }`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-[13px] font-bold leading-tight">
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex-1" />
          <button
            disabled={acts.length === 0 || saving}
            onClick={finish}
            className="press mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg shadow-pink-200 disabled:opacity-40"
          >
            {saving ? "Creating your space…" : "Enter Treat Yourself ✨"}
          </button>
        </div>
      )}
    </div>
  );
}
