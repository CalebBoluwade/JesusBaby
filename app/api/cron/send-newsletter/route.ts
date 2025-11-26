import { db } from "@/lib/db/db";
import { newsletters, bible_verses } from "@/lib/db/schema";
import { sendEmail, generateNewsletterHtml } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { isNull, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscribers = await (db as any)
      .select({ email: newsletters.email })
      .from(newsletters)
      .where(isNull(newsletters.unsubscribed_at));

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers" });
    }

    if (!db) throw new Error("Database not initialized");
    const verse = await db
      .select()
      .from(bible_verses)
      .orderBy(() => sql`RANDOM()`)
      .limit(1)
      .then((rows) => rows[0]);

    const content = `
      <h2>Delivered from ${verse.title}</h2>
      <p><em>"${verse.verse_text}"</em></p>
      <p><strong>- ${verse.book} ${verse.verse}</strong></p>
    `;

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe`;
    const html = generateNewsletterHtml(
      "Weekly Inspiration",
      content,
      unsubscribeUrl
    );

    let sent = 0;
    for (const subscriber of subscribers) {
      const success = await sendEmail({
        to: subscriber.email,
        subject: `Delivered from ${verse.title}`,
        html,
      });
      if (success) sent++;
    }

    return NextResponse.json({
      success: true,
      sent,
      total: subscribers.length,
    });
  } catch (error) {
    console.error("Newsletter cron error:", error);
    return NextResponse.json(
      { error: "Failed to send newsletters" },
      { status: 500 }
    );
  }
}
