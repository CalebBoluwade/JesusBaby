export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const rr = String(r).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${rr}` : `${m}:${rr}`;
}

export function formatMinutes(sec: number): string {
  return `${Math.round(sec / 60)} min`;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function mbPerHour(kbps: number): number {
  return Math.round((kbps * 3600) / 8 / 1000);
}
