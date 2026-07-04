"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";
import Planner from "./Planner";
import Insights from "./Insights";
import BottomNav, { type Tab } from "./BottomNav";
import ActivityForm from "./ActivityForm";
import MoodFlow from "./MoodFlow";
import CareSheet from "./CareSheet";
import Reminders from "./Reminders";
import { todayISO } from "@/lib/utils";
import type { ActivityDTO } from "@/lib/types";
import type { ActivityType } from "@/lib/constants";

export default function AppShell() {
  const { loading, prefs } = useStore();
  const [tab, setTab] = useState<Tab>("home");

  // modals
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ActivityDTO | null>(null);
  const [formDate, setFormDate] = useState<string | undefined>();
  const [formType, setFormType] = useState<ActivityType | undefined>();
  const [flow, setFlow] = useState<{
    a: ActivityDTO;
    phase: "before" | "after";
  } | null>(null);
  const [careOpen, setCareOpen] = useState(false);
  const [notif, setNotif] = useState<NotificationPermission>("default");

  // register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    if (typeof Notification !== "undefined") {
      setNotif(Notification.permission);
    }
  }, []);

  const requestNotif = async () => {
    if (typeof Notification === "undefined") return;
    const p = await Notification.requestPermission();
    setNotif(p);
  };

  const openAdd = (date?: string, type?: ActivityType) => {
    setEditing(null);
    setFormDate(date ?? todayISO());
    setFormType(type);
    setFormOpen(true);
  };
  const openEdit = (a: ActivityDTO) => {
    setEditing(a);
    setFormDate(undefined);
    setFormType(undefined);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <div className="grid min-h-[100dvh] place-items-center">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-400 to-pink-400 text-4xl shadow-lg animate-breathe">
            🪷
          </div>
          <p className="mt-4 font-display text-2xl text-[#4a3f55]">
            Treat Yourself
          </p>
          <p className="text-sm text-[#a99cb8]">preparing your calm…</p>
        </div>
      </div>
    );
  }

  if (!prefs?.onboarded) {
    return <Onboarding />;
  }

  return (
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-md">
      <Reminders />

      {/* top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-5 pb-2 pt-[calc(env(safe-area-inset-top)+14px)]">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-pink-400 text-lg shadow-sm">
            🪷
          </span>
          <span className="font-display text-lg text-[#4a3f55]">
            Treat Yourself
          </span>
        </div>
        <button
          onClick={requestNotif}
          className={`press grid h-9 w-9 place-items-center rounded-full text-lg transition-colors ${
            notif === "granted"
              ? "bg-gradient-to-br from-violet-400 to-pink-400 text-white shadow-sm"
              : "bg-white/70 text-[#8a7c99]"
          }`}
          aria-label="Reminders"
          title={notif === "granted" ? "Reminders on" : "Enable reminders"}
        >
          {notif === "granted" ? "🔔" : "🔕"}
        </button>
      </div>

      <main key={tab} className="animate-fade-in">
        {tab === "home" && (
          <Dashboard
            onAdd={() => openAdd()}
            onBegin={(a) => setFlow({ a, phase: "before" })}
            onComplete={(a) => setFlow({ a, phase: "after" })}
            onEdit={openEdit}
            onCare={() => setCareOpen(true)}
          />
        )}
        {tab === "planner" && (
          <Planner
            onAddForDate={(d) => openAdd(d)}
            onBegin={(a) => setFlow({ a, phase: "before" })}
            onComplete={(a) => setFlow({ a, phase: "after" })}
            onEdit={openEdit}
          />
        )}
        {tab === "insights" && <Insights />}
      </main>

      <BottomNav tab={tab} setTab={setTab} onAdd={() => openAdd()} />

      <ActivityForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
        defaultDate={formDate}
        defaultType={formType}
      />

      {flow && (
        <MoodFlow
          activity={flow.a}
          phase={flow.phase}
          onClose={() => setFlow(null)}
        />
      )}

      <CareSheet
        open={careOpen}
        onClose={() => setCareOpen(false)}
        onPlan={(t) => openAdd(todayISO(), t)}
      />

      {/* floating care button when not on home */}
      {tab !== "home" && (
        <button
          onClick={() => setCareOpen(true)}
          className="press fixed bottom-28 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-2xl text-white shadow-lg shadow-rose-300 animate-breathe"
          aria-label="I need care"
        >
          🫂
        </button>
      )}
    </div>
  );
}
