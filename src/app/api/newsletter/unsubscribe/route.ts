import { db } from "@/lib/db/db";
import { newsletters } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    if (!db) throw new Error("Database not initialized");
    await db
      .update(newsletters)
      .set({ unsubscribed_at: new Date() })
      .where(eq(newsletters.email, email));

    return NextResponse.json({ success: true, message: "Unsubscribed" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
