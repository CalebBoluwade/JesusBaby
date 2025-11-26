import { db } from "@/lib/db/db";
import { testimonies } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { name, addiction, story, video_url } = await request.json();

    if (!name || !addiction || !story) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!db) throw new Error("Database not initialized");
    await db.insert(testimonies).values({
      name,
      addiction,
      story,
      video_url: video_url || null,
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Testimony creation error:", error);
    return NextResponse.json(
      { error: "Failed to create testimony" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!db) throw new Error("Database not initialized");
    const testimoniesList = await db
      .select()
      .from(testimonies)
      .orderBy(desc(testimonies.created_at));

    return NextResponse.json({ testimonies: testimoniesList });
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonies" },
      { status: 500 }
    );
  }
}
