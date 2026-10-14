global {
  // --- Types ---
  interface Testimonial {
    id?: number;
    name: string;
    image: string;
    addiction: string;
    testimony: string;
    videoUrl?: string;
    // createdAt: string;
  }

  interface BibleVerseReference {
    id: number;
    title: string;
    book: string;
    verse: string;
    verseText: string;
  }

  interface Project {
    id: number;
    brandName: string;
    name: string;
    description: string;
    imageUrl: string;
    projectUrl: string | "modal";
    comingSoon?: boolean;
  }

  // interface User {
  //   uid: string;
  //   email?: string;
  //   displayName?: string;
  // }

  type Quality = "low" | "medium" | "high" | "lossless";
  type QualityMode = "auto" | Quality;

  /** Ordered tiers, lowest first. Runtime values live in src/lib/podcast/types.ts */
  const QUALITIES: Quality[];
  const AUTO_CEILING: Quality;
  const QUALITY_META: Record<Quality, { label: string; kbps: number; ext: string; mime: string; detail: string }>;

  interface Episode {
    id: string;
    showId?: string;
    title: string;
    summary: string;
    /** ISO date */
    publishedAt: string;
    durationSec: number;
    /** Where the audio preview starts and how long it runs (seconds). */
    preview: { start: number; length: number };
  }

  interface Podcast {
    id: string;
    title: string;
    host: string;
    category: string;
    description: string;
    duration: string;
    date: string;
    cover: string;
    episode: string;
    artworkUrl?: string;
    appleUrl?: string;
    feedUrl?: string;
    preview?: { start: number; length: number };
    audioSources?: { quality: Quality; label: string; url: string; bitrateKbps?: number; mimeType?: string }[];
  }

  type Consent = "all" | "essential";

  interface Prefs {
    volume: number;
    muted: boolean;
    rate: number;
    mode: QualityMode;
  }

  interface Resume {
    id: string;
    t: number;
  }

  interface NetworkInformationLike extends EventTarget {
    effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
    downlink?: number;
    saveData?: boolean;
  }
}

export {};
