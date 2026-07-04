import { db } from "@/db";
import { activities, DEMO_USER } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(activities)
    .where(eq(activities.userId, DEMO_USER))
    .orderBy(desc(activities.date));
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [created] = await db
    .insert(activities)
    .values({
      userId: DEMO_USER,
      type: body.type,
      title: body.title,
      date: body.date,
      time: body.time ?? "09:00",
      duration: body.duration ?? 30,
      notes: body.notes ?? "",
      reminder: body.reminder ?? true,
      moodBefore: body.moodBefore ?? null,
    })
    .returning();
  return Response.json(created);
}
