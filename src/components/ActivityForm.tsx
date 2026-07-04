"use client";

import { useState } from "react";
import Sheet from "./Sheet";
import { ACTIVITY_LIST, ACTIVITY_TYPES, type ActivityType } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import type { ActivityDTO } from "@/lib/types";

export default function ActivityForm({
  open,
  onClose,
  editing,
  defaultDate,
  defaultType,
}: {
  open: boolean;
  onClose: () => void;
  editing?: ActivityDTO | null;
  defaultDate?: string;
  defaultType?: ActivityType;
}) {
  const { addActivity, updateActivity, deleteActivity } = useStore();

  const [type, setType] = useState<ActivityType>(
    editing?.type ?? defaultType ?? "journaling",
  );
  const [title, setTitle] = useState(editing?.title ?? "");
  const [date, setDate] = useState(editing?.date ?? defaultDate ?? todayISO());
  const [time, setTime] = useState(editing?.time ?? "20:00");
  const [duration, setDuration] = useState(
    editing?.duration ?? ACTIVITY_TYPES[type].defaultDuration,
  );
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [reminder, setReminder] = useState(editing?.reminder ?? true);
  const [busy, setBusy] = useState(false);

  const meta = ACTIVITY_TYPES[type];

  const pickType = (t: ActivityType) => {
    setType(t);
    if (!editing && !title) setDuration(ACTIVITY_TYPES[t].defaultDuration);
  };

  const submit = async () => {
    setBusy(true);
    const payload = {
      type,
      title: title.trim() || meta.label,
      date,
      time,
      duration,
      notes,
      reminder,
    };
    if (editing) {
      await updateActivity(editing.id, payload);
    } else {
      await addActivity(payload as never);
    }
    setBusy(false);
    onClose();
  };

  const remove = async () => {
    if (!editing) return;
    setBusy(true);
    await deleteActivity(editing.id);
    setBusy(false);
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? "Edit ritual" : "Plan a ritual"}
    >
      <div className="space-y-5">
        {/* type picker */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#a99cb8]">
            Ritual
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {ACTIVITY_LIST.map((a) => (
              <button
                key={a.type}
                onClick={() => pickType(a.type)}
                className={`press flex shrink-0 flex-col items-center gap-1 rounded-2xl px-3 py-2.5 transition-all ${
                  type === a.type
                    ? `bg-gradient-to-br ${a.gradient} text-white shadow-md`
                    : "bg-white/60 text-[#6b5b7e]"
                }`}
              >
                <span className="text-xl">{a.emoji}</span>
                <span className="text-[10px] font-bold">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#a99cb8]">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={meta.label}
            className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-[#4a3f55] outline-none placeholder:text-[#b6aac2] focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#a99cb8]">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-3 text-sm text-[#4a3f55] outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#a99cb8]">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-3 text-sm text-[#4a3f55] outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#a99cb8]">
            Duration · {duration} min
          </label>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-pink-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#a99cb8]">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="A little intention for this moment…"
            className="w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-[#4a3f55] outline-none placeholder:text-[#b6aac2] focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <button
          onClick={() => setReminder((r) => !r)}
          className="flex w-full items-center justify-between rounded-2xl bg-white/60 px-4 py-3.5"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-[#5c4f6b]">
            🔔 Remind me before
          </span>
          <span
            className={`relative h-6 w-11 rounded-full transition-colors ${
              reminder ? "bg-gradient-to-r from-violet-400 to-pink-400" : "bg-[#d8cfe4]"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                reminder ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
        </button>

        <button
          onClick={submit}
          disabled={busy}
          className="press w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg shadow-pink-200 disabled:opacity-50"
        >
          {editing ? "Save changes" : "Add to my plan ✨"}
        </button>

        {editing && (
          <button
            onClick={remove}
            disabled={busy}
            className="press w-full rounded-2xl py-2 text-sm font-semibold text-rose-400"
          >
            Delete ritual
          </button>
        )}
      </div>
    </Sheet>
  );
}
