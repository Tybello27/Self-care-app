import { db } from "@/db";
import { activities, DEMO_USER } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const set: Record<string, unknown> = {};
  const fields = [
    "type",
    "title",
    "date",
    "time",
    "duration",
    "notes",
    "reminder",
    "completed",
    "moodBefore",
    "moodAfter",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) set[f] = body[f];
  }
  const [updated] = await db
    .update(activities)
    .set(set)
    .where(
      and(eq(activities.id, Number(id)), eq(activities.userId, DEMO_USER)),
    )
    .returning();
  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db
    .delete(activities)
    .where(
      and(eq(activities.id, Number(id)), eq(activities.userId, DEMO_USER)),
    );
  return Response.json({ ok: true });
}
