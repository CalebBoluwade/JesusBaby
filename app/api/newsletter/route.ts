import { db } from "@/lib/db/db";
import { newsletters } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, isNull, count } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    if (!db) throw new Error("Database not initialized");
    await db
      .insert(newsletters)
      .values({ email })
      .onConflictDoUpdate({
        target: newsletters.email,
        set: { unsubscribed_at: null },
      });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!db) throw new Error("Database not initialized");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (db as any)
      .select({ count: count() })
      .from(newsletters)
      .where(isNull(newsletters.unsubscribed_at));

    return NextResponse.json({ subscribers: result[0].count });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
