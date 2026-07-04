"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ActivityDTO, MoodDTO, PreferencesDTO } from "./types";

interface StoreValue {
  loading: boolean;
  prefs: PreferencesDTO | null;
  activities: ActivityDTO[];
  moods: MoodDTO[];
  refresh: () => Promise<void>;
  savePrefs: (patch: Partial<PreferencesDTO>) => Promise<void>;
  addActivity: (
    data: Omit<ActivityDTO, "id" | "createdAt" | "completed" | "moodAfter"> & {
      moodBefore?: number | null;
    },
  ) => Promise<ActivityDTO | null>;
  updateActivity: (id: number, patch: Partial<ActivityDTO>) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
  addMood: (mood: number, note?: string) => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<PreferencesDTO | null>(null);
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [moods, setMoods] = useState<MoodDTO[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [p, a, m] = await Promise.all([
        fetch("/api/preferences").then((r) => r.json()),
        fetch("/api/activities").then((r) => r.json()),
        fetch("/api/moods").then((r) => r.json()),
      ]);
      setPrefs(p);
      setActivities(Array.isArray(a) ? a : []);
      setMoods(Array.isArray(m) ? m : []);
    } catch {
      // offline — keep existing state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const savePrefs = useCallback(async (patch: Partial<PreferencesDTO>) => {
    const updated = await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    }).then((r) => r.json());
    setPrefs(updated);
  }, []);

  const addActivity = useCallback<StoreValue["addActivity"]>(async (data) => {
    const created = await fetch("/api/activities", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
    setActivities((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateActivity = useCallback(
    async (id: number, patch: Partial<ActivityDTO>) => {
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      );
      await fetch(`/api/activities/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
      });
    },
    [],
  );

  const deleteActivity = useCallback(async (id: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
  }, []);

  const addMood = useCallback(async (mood: number, note = "") => {
    const created = await fetch("/api/moods", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mood, note }),
    }).then((r) => r.json());
    setMoods((prev) => [created, ...prev]);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      loading,
      prefs,
      activities,
      moods,
      refresh,
      savePrefs,
      addActivity,
      updateActivity,
      deleteActivity,
      addMood,
    }),
    [
      loading,
      prefs,
      activities,
      moods,
      refresh,
      savePrefs,
      addActivity,
      updateActivity,
      deleteActivity,
      addMood,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
