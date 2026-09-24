import { db } from "@/lib/db/db";
import { bible_verses } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { title, book, verse, verse_text } = await request.json();

    if (!title || !book || !verse || !verse_text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!db) throw new Error("Database not initialized");
    await db.insert(bible_verses).values({
      title,
      book,
      verse,
      verse_text,
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Verse creation error:", error);
    return NextResponse.json(
      { error: "Failed to create verse" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!db) throw new Error("Database not initialized");
    const verses = await db
      .select()
      .from(bible_verses)
      .orderBy(desc(bible_verses.created_at));

    return NextResponse.json({ verses });
  } catch (error) {
    console.error("Error fetching verses:", error);
    return NextResponse.json(
      { error: "Failed to fetch verses" },
      { status: 500 }
    );
  }
}
