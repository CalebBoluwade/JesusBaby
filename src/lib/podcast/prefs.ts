
export const CONSENT_COOKIE = "lw_consent";
export const PREFS_COOKIE = "lw_prefs";
export const RESUME_COOKIE = "lw_resume";

export const DEFAULT_PREFS: Prefs = { volume: 0.8, muted: false, rate: 1, mode: "auto" };

const MODES: QualityMode[] = ["auto", "low", "medium", "high", "lossless"];
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function decode(raw?: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  const candidates = [raw];
  try {
    candidates.push(decodeURIComponent(raw));
  } catch {
    /* keep raw only */
  }
  for (const s of candidates) {
    try {
      const v = JSON.parse(s);
      if (v && typeof v === "object") return v as Record<string, unknown>;
    } catch {
      /* try next */
    }
  }
  return null;
}

export function parsePrefs(raw?: string | null): Prefs {
  const o = decode(raw);
  if (!o) return DEFAULT_PREFS;
  const volume = typeof o.volume === "number" ? clamp(o.volume, 0, 1) : DEFAULT_PREFS.volume;
  const rate = typeof o.rate === "number" ? clamp(o.rate, 0.5, 3) : DEFAULT_PREFS.rate;
  const mode = MODES.includes(o.mode as QualityMode) ? (o.mode as QualityMode) : DEFAULT_PREFS.mode;
  return { volume, rate, mode, muted: o.muted === true };
}

export function parseResume(raw?: string | null): Resume | null {
  const o = decode(raw);
  if (!o || typeof o.id !== "string" || typeof o.t !== "number" || !Number.isFinite(o.t)) return null;
  return { id: o.id, t: Math.max(0, o.t) };
}

export function parseConsent(raw?: string | null): Consent | null {
  return raw === "all" || raw === "essential" ? raw : null;
}

/* ---- client-only cookie IO ---- */

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) return part.slice(prefix.length);
  }
  return null;
}

export function writeCookie(name: string, value: string, maxAgeDays: number): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${Math.round(
    maxAgeDays * 86400,
  )}; SameSite=Lax${secure}`;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}
