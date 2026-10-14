"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Bookmark,
  Check,
  Clock3,
  ListMusic,
  Pause,
  Play,
  Plus,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Gauge,
  X,
  BookOpen,
  Flame,
  Home,
  Library,
  ChevronRight,
  Mic2,
  Radio,
  MoreHorizontal,
  Heart,
  Shuffle,
  Repeat,
  Menu,
} from "lucide-react";
import CookieConsent from "@/components/cookie-consent";
import { CoverArt } from "@/components/cover-art";
import { peaksFor } from "@/lib/podcast/peaks";
import {
  estimateKbps,
  qualityForBandwidth,
  connectionCap,
  bufferAhead,
} from "@/lib/podcast/network";
import {
  parsePrefs,
  parseResume,
  parseConsent,
  readCookie,
  writeCookie,
  PREFS_COOKIE,
  RESUME_COOKIE,
  CONSENT_COOKIE,
  DEFAULT_PREFS,
} from "@/lib/podcast/prefs";

/* ── persistence helpers ── */
const LISTEN_KEY = "lw_listened";
const STREAK_KEY = "lw_streak";
const PLAYLISTS_KEY = "lw_playlists";

function getListened(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LISTEN_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function markListened(id: string) {
  if (typeof window === "undefined") return;
  const prev = getListened();
  if (!prev.includes(id))
    localStorage.setItem(LISTEN_KEY, JSON.stringify([...prev, id]));
}
function getStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = JSON.parse(localStorage.getItem(STREAK_KEY) ?? "null");
    if (!raw) return 0;
    const today = new Date().toDateString();
    const days: string[] = raw.days ?? [];
    if (!days.includes(today)) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newDays = days.includes(yesterday) ? [...days, today] : [today];
      localStorage.setItem(STREAK_KEY, JSON.stringify({ days: newDays }));
      return newDays.length;
    }
    return days.length;
  } catch {
    return 0;
  }
}
function touchStreak() {
  if (typeof window !== "undefined") getStreak();
}

type Playlist = { id: string; name: string; episodeIds: string[] };
function getPlaylists(): Playlist[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PLAYLISTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function savePlaylists(pl: Playlist[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(pl));
}

/* ── waveform ── */
function Waveform({
  id,
  currentTime,
  duration,
  onSeek,
}: Readonly<{
  id: string;
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}>) {
  const BARS = 80;
  const peaks = useMemo(() => peaksFor(id, BARS), [id]);
  const progress = duration > 0 ? currentTime / duration : 0;
  return (
    <div
      className="flex h-8 w-full cursor-pointer items-end gap-px group"
      role="slider"
      aria-label="Seek audio"
      aria-valuenow={Math.round(currentTime)}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration) || 100}
      tabIndex={0}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onSeek(((e.clientX - r.left) / r.width) * (duration || 0));
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight")
          onSeek(Math.min(currentTime + 10, duration));
        if (e.key === "ArrowLeft") onSeek(Math.max(currentTime - 10, 0));
      }}
    >
      {peaks.map((h, i) => (
        <div
          key={i + 1}
          className="flex-1 rounded-full transition-all duration-75 group-hover:opacity-90"
          style={{
            height: `${Math.round(h * 100)}%`,
            background: i / BARS <= progress ? "var(--lime)" : "#3a3a3a",
          }}
        />
      ))}
    </div>
  );
}

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
};
const RATES = [0.75, 1, 1.25, 1.5, 2];

/* ── curated playlists (static seeds) ── */
const CURATED = [
  {
    id: "cp-faith",
    name: "Faith Foundations",
    color: "#1e3a5f",
    accent: "#60a5fa",
  },
  {
    id: "cp-grace",
    name: "Grace & Mercy",
    color: "#3b1f4e",
    accent: "#c084fc",
  },
  { id: "cp-fire", name: "On Fire", color: "#4a1a0e", accent: "#fb923c" },
  { id: "cp-peace", name: "Still Waters", color: "#0f2e1e", accent: "#34d399" },
];

