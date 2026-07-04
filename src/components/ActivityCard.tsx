"use client";

import { ACTIVITY_TYPES, moodMeta } from "@/lib/constants";
import { formatTime, prettyDate } from "@/lib/utils";
import type { ActivityDTO } from "@/lib/types";

export default function ActivityCard({
  activity,
  showDate = false,
  onBegin,
  onComplete,
  onEdit,
}: {
  activity: ActivityDTO;
  showDate?: boolean;
  onBegin: (a: ActivityDTO) => void;
  onComplete: (a: ActivityDTO) => void;
  onEdit: (a: ActivityDTO) => void;
}) {
  const meta = ACTIVITY_TYPES[activity.type];
  const started = activity.moodBefore != null;
  const done = activity.completed;
  const before = moodMeta(activity.moodBefore);
  const after = moodMeta(activity.moodAfter);

  return (
    <div
      className={`glass relative overflow-hidden rounded-3xl p-4 ${
        done ? "opacity-80" : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${meta.gradient} opacity-20 blur-xl`}
      />
      <div className="flex items-start gap-3">
        <button
          onClick={() => onEdit(activity)}
          className={`press grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-2xl shadow-md`}
        >
          {meta.emoji}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-bold text-[#4a3f55]">
              {activity.title}
            </h4>
            {done && <span className="text-sm">✅</span>}
          </div>
          <p className="mt-0.5 text-xs font-medium text-[#8a7c99]">
            {showDate && <>{prettyDate(activity.date)} · </>}
            {formatTime(activity.time)} · {activity.duration} min
          </p>
          {activity.notes && (
            <p className="mt-1 line-clamp-1 text-xs italic text-[#a99cb8]">
              “{activity.notes}”
            </p>
          )}

          {(before || after) && (
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              {before && <span title="before">{before.emoji}</span>}
              {before && after && <span className="text-[#c9bdd6]">→</span>}
              {after && <span title="after">{after.emoji}</span>}
            </div>
          )}
        </div>
      </div>

      {!done && (
        <div className="mt-3 flex gap-2">
          {!started ? (
            <button
              onClick={() => onBegin(activity)}
              className={`press flex-1 rounded-xl bg-gradient-to-r ${meta.gradient} py-2.5 text-sm font-bold text-white shadow-sm`}
            >
              Begin ritual
            </button>
          ) : (
            <button
              onClick={() => onComplete(activity)}
              className="press flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 py-2.5 text-sm font-bold text-white shadow-sm"
            >
              Complete ✨
            </button>
          )}
          <button
            onClick={() => onEdit(activity)}
            className="press rounded-xl bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#7c6f8a]"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
