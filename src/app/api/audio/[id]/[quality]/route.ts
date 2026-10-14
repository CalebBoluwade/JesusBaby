import type { NextRequest } from "next/server";
import { QUALITIES, QUALITY_META } from "@/lib/podcast/types";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = { m4a: "audio/mp4", flac: "audio/flac" };

/**
 * Local development / self-hosted streaming with HTTP Range support, which is
 * what makes seeking and quality switching cheap on slow links (only the bytes
 * needed are fetched). In production, serve /media from a CDN or object store
 * and set NEXT_PUBLIC_MEDIA_BASE instead.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; quality: string }> },
) {
  const { id, quality } = await ctx.params;
  if (!/^[a-z0-9-]+$/i.test(id) || !QUALITIES.includes(quality as Quality)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = QUALITY_META[quality as Quality].ext;
  const file = path.join(process.cwd(), "media", id, `${quality}.${ext}`);

  let size: number;
  let mtime: number;
  try {
    const st = await stat(file);
    size = st.size;
    mtime = Math.floor(st.mtimeMs);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const base: Record<string, string> = {
    "Content-Type": MIME[ext],
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: `"${size}-${mtime}"`,
  };

  const range = req.headers.get("range");
  if (!range) {
    const body = Readable.toWeb(createReadStream(file)) as unknown as ReadableStream;
    return new Response(body, { status: 200, headers: { ...base, "Content-Length": String(size) } });
  }

  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  const invalid = () =>
    new Response(null, { status: 416, headers: { ...base, "Content-Range": `bytes */${size}` } });
  if (!m || (m[1] === "" && m[2] === "")) return invalid();

  let start: number;
  let end: number;
  if (m[1] === "") {
    const n = Number(m[2]);
    if (!n) return invalid();
    start = Math.max(size - n, 0);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start > end || start >= size) return invalid();

  const body = Readable.toWeb(createReadStream(file, { start, end })) as unknown as ReadableStream;
  return new Response(body, {
    status: 206,
    headers: {
      ...base,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
    },
  });
}