/* ══════════════════════════════════════════════════════════════ */
export default function PodcastApp() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [catalogError, setCatalogError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [volume, setVolume] = useState(DEFAULT_PREFS.volume);
  const [muted, setMuted] = useState(DEFAULT_PREFS.muted);
  const [rate, setRate] = useState(DEFAULT_PREFS.rate);
  const [mode, setMode] = useState<QualityMode>(DEFAULT_PREFS.mode);
  const [resolvedQuality, setResolvedQuality] = useState<Quality>("medium");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioMessage, setAudioMessage] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [saveToast, setSaveToast] = useState("");
  const [autoPlayCountdown, setAutoPlayCountdown] = useState<number | null>(
    null,
  );
  const [previewCountdown, setPreviewCountdown] = useState<number | null>(null);
  const [waitVerse, setWaitVerse] = useState<{
    title: string;
    verse_text: string;
  } | null>(null);
  const [listenedIds, setListenedIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [nextUp, setNextUp] = useState<Podcast | null>(null);
  const [sidebarView, setSidebarView] = useState<
    "home" | "library" | "favorites" | "playlist"
  >("home");
  const [activeCurated, setActiveCurated] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adaptiveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewCountRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── data loading ── */
  const loadCatalog = useCallback(async () => {
    setCatalogStatus("loading");
    setCatalogError("");
    try {
      const res = await fetch("/api/podcasts", { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as { podcasts?: Podcast[] };
      if (!Array.isArray(data.podcasts)) throw new Error("Invalid response");
      setPodcasts(data.podcasts);
      const resume = parseResume(readCookie(RESUME_COOKIE));
      const resumed = resume
        ? data.podcasts.find((p) => p.id === resume.id)
        : undefined;
      setPlaying((cur) => cur ?? resumed ?? data.podcasts?.[0] ?? null);
      if (resumed && resume) setCurrentTime(resume.t);
      setCatalogStatus("ready");
    } catch {
      setCatalogError("The podcast catalog could not be loaded.");
      setCatalogStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
    fetch("/api/verses")
      .then((r) => r.json())
      .then((d) => {
        const v = d.verses;
        if (Array.isArray(v) && v.length > 0)
          setWaitVerse(v[Math.floor(Math.random() * v.length)]);
      })
      .catch(() => null);
    setListenedIds(getListened());
    setStreak(getStreak());
    setPlaylists(getPlaylists());
  }, [loadCatalog]);

  useEffect(() => {
    const consent = parseConsent(readCookie(CONSENT_COOKIE));
    if (!consent) return;
    const p = parsePrefs(readCookie(PREFS_COOKIE));
    setPrefs(p);
    setVolume(p.volume);
    setMuted(p.muted);
    setRate(p.rate);
    setMode(p.mode);
  }, []);

  const savePrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      writeCookie(PREFS_COOKIE, JSON.stringify(next), 365);
      return next;
    });
  }, []);

  const pickQuality = useCallback(async (): Promise<Quality> => {
    if (mode !== "auto") return mode as Quality;
    const kbps = await estimateKbps({ timeoutMs: 1500 });
    return qualityForBandwidth(kbps, connectionCap());
  }, [mode]);

  useEffect(() => {
    if (adaptiveRef.current) clearInterval(adaptiveRef.current);
    if (mode !== "auto") {
      setResolvedQuality(mode as Quality);
      return;
    }
    pickQuality().then(setResolvedQuality);
    adaptiveRef.current = setInterval(async () => {
      const a = audioRef.current;
      if (!a || !isPlaying) return;
      if (bufferAhead(a) < 8) pickQuality().then(setResolvedQuality);
    }, 15_000);
    return () => {
      if (adaptiveRef.current) clearInterval(adaptiveRef.current);
    };
  }, [mode, isPlaying, pickQuality]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
    a.playbackRate = rate;
  }, [volume, muted, rate]);

  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setAutoPlayCountdown(null);
    setNextUp(null);
  }, []);

  const selectPodcast = useCallback(
    async (podcast: Podcast, preview = false) => {
      const audio = audioRef.current;
      if (audio) audio.pause();
      clearAutoPlay();
      setPlaying(podcast);
      setIsPreview(preview);
      setCurrentTime(0);
      setAudioMessage("");
      setPreviewCountdown(null);
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      if (previewCountRef.current) clearInterval(previewCountRef.current);
      const q = await pickQuality();
      setResolvedQuality(q);
      const sources = podcast.audioSources ?? [];
      const src = sources.find((s) => s.quality === q)?.url ?? sources[0]?.url;
      if (!src) {
        setIsPlaying(false);
        setAudioMessage("This episode does not have an audio source yet.");
        return;
      }
      if (!audio) return;
      audio.src = src;
      audio.load();
      audio.volume = muted ? 0 : volume;
      audio.playbackRate = rate;
      if (preview) {
        audio.currentTime = podcast.preview?.start ?? 0;
        const len = podcast.preview?.length ?? 30;
        let rem = len;
        setPreviewCountdown(rem);
        previewCountRef.current = setInterval(() => {
          rem -= 1;
          setPreviewCountdown(rem > 0 ? rem : null);
          if (rem <= 0 && previewCountRef.current)
            clearInterval(previewCountRef.current);
        }, 1000);
      }
      try {
        await audio.play();
        setIsPlaying(true);
        if (!preview) {
          markListened(podcast.id);
          touchStreak();
          setListenedIds(getListened());
          setStreak(getStreak());
        }
      } catch {
        setIsPlaying(false);
        setAudioMessage(
          "Playback could not start. Check the audio URL or connection.",
        );
      }
    },
    [pickQuality, muted, volume, rate, clearAutoPlay],
  );

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (!audio.src) {
      await selectPodcast(playing);
      return;
    }
    try {
      await audio.play();
      setIsPlaying(true);
      setAudioMessage("");
    } catch {
      setAudioMessage("Playback could not resume. Check your connection.");
    }
  }, [isPlaying, playing, selectPodcast]);

  const seek = useCallback((t: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = t;
    setCurrentTime(t);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((old) => {
      const adding = !old.includes(id);
      const next = adding ? [...old, id] : old.filter((x) => x !== id);
      setSaveToast(adding ? "Added to library ✓" : "Removed from library");
      setTimeout(() => setSaveToast(""), 2200);
      return next;
    });
  }, []);

  const toggleLiked = useCallback((id: string) => {
    setLiked((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  }, []);

  const skipTo = useCallback(
    (delta: number) => {
      if (!playing || podcasts.length === 0) return;
      const idx = podcasts.findIndex((p) => p.id === playing.id);
      const next = shuffle
        ? podcasts[Math.floor(Math.random() * podcasts.length)]
        : podcasts[(idx + delta + podcasts.length) % podcasts.length];
      selectPodcast(next);
    },
    [playing, podcasts, shuffle, selectPodcast],
  );

  const addToPlaylist = useCallback((playlistId: string, episodeId: string) => {
    setPlaylists((prev) => {
      const updated = prev.map((pl) =>
        pl.id === playlistId && !pl.episodeIds.includes(episodeId)
          ? { ...pl, episodeIds: [...pl.episodeIds, episodeId] }
          : pl,
      );
      savePlaylists(updated);
      return updated;
    });
  }, []);

  const createPlaylist = useCallback((name: string) => {
    const pl: Playlist = { id: `pl-${Date.now()}`, name, episodeIds: [] };
    setPlaylists((prev) => {
      const next = [...prev, pl];
      savePlaylists(next);
      return next;
    });
  }, []);

  /* ── derived ── */
  const categories = useMemo(
    () => ["All", ...new Set(podcasts.map((p) => p.category))],
    [podcasts],
  );
  const shows = useMemo(() => {
    const m = new Map<string, Podcast>();
    for (const p of podcasts) {
      const k = (p as Podcast & { showId?: string }).showId ?? p.title;
      if (!m.has(k)) m.set(k, p);
    }
    return [...m.values()];
  }, [podcasts]);
  const filtered = useMemo(
    () =>
      podcasts.filter(
        (p) =>
          (activeCategory === "All" || p.category === activeCategory) &&
          `${p.title} ${p.host} ${p.episode} ${p.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [podcasts, activeCategory, query],
  );

  const recommended = useMemo(() => {
    if (podcasts.length === 0) return [];
    const unheard = podcasts.filter((p) => !listenedIds.includes(p.id));
    return (unheard.length > 0 ? unheard : podcasts).slice(0, 6);
  }, [podcasts, listenedIds]);

  const curatedEpisodes = useMemo(() => {
    if (!activeCurated) return [];
    const idx = CURATED.findIndex((c) => c.id === activeCurated);
    return podcasts.filter((_, i) => i % CURATED.length === idx).slice(0, 8);
  }, [activeCurated, podcasts]);

  const activePlaylistEpisodes = useMemo(() => {
    const pl = playlists.find((p) => p.id === activeCurated);
    if (!pl) return [];
    return pl.episodeIds
      .map((id) => podcasts.find((p) => p.id === id))
      .filter(Boolean) as Podcast[];
  }, [activeCurated, playlists, podcasts]);

  let emptyHeading = "No episodes found";
  let emptyDescription = "Try another search or category.";
  if (catalogStatus === "loading") {
    emptyHeading = "Loading episodes...";
    emptyDescription = "The podcast catalog is on its way.";
  } else if (catalogStatus === "error") {
    emptyHeading = "Podcast catalog unavailable";
    emptyDescription = catalogError;
  }

  /* ══ RENDER ══ */
  return (
    // sits below the global sticky nav (64px). player bar is fixed at bottom.
    <div
      className="flex overflow-hidden text-[#f5f5f2]"
      style={{ background: "#0a0a0a", height: "calc(100vh - 36px)" }}
    >
      {/* ══ SIDEBAR ══ */}
      {/* On desktop: always visible as a static flex child.
          On mobile: slides in as a fixed overlay from the left. */}
      <aside
        className="hidden lg:flex w-64 shrink-0 flex-col"
        style={{ background: "#111", borderRight: "1px solid #1f1f1f" }}
      >
        {/* nav */}
        <nav
          className="px-3 py-4 space-y-1"
          style={{ borderBottom: "1px solid #1f1f1f" }}
        >
          {(
            [
              { id: "home", icon: Home, label: "Home" },
              { id: "library", icon: Library, label: "Your Library" },
              { id: "favorites", icon: Heart, label: "Liked Episodes" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setSidebarView(id);
                setActiveCurated(null);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all"
              style={
                sidebarView === id && activeCurated === null
                  ? { background: "#1f1f1f", color: "var(--lime)" }
                  : { color: "#999" }
              }
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* curated playlists */}
        <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
          <p
            className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#555" }}
          >
            Curated
          </p>
          {CURATED.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCurated(c.id);
                setSidebarView("playlist");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
              style={
                activeCurated === c.id
                  ? { background: "#1f1f1f", color: "#fff" }
                  : { color: "#888" }
              }
            >
              <span
                className="size-7 rounded shrink-0 flex items-center justify-center text-[10px] font-black"
                style={{ background: c.color, color: c.accent }}
              >
                {c.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="truncate text-xs font-semibold">{c.name}</span>
            </button>
          ))}

          {playlists.length > 0 && (
            <>
              <p
                className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#555" }}
              >
                My Playlists
              </p>
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => {
                    setActiveCurated(pl.id);
                    setSidebarView("playlist");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
                  style={
                    activeCurated === pl.id
                      ? { background: "#1f1f1f", color: "#fff" }
                      : { color: "#888" }
                  }
                >
                  <span
                    className="size-7 rounded shrink-0 flex items-center justify-center"
                    style={{ background: "#1f1f1f" }}
                  >
                    <ListMusic size={12} style={{ color: "var(--lime)" }} />
                  </span>
                  <span className="truncate text-xs font-semibold">
                    {pl.name}
                  </span>
                </button>
              ))}
            </>
          )}

          <button
            onClick={() => {
              const name = prompt("Playlist name:");
              if (name?.trim()) createPlaylist(name.trim());
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all mt-1"
            style={{ color: "#555" }}
          >
            <span
              className="size-7 rounded flex items-center justify-center"
              style={{ border: "1px dashed #333" }}
            >
              <Plus size={12} />
            </span>
            New playlist
          </button>
        </div>

        {streak > 0 && (
          <div
            className="mx-3 mb-4 rounded-xl p-3"
            style={{ background: "#1a2a12" }}
          >
            <div className="flex items-center gap-2">
              <Flame size={14} style={{ color: "var(--lime)" }} />
              <span
                className="text-xs font-bold"
                style={{ color: "var(--lime)" }}
              >
                {streak}-day streak
              </span>
            </div>
            <p className="mt-1 text-[10px]" style={{ color: "#6a8a4a" }}>
              {listenedIds.length} episodes listened
            </p>
          </div>
        )}
      </aside>

      {/* Mobile sidebar — slides in as fixed overlay below the global nav */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 bottom-0 z-40 bg-black/60 lg:hidden"
              style={{ top: 36 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 z-50 flex w-64 flex-col lg:hidden"
              style={{
                top: 36,
                background: "#111",
                borderRight: "1px solid #1f1f1f",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid #1f1f1f" }}
              >
                <span
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: "var(--lime)" }}
                >
                  Podcasts
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{ color: "#555" }}
                >
                  <X size={15} />
                </button>
              </div>
              <nav
                className="px-3 py-4 space-y-1"
                style={{ borderBottom: "1px solid #1f1f1f" }}
              >
                {(
                  [
                    { id: "home", icon: Home, label: "Home" },
                    { id: "library", icon: Library, label: "Your Library" },
                    { id: "favorites", icon: Heart, label: "Liked Episodes" },
                  ] as const
                ).map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSidebarView(id);
                      setActiveCurated(null);
                      setSidebarOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all"
                    style={
                      sidebarView === id && activeCurated === null
                        ? { background: "#1f1f1f", color: "var(--lime)" }
                        : { color: "#999" }
                    }
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                ))}
              </nav>
              <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
                <p
                  className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#555" }}
                >
                  Curated
                </p>
                {CURATED.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCurated(c.id);
                      setSidebarView("playlist");
                      setSidebarOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
                    style={
                      activeCurated === c.id
                        ? { background: "#1f1f1f", color: "#fff" }
                        : { color: "#888" }
                    }
                  >
                    <span
                      className="size-7 rounded shrink-0 flex items-center justify-center text-[10px] font-black"
                      style={{ background: c.color, color: c.accent }}
                    >
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="truncate text-xs font-semibold">
                      {c.name}
                    </span>
                  </button>
                ))}
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      setActiveCurated(pl.id);
                      setSidebarView("playlist");
                      setSidebarOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
                    style={
                      activeCurated === pl.id
                        ? { background: "#1f1f1f", color: "#fff" }
                        : { color: "#888" }
                    }
                  >
                    <span
                      className="size-7 rounded shrink-0 flex items-center justify-center"
                      style={{ background: "#1f1f1f" }}
                    >
                      <ListMusic size={12} style={{ color: "var(--lime)" }} />
                    </span>
                    <span className="truncate text-xs font-semibold">
                      {pl.name}
                    </span>
                  </button>
                ))}
              </div>
              {streak > 0 && (
                <div
                  className="mx-3 mb-4 rounded-xl p-3"
                  style={{ background: "#1a2a12" }}
                >
                  <div className="flex items-center gap-2">
                    <Flame size={14} style={{ color: "var(--lime)" }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--lime)" }}
                    >
                      {streak}-day streak
                    </span>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══ MAIN AREA ══ */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* in-page subheader: mobile sidebar toggle + search */}
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3 sm:px-6"
          style={{ borderBottom: "1px solid #1f1f1f", background: "#0f0f0f" }}
        >
          {/* mobile: open podcast sidebar */}
          <button
            className="lg:hidden flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
            style={{
              background: "#1a1a1a",
              color: "#888",
              border: "1px solid #2a2a2a",
            }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={14} /> Library
          </button>
          <div className="relative flex-1 max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#555" }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search episodes…"
              className="w-full rounded-full py-1.5 pl-8 pr-4 text-sm outline-none text-white placeholder:text-[#555]"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#555" }}
              >
                <X size={12} />
              </button>
            )}
          </div>
          {streak > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ml-auto"
              style={{ background: "#1a2a12", color: "var(--lime)" }}
            >
              <Flame size={11} />
              {streak}d streak
            </div>
          )}
        </header>

        {/* scrollable content */}
        <main
          className="flex-1 overflow-y-auto pb-32"
          style={{ background: "#0f0f0f" }}
        >
          {/* ── HOME VIEW ── */}
          {(sidebarView === "home" || query) && (
            <div className="px-4 py-6 sm:px-6 space-y-10">
              {/* while loading */}
              {catalogStatus === "loading" && waitVerse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 items-start rounded-2xl p-5"
                  style={{ background: "#0e1f1a", border: "1px solid #1e3a2a" }}
                >
                  <BookOpen
                    size={16}
                    style={{
                      color: "var(--lime)",
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: "var(--lime)" }}
                    >
                      While you wait
                    </p>
                    <p className="text-sm font-bold text-white">
                      {waitVerse.title}
                    </p>
                    <p
                      className="mt-1 text-sm leading-6"
                      style={{ color: "#888" }}
                    >
                      &ldquo;{waitVerse.verse_text}&rdquo;
                    </p>
                  </div>
                </motion.div>
              )}

              {/* skeletons */}
              {catalogStatus === "loading" && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 animate-pulse"
                      style={{ background: "#161616" }}
                    >
                      <div
                        className="aspect-square w-full rounded-lg mb-3"
                        style={{ background: "#222" }}
                      />
                      <div
                        className="h-3 w-3/4 rounded mb-2"
                        style={{ background: "#222" }}
                      />
                      <div
                        className="h-2.5 w-1/2 rounded"
                        style={{ background: "#1a1a1a" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* featured hero */}
              {podcasts[0] && !query && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #0e2a1e 0%, #1a1a2e 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background:
                          "radial-gradient(circle at 80% 20%, var(--lime), transparent 60%)",
                      }}
                    />
                    <div className="relative grid md:grid-cols-[280px_1fr] gap-0">
                      <CoverArt
                        podcast={podcasts[0]}
                        className="aspect-square w-full md:rounded-l-2xl md:rounded-r-none"
                      />
                      <div className="flex flex-col justify-center p-6 sm:p-8">
                        <span
                          className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest w-fit"
                          style={{
                            background: "rgba(215,251,102,0.15)",
                            color: "var(--lime)",
                          }}
                        >
                          <Radio size={9} /> Featured
                        </span>
                        <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl mt-2">
                          {podcasts[0].episode}
                        </h2>
                        <p className="mt-2 text-sm" style={{ color: "#888" }}>
                          {podcasts[0].title} · {podcasts[0].host} ·{" "}
                          {podcasts[0].duration}
                        </p>
                        <p
                          className="mt-3 text-sm leading-6 line-clamp-2"
                          style={{ color: "#666" }}
                        >
                          {podcasts[0].description}
                        </p>
                        <div className="mt-5 flex gap-3">
                          <button
                            onClick={() => selectPodcast(podcasts[0])}
                            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-85"
                            style={{ background: "var(--lime)", color: "#111" }}
                          >
                            <Play size={14} fill="currentColor" /> Play
                          </button>
                          <button
                            onClick={() => selectPodcast(podcasts[0], true)}
                            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                            style={{ border: "1px solid #333", color: "#aaa" }}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => toggleLiked(podcasts[0].id)}
                            className="grid size-10 place-items-center rounded-full transition-all"
                            style={{
                              border: "1px solid #333",
                              color: liked.includes(podcasts[0].id)
                                ? "var(--lime)"
                                : "#666",
                            }}
                          >
                            <Heart
                              size={15}
                              fill={
                                liked.includes(podcasts[0].id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* recommended */}
              {recommended.length > 0 && !query && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-white">
                      Recommended for you
                    </h2>
                    <button
                      className="text-xs font-semibold flex items-center gap-1"
                      style={{ color: "var(--lime)" }}
                    >
                      See all <ChevronRight size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {recommended.map((p) => (
                      <article
                        key={p.id}
                        className="group cursor-pointer"
                        onClick={() => selectPodcast(p)}
                      >
                        <div className="relative mb-2 overflow-hidden rounded-xl">
                          <CoverArt
                            podcast={p}
                            className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                            <div
                              className="grid size-10 place-items-center rounded-full opacity-0 transition-all group-hover:opacity-100 shadow-lg"
                              style={{ background: "var(--lime)" }}
                            >
                              <Play size={14} fill="#111" color="#111" />
                            </div>
                          </div>
                        </div>
                        <p className="truncate text-xs font-bold text-white">
                          {p.episode}
                        </p>
                        <p
                          className="truncate text-[11px] mt-0.5"
                          style={{ color: "#666" }}
                        >
                          {p.host}
                        </p>
                      </article>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* curated shelf */}
              {!query && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="text-lg font-black text-white mb-4">
                    Curated playlists
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {CURATED.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCurated(c.id);
                          setSidebarView("playlist");
                        }}
                        className="relative overflow-hidden rounded-xl p-4 text-left transition-transform hover:scale-[1.02]"
                        style={{ background: c.color, minHeight: 80 }}
                      >
                        <p className="text-xs font-black text-white leading-tight">
                          {c.name}
                        </p>
                        <div
                          className="absolute -bottom-3 -right-3 size-16 rounded-full opacity-30"
                          style={{ background: c.accent }}
                        />
                        <Mic2
                          size={20}
                          className="mt-3"
                          style={{ color: c.accent }}
                        />
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* category pills */}
              {!query && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
                      style={
                        activeCategory === c
                          ? { background: "var(--lime)", color: "#111" }
                          : {
                              background: "#1a1a1a",
                              color: "#888",
                              border: "1px solid #2a2a2a",
                            }
                      }
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* episode list */}
              <section>
                {!query && (
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-white">
                      {activeCategory === "All"
                        ? "All episodes"
                        : activeCategory}
                    </h2>
                    <span className="text-xs" style={{ color: "#555" }}>
                      {filtered.length} episodes
                    </span>
                  </div>
                )}
                {query && (
                  <p className="mb-4 text-sm" style={{ color: "#888" }}>
                    Results for &ldquo;{query}&rdquo;
                  </p>
                )}

                {filtered.length === 0 ? (
                  <div className="py-16 text-center">
                    <Search
                      size={32}
                      className="mx-auto mb-3"
                      style={{ color: "#333" }}
                    />
                    <p className="font-bold text-white">{emptyHeading}</p>
                    <p className="mt-1 text-sm" style={{ color: "#666" }}>
                      {emptyDescription}
                    </p>
                    {catalogStatus === "error" && (
                      <button
                        onClick={() => void loadCatalog()}
                        className="mt-4 text-sm font-bold hover:underline"
                        style={{ color: "var(--lime)" }}
                      >
                        Try again
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filtered.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all sm:gap-4"
                        style={{
                          background:
                            playing?.id === p.id ? "#1a1a1a" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (playing?.id !== p.id)
                            e.currentTarget.style.background = "#141414";
                        }}
                        onMouseLeave={(e) => {
                          if (playing?.id !== p.id)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* index / play */}
                        <div className="relative w-8 shrink-0 text-center">
                          <span
                            className="text-sm tabular-nums group-hover:hidden"
                            style={{
                              color:
                                playing?.id === p.id ? "var(--lime)" : "#555",
                            }}
                          >
                            {playing?.id === p.id && isPlaying ? (
                              <span className="flex items-end justify-center gap-px h-4">
                                {[3, 5, 4].map((h, k) => (
                                  <span
                                    key={k}
                                    className="w-0.5 rounded-full animate-pulse"
                                    style={{
                                      height: h * 3,
                                      background: "var(--lime)",
                                      animationDelay: `${k * 0.15}s`,
                                    }}
                                  />
                                ))}
                              </span>
                            ) : (
                              i + 1
                            )}
                          </span>
                          <button
                            onClick={() =>
                              playing?.id === p.id
                                ? togglePlayback()
                                : selectPodcast(p)
                            }
                            className="hidden group-hover:flex items-center justify-center w-full"
                            aria-label={`Play ${p.episode}`}
                          >
                            {playing?.id === p.id && isPlaying ? (
                              <Pause
                                size={15}
                                fill="currentColor"
                                style={{ color: "var(--lime)" }}
                              />
                            ) : (
                              <Play
                                size={15}
                                fill="currentColor"
                                className="text-white"
                              />
                            )}
                          </button>
                        </div>
                        {/* cover */}
                        <div className="relative shrink-0">
                          <CoverArt
                            podcast={p}
                            className={`aspect-square w-10 rounded-lg ${listenedIds.includes(p.id) ? "opacity-50" : ""}`}
                          />
                          {listenedIds.includes(p.id) && (
                            <span
                              className="absolute -bottom-1 -right-1 grid size-3.5 place-items-center rounded-full"
                              style={{ background: "var(--lime)" }}
                            >
                              <Check size={8} color="#111" />
                            </span>
                          )}
                        </div>
                        {/* info */}
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{
                              color:
                                playing?.id === p.id ? "var(--lime)" : "#fff",
                            }}
                          >
                            {p.episode}
                          </p>
                          <p
                            className="truncate text-xs mt-0.5"
                            style={{ color: "#666" }}
                          >
                            {p.title} · {p.host}
                          </p>
                        </div>
                        {/* duration */}
                        <div
                          className="hidden items-center gap-1 text-xs sm:flex shrink-0"
                          style={{ color: "#555" }}
                        >
                          <Clock3 size={11} />
                          {p.duration}
                        </div>
                        {/* actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleLiked(p.id)}
                            className="grid size-7 place-items-center rounded-full transition-colors"
                            style={{
                              color: liked.includes(p.id)
                                ? "var(--lime)"
                                : "#555",
                            }}
                          >
                            <Heart
                              size={13}
                              fill={
                                liked.includes(p.id) ? "currentColor" : "none"
                              }
                            />
                          </button>
                          <button
                            onClick={() => toggleSaved(p.id)}
                            className="grid size-7 place-items-center rounded-full transition-colors"
                            style={{
                              color: saved.includes(p.id)
                                ? "var(--lime)"
                                : "#555",
                            }}
                          >
                            {saved.includes(p.id) ? (
                              <Check size={13} />
                            ) : (
                              <Bookmark size={13} />
                            )}
                          </button>
                          {playlists.length > 0 && (
                            <button
                              onClick={() => {
                                if (playlists[0])
                                  addToPlaylist(playlists[0].id, p.id);
                              }}
                              className="grid size-7 place-items-center rounded-full transition-colors"
                              style={{ color: "#555" }}
                            >
                              <Plus size={13} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ── LIBRARY VIEW ── */}
          {sidebarView === "library" && !query && (
            <div className="px-4 py-6 sm:px-6">
              <h1 className="text-2xl font-black text-white mb-6">
                Your Library
              </h1>
              {saved.length === 0 ? (
                <div className="py-20 text-center">
                  <Library
                    size={40}
                    className="mx-auto mb-4"
                    style={{ color: "#333" }}
                  />
                  <p className="font-bold text-white">Nothing saved yet</p>
                  <p className="mt-1 text-sm" style={{ color: "#666" }}>
                    Bookmark episodes to find them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {saved
                    .map((id) => podcasts.find((p) => p.id === id))
                    .filter(Boolean)
                    .map((p) => {
                      const ep = p as Podcast;
                      return (
                        <div
                          key={ep.id}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                          style={{
                            background:
                              playing?.id === ep.id ? "#1a1a1a" : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (playing?.id !== ep.id)
                              e.currentTarget.style.background = "#141414";
                          }}
                          onMouseLeave={(e) => {
                            if (playing?.id !== ep.id)
                              e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <CoverArt
                            podcast={ep}
                            className="aspect-square w-12 rounded-lg shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                              {ep.episode}
                            </p>
                            <p
                              className="truncate text-xs mt-0.5"
                              style={{ color: "#666" }}
                            >
                              {ep.title} · {ep.duration}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => selectPodcast(ep)}
                              className="grid size-8 place-items-center rounded-full"
                              style={{ background: "var(--lime)" }}
                            >
                              <Play size={13} fill="#111" color="#111" />
                            </button>
                            <button
                              onClick={() => toggleSaved(ep.id)}
                              className="grid size-7 place-items-center rounded-full"
                              style={{ color: "#555" }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* ── FAVORITES VIEW ── */}
          {sidebarView === "favorites" && !query && (
            <div className="px-4 py-6 sm:px-6">
              <h1 className="text-2xl font-black text-white mb-6">
                Liked Episodes
              </h1>
              {liked.length === 0 ? (
                <div className="py-20 text-center">
                  <Heart
                    size={40}
                    className="mx-auto mb-4"
                    style={{ color: "#333" }}
                  />
                  <p className="font-bold text-white">No liked episodes yet</p>
                  <p className="mt-1 text-sm" style={{ color: "#666" }}>
                    Heart an episode to save it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {liked
                    .map((id) => podcasts.find((p) => p.id === id))
                    .filter(Boolean)
                    .map((p) => {
                      const ep = p as Podcast;
                      return (
                        <div
                          key={ep.id}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#141414")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <CoverArt
                            podcast={ep}
                            className="aspect-square w-12 rounded-lg shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                              {ep.episode}
                            </p>
                            <p
                              className="truncate text-xs mt-0.5"
                              style={{ color: "#666" }}
                            >
                              {ep.title} · {ep.duration}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => selectPodcast(ep)}
                              className="grid size-8 place-items-center rounded-full"
                              style={{ background: "var(--lime)" }}
                            >
                              <Play size={13} fill="#111" color="#111" />
                            </button>
                            <button
                              onClick={() => toggleLiked(ep.id)}
                              className="grid size-7 place-items-center rounded-full"
                              style={{ color: "var(--lime)" }}
                            >
                              <Heart size={13} fill="currentColor" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* ── PLAYLIST VIEW ── */}
          {sidebarView === "playlist" &&
            activeCurated &&
            !query &&
            (() => {
              const curated = CURATED.find((c) => c.id === activeCurated);
              const userPl = playlists.find((p) => p.id === activeCurated);
              const episodes = curated
                ? curatedEpisodes
                : activePlaylistEpisodes;
              const title = curated?.name ?? userPl?.name ?? "Playlist";
              const accent = curated?.accent ?? "var(--lime)";
              const bg = curated?.color ?? "#1a1a1a";
              return (
                <div className="px-4 py-6 sm:px-6">
                  <div
                    className="flex items-end gap-5 mb-8 p-6 rounded-2xl"
                    style={{ background: bg }}
                  >
                    <div
                      className="size-28 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(0,0,0,0.3)" }}
                    >
                      <Mic2 size={40} style={{ color: accent }} />
                    </div>
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{ color: accent }}
                      >
                        Playlist
                      </p>
                      <h1 className="text-3xl font-black text-white">
                        {title}
                      </h1>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {episodes.length} episodes
                      </p>
                      <div className="mt-4 flex gap-3">
                        {episodes[0] && (
                          <button
                            onClick={() => selectPodcast(episodes[0])}
                            className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold"
                            style={{ background: accent, color: "#111" }}
                          >
                            <Play size={14} fill="currentColor" /> Play all
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {episodes.length === 0 ? (
                    <p
                      className="text-sm text-center py-10"
                      style={{ color: "#555" }}
                    >
                      No episodes yet.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {episodes.map((p, i) => (
                        <div
                          key={p.id}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#141414")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <span
                            className="w-6 text-center text-sm tabular-nums shrink-0"
                            style={{ color: "#555" }}
                          >
                            {i + 1}
                          </span>
                          <CoverArt
                            podcast={p}
                            className="aspect-square w-10 rounded-lg shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                              {p.episode}
                            </p>
                            <p
                              className="truncate text-xs mt-0.5"
                              style={{ color: "#666" }}
                            >
                              {p.host} · {p.duration}
                            </p>
                          </div>
                          <button
                            onClick={() => selectPodcast(p)}
                            className="grid size-8 place-items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: "var(--lime)" }}
                          >
                            <Play size={13} fill="#111" color="#111" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
        </main>
      </div>
      {/* end main area */}

      {/* ══ PLAYER BAR ══ */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="fixed inset-x-0 bottom-0 z-40 lg:left-64"
            style={{
              background: "rgba(15,15,15,0.97)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid #1f1f1f",
            }}
          >
            {/* seek bar — full width, clickable */}
            <div
              className="relative h-1 w-full cursor-pointer group"
              style={{ background: "#2a2a2a" }}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                seek(((e.clientX - r.left) / r.width) * (duration || 0));
              }}
            >
              <div
                className="h-full transition-all duration-150 group-hover:h-1.5 -mt-px"
                style={{
                  width:
                    duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                  background: "var(--lime)",
                  transition: "width 0.3s linear",
                }}
              />
            </div>

            {/* auto-play banner */}
            <AnimatePresence>
              {nextUp && autoPlayCountdown !== null && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex items-center justify-between gap-3 overflow-hidden px-4 py-2 text-xs"
                  style={{
                    borderBottom: "1px solid #1f1f1f",
                    background: "#111",
                  }}
                >
                  <span style={{ color: "#888" }}>
                    Up next:{" "}
                    <span className="font-semibold text-white">
                      {nextUp.episode}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums" style={{ color: "#555" }}>
                      in {autoPlayCountdown}s
                    </span>
                    <button
                      onClick={() => selectPodcast(nextUp)}
                      className="rounded-full px-3 py-0.5 text-xs font-bold"
                      style={{ background: "var(--lime)", color: "#111" }}
                    >
                      Play now
                    </button>
                    <button onClick={clearAutoPlay} style={{ color: "#555" }}>
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* preview banner */}
            <AnimatePresence>
              {isPreview && previewCountdown !== null && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex items-center justify-between overflow-hidden px-4 py-1.5 text-xs"
                  style={{
                    borderBottom: "1px solid #1a2a12",
                    background: "#0e1f1a",
                  }}
                >
                  <span className="font-bold" style={{ color: "var(--lime)" }}>
                    Preview mode
                  </span>
                  <span
                    className="tabular-nums"
                    style={{ color: "var(--lime)" }}
                  >
                    Ends in {previewCountdown}s
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex h-[72px] items-center gap-2 px-3 sm:gap-4 sm:px-6">
              {/* cover + info */}
              <div className="flex items-center gap-3 w-[30%] min-w-0 shrink-0">
                <div className="relative shrink-0">
                  <CoverArt
                    podcast={playing}
                    className="aspect-square w-12 rounded-lg"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white leading-tight">
                    {playing.episode}
                  </p>
                  <p
                    className="truncate text-xs mt-0.5"
                    style={{ color: "#666" }}
                  >
                    {playing.title}
                  </p>
                </div>
                <button
                  onClick={() => toggleLiked(playing.id)}
                  className="shrink-0 ml-1 transition-colors"
                  style={{
                    color: liked.includes(playing.id) ? "var(--lime)" : "#444",
                  }}
                >
                  <Heart
                    size={15}
                    fill={liked.includes(playing.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* controls */}
              <div className="flex flex-1 flex-col items-center gap-1">
                <div className="flex items-center gap-3 sm:gap-5">
                  <button
                    onClick={() => setShuffle((s) => !s)}
                    className="hidden sm:block transition-colors"
                    style={{ color: shuffle ? "var(--lime)" : "#555" }}
                  >
                    <Shuffle size={14} />
                  </button>
                  <button
                    onClick={() => skipTo(-1)}
                    className="transition-colors hover:text-white"
                    style={{ color: "#666" }}
                  >
                    <SkipBack size={18} fill="currentColor" />
                  </button>
                  <button
                    onClick={togglePlayback}
                    className="grid size-10 place-items-center rounded-full transition-transform hover:scale-105"
                    style={{ background: "var(--lime)" }}
                  >
                    {isPlaying ? (
                      <Pause size={17} fill="#111" color="#111" />
                    ) : (
                      <Play size={17} fill="#111" color="#111" />
                    )}
                  </button>
                  <button
                    onClick={() => skipTo(1)}
                    className="transition-colors hover:text-white"
                    style={{ color: "#666" }}
                  >
                    <SkipForward size={18} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => setRepeat((r) => !r)}
                    className="hidden sm:block transition-colors"
                    style={{ color: repeat ? "var(--lime)" : "#555" }}
                  >
                    <Repeat size={14} />
                  </button>
                </div>
                {/* waveform + times */}
                <div className="hidden w-full max-w-sm items-center gap-2 sm:flex">
                  <span
                    className="text-[10px] tabular-nums w-12 text-right shrink-0"
                    style={{ color: "#555" }}
                  >
                    {fmt(currentTime)}
                  </span>
                  <Waveform
                    id={playing.id}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={seek}
                  />
                  <span
                    className="text-[10px] tabular-nums w-12 shrink-0"
                    style={{ color: "#555" }}
                  >
                    {duration ? fmt(duration) : playing.duration}
                  </span>
                </div>
              </div>

              {/* right controls */}
              <div className="flex items-center gap-2 w-[30%] justify-end shrink-0">
                <button
                  onClick={() => {
                    const next =
                      RATES[(RATES.indexOf(rate) + 1) % RATES.length];
                    setRate(next);
                    savePrefs({ rate: next });
                  }}
                  className="hidden sm:block text-[11px] font-bold tabular-nums rounded-full px-2 py-0.5 transition-colors"
                  style={{
                    color: rate !== 1 ? "var(--lime)" : "#555",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  {rate}×
                </button>
                <label
                  className="hidden md:flex items-center gap-1 text-[10px]"
                  style={{ color: "#555" }}
                >
                  <Gauge size={12} />
                  <select
                    value={mode}
                    onChange={(e) => {
                      const m = e.target.value as QualityMode;
                      setMode(m);
                      savePrefs({ mode: m });
                    }}
                    className="bg-transparent text-[11px] outline-none cursor-pointer"
                    style={{ color: "#666" }}
                  >
                    <option value="auto">Auto</option>
                    <option value="low">Low</option>
                    <option value="medium">Med</option>
                    <option value="high">High</option>
                    <option value="lossless">FLAC</option>
                  </select>
                </label>
                <button
                  onClick={() => {
                    setMuted(!muted);
                    savePrefs({ muted: !muted });
                  }}
                  className="transition-colors hover:text-white"
                  style={{ color: "#555" }}
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={15} />
                  ) : (
                    <Volume2 size={15} />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    setMuted(false);
                    savePrefs({ volume: v, muted: false });
                  }}
                  className="hidden sm:block w-20 cursor-pointer"
                  style={{ accentColor: "var(--lime)", height: "3px" }}
                  aria-label="Volume"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ TOASTS ══ */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="status"
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-xl"
            style={{
              background: "#1a2a12",
              border: "1px solid var(--lime)",
              color: "var(--lime)",
            }}
          >
            {saveToast}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {audioMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="status"
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2.5 text-sm shadow-xl"
            style={{
              background: "#1f1f1f",
              border: "1px solid #333",
              color: "#ccc",
            }}
          >
            {audioMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <CookieConsent />

      {/* ══ AUDIO ══ */}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setCurrentTime(t);
          if (playing)
            writeCookie(
              RESUME_COOKIE,
              JSON.stringify({ id: playing.id, t }),
              30,
            );
          if (isPreview && playing) {
            const end =
              (playing.preview?.start ?? 0) + (playing.preview?.length ?? 30);
            if (t >= end) {
              e.currentTarget.pause();
              setIsPlaying(false);
              setIsPreview(false);
              setPreviewCountdown(null);
              if (previewCountRef.current)
                clearInterval(previewCountRef.current);
              setAudioMessage("Preview finished.");
            }
          }
        }}
        onLoadedMetadata={(e) =>
          setDuration(
            Number.isFinite(e.currentTarget.duration)
              ? e.currentTarget.duration
              : 0,
          )
        }
        onEnded={() => {
          setIsPlaying(false);
          setIsPreview(false);
          setPreviewCountdown(null);
          if (previewCountRef.current) clearInterval(previewCountRef.current);
          if (repeat && playing) {
            selectPodcast(playing);
            return;
          }
          if (playing && podcasts.length > 1) {
            const idx = podcasts.findIndex((p) => p.id === playing.id);
            const next = shuffle
              ? podcasts[Math.floor(Math.random() * podcasts.length)]
              : podcasts[(idx + 1) % podcasts.length];
            setNextUp(next);
            let count = 5;
            setAutoPlayCountdown(count);
            autoPlayRef.current = setInterval(() => {
              count -= 1;
              if (count <= 0) {
                clearInterval(autoPlayRef.current!);
                setAutoPlayCountdown(null);
                setNextUp(null);
                selectPodcast(next);
              } else setAutoPlayCountdown(count);
            }, 1000);
          }
        }}
        onError={() => {
          if (audioRef.current?.src) {
            setIsPlaying(false);
            setAudioMessage("Audio failed to load.");
          }
        }}
      />
    </div>
  );
}
