/**
 * Deterministic placeholder peaks so the waveform renders without decoding audio.
 * For production, precompute real peaks per episode (e.g. BBC `audiowaveform`)
 * and ship them as a small JSON next to the audio files.
 */
export function peaksFor(seed: string, count: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rnd = () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const out: number[] = [];
  let env = 0.5;
  for (let i = 0; i < count; i++) {
    env = env * 0.85 + rnd() * 0.15;
    out.push(0.12 + 0.88 * Math.min(1, env * 1.6) * (0.35 + 0.65 * rnd()));
  }
  return out;
}
