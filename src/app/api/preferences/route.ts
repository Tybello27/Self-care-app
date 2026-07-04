import { db } from "@/db";
import { preferences, DEMO_USER } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getOrCreate() {
  const rows = await db
    .select()
    .from(preferences)
    .where(eq(preferences.userId, DEMO_USER))
    .limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db
    .insert(preferences)
    .values({ userId: DEMO_USER })
    .returning();
  return created;
}

export async function GET() {
  const pref = await getOrCreate();
  return Response.json(pref);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  await getOrCreate();
  const [updated] = await db
    .update(preferences)
    .set({
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.goals !== undefined ? { goals: body.goals } : {}),
      ...(body.activities !== undefined ? { activities: body.activities } : {}),
      ...(body.onboarded !== undefined ? { onboarded: body.onboarded } : {}),
      updatedAt: new Date(),
    })
    .where(eq(preferences.userId, DEMO_USER))
    .returning();
  return Response.json(updated);
}
