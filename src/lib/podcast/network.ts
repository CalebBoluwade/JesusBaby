import { AUTO_CEILING, QUALITIES, QUALITY_META } from "./types";

/* Network Information API is Chromium-only, so everything here degrades gracefully. */
export function getConnection(): NetworkInformationLike | null {
  if (typeof navigator === "undefined") return null;
  return (navigator as unknown as { connection?: NetworkInformationLike }).connection ?? null;
}

/** Highest tier the browser's own connection hints allow. */
export function connectionCap(): Quality {
  const c = getConnection();
  if (!c) return AUTO_CEILING;
  if (c.saveData) return "low";
  switch (c.effectiveType) {
    case "slow-2g":
    case "2g":
      return "low";
    case "3g":
      return "medium";
    default:
      return AUTO_CEILING;
  }
}

export function bandwidthHintKbps(): number | null {
  const d = getConnection()?.downlink;
  return typeof d === "number" && d > 0 ? d * 1000 : null;
}

let probeEl: HTMLAudioElement | null = null;
const playableCache = new Map<Quality, boolean>();

export function canPlayQuality(q: Quality): boolean {
  if (typeof document === "undefined") return q !== "lossless";
  const hit = playableCache.get(q);
  if (hit !== undefined) return hit;
  probeEl ??= document.createElement("audio");
  const ok = probeEl.canPlayType(QUALITY_META[q].mime) !== "";
  playableCache.set(q, ok);
  return ok;
}

const PROBE_BYTES = 65536;
let cache: { kbps: number | null; at: number } | null = null;

export function cachedKbps(maxAgeMs = 60_000): number | null {
  return cache && Date.now() - cache.at < maxAgeMs ? cache.kbps : null;
}

async function probeKbps(timeoutMs: number): Promise<number | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const t0 = performance.now();
    const res = await fetch(`/api/probe?bytes=${PROBE_BYTES}&t=${Date.now()}`, {
      cache: "no-store",
      signal: ctrl.signal,
    });
    const buf = await res.arrayBuffer();
    const ms = Math.max(1, performance.now() - t0);
    return (buf.byteLength * 8) / ms; // bits per ms == kbps
  } catch (err) {
    // A timeout means "slower than this bound", which is itself a useful answer.
    if ((err as Error).name === "AbortError") return (PROBE_BYTES * 8) / timeoutMs;
    return null; // offline or blocked
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Combines the browser hint with a small timed download. A 64 KB probe
 * under-reads fast links (TCP slow start), so the probe is scaled up and
 * then capped by the hint when we have one. Treat it as a heuristic.
 */
export async function estimateKbps(opts: { timeoutMs?: number; fresh?: boolean } = {}): Promise<number | null> {
  const { timeoutMs = 1500, fresh = false } = opts;
  if (!fresh) {
    const hit = cachedKbps(15_000);
    if (hit !== null) return hit;
  }
  const hint = bandwidthHintKbps();
  const probed = await probeKbps(timeoutMs);
  let kbps: number | null;
  if (probed === null) kbps = hint;
  else kbps = hint === null ? probed : Math.min(hint, probed * 2);
  cache = { kbps, at: Date.now() };
  return kbps;
}

/** Pick the best tier whose bitrate fits with headroom, never above `cap`. */
export function qualityForBandwidth(kbps: number | null, cap: Quality): Quality {
  const HEADROOM = 2.5;
  let best: Quality = "low";
  if (kbps === null) {
    best = "medium"; // unknown: start in the middle and let the adaptive loop correct it
  } else {
    for (const q of QUALITIES) {
      if (canPlayQuality(q) && QUALITY_META[q].kbps * HEADROOM <= kbps) best = q;
    }
  }
  return QUALITIES[Math.min(QUALITIES.indexOf(best), QUALITIES.indexOf(cap))];
}

/** Seconds of audio buffered ahead of the playhead. */
export function bufferAhead(a: HTMLAudioElement): number {
  const t = a.currentTime;
  for (let i = 0; i < a.buffered.length; i++) {
    if (a.buffered.start(i) <= t + 0.25 && a.buffered.end(i) >= t) return a.buffered.end(i) - t;
  }
  return 0;
}
