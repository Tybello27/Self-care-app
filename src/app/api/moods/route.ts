import { db } from "@/db";
import { moodCheckins, DEMO_USER } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(moodCheckins)
    .where(eq(moodCheckins.userId, DEMO_USER))
    .orderBy(desc(moodCheckins.createdAt));
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [created] = await db
    .insert(moodCheckins)
    .values({
      userId: DEMO_USER,
      mood: body.mood,
      note: body.note ?? "",
    })
    .returning();
  return Response.json(created);
}
