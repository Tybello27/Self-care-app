import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

// A single demo user is used across the app ("rita").
export const DEMO_USER = "rita";

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default(DEMO_USER),
  name: text("name").notNull().default("Rita"),
  goals: text("goals").array().notNull().default([]),
  activities: text("activities").array().notNull().default([]),
  onboarded: boolean("onboarded").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default(DEMO_USER),
  type: text("type").notNull(), // journaling, spa, skincare, rest, meditation, reading, walk
  title: text("title").notNull(),
  date: date("date").notNull(),
  time: text("time").notNull().default("09:00"),
  duration: integer("duration").notNull().default(30), // minutes
  notes: text("notes").notNull().default(""),
  reminder: boolean("reminder").notNull().default(true),
  completed: boolean("completed").notNull().default(false),
  moodBefore: integer("mood_before"), // 1-5
  moodAfter: integer("mood_after"), // 1-5
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const moodCheckins = pgTable("mood_checkins", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default(DEMO_USER),
  mood: integer("mood").notNull(), // 1-5
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type Preferences = typeof preferences.$inferSelect;
export type MoodCheckin = typeof moodCheckins.$inferSelect;
