export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns incompressible random bytes so the client can time a small download.
 * Random data defeats gzip/brotli, so the measured size is the size on the wire.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const requested = Number(url.searchParams.get("bytes")) || 65536;
  const bytes = Math.min(262144, Math.max(1024, Math.floor(requested)));

  const buf = new Uint8Array(bytes);
  for (let off = 0; off < bytes; off += 65536) {
    crypto.getRandomValues(buf.subarray(off, Math.min(off + 65536, bytes)));
  }

  return new Response(buf, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store",
      "Content-Length": String(bytes),
    },
  });
}
