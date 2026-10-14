export const QUALITIES: Quality[] = ["low", "medium", "high", "lossless"];
export const AUTO_CEILING: Quality = "high";
export const QUALITY_META: Record<Quality, { label: string; kbps: number; ext: string; mime: string; detail: string }> = {
  low:      { label: "Low",      kbps: 40,  ext: "m4a",  mime: 'audio/mp4; codecs="mp4a.40.2"', detail: "AAC mono 40 kbps" },
  medium:   { label: "Standard", kbps: 64,  ext: "m4a",  mime: 'audio/mp4; codecs="mp4a.40.2"', detail: "AAC stereo 64 kbps" },
  high:     { label: "High",     kbps: 160, ext: "m4a",  mime: 'audio/mp4; codecs="mp4a.40.2"', detail: "AAC stereo 160 kbps" },
  lossless: { label: "Lossless", kbps: 800, ext: "flac", mime: "audio/flac",                     detail: "FLAC" },
};
