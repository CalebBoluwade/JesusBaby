"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { BookOpen, Check, Share2, Star, MessageCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import { getPosts, ratePost } from "@/app/blog/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BibleReferenceText } from "@/components/BibleReferenceText";

type Post = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_image: string | null;
  created_at: string | null;
  rating_average: string | null;
  rating_count: number;
};

const PAGE_SIZE = 8;
type SortOrder = "newest" | "top-rated";
type SocialPlatform = "x" | "facebook" | "linkedin" | "telegram" | "email";

function getMatchingPosts(posts: Post[], query: string, sortBy: SortOrder) {
  const q = query.trim().toLocaleLowerCase();
  const matching = posts.filter((p) =>
    !q || [p.title, p.excerpt, p.content, p.author_name].some((v) => v.toLocaleLowerCase().includes(q))
  );
  return matching.sort((a, b) =>
    sortBy === "top-rated"
      ? (Number(b.rating_average ?? 0) - Number(a.rating_average ?? 0)) || b.rating_count - a.rating_count
      : new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );
}

function LoadingStories() {
  return (
    <div className="divide-y divide-app-line border-y border-app-line" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse py-5">
          <div className="mb-3 h-2.5 w-32 rounded bg-app-card" />
          <div className="h-5 w-3/4 rounded bg-app-card" />
          <div className="mt-2 h-3.5 w-full max-w-2xl rounded bg-app-panel" />
        </div>
      ))}
    </div>
  );
}

function EmptyStories({ hasPosts }: Readonly<{ hasPosts: boolean }>) {
  return (
    <div className="py-12 text-center border-y border-app-line">
      <p className="text-lg font-bold text-app-text">{hasPosts ? "No stories match that search." : "The first story is still being written."}</p>
      <p className="mt-1 text-sm text-app-muted2">
        {hasPosts ? "Try a different name, phrase, or scripture reference." : "Check back soon for reflections from the community."}
      </p>
    </div>
  );
}

function JournalPost({ post, index, isExpanded, rating, copied, onToggle, onRate, onShare, onWhatsapp, onSocialShare }: Readonly<{
  post: Post; index: number; isExpanded: boolean; rating: number; copied: boolean;
  onToggle: () => void; onRate: (v: number) => void; onShare: () => void;
  onWhatsapp: () => void; onSocialShare: (p: SocialPlatform) => void;
}>) {
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Community post";
  const readingMinutes = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200));
  const averageRating = Number(post.rating_average ?? 0);

  return (
    <article id={`post-${post.id}`} className="scroll-mt-24 grid gap-3 py-5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6 border-b border-app-line">
      <div className="hidden pt-0.5 sm:block">
        <p className="font-serif text-xl font-bold text-app-lime">{String(index + 1).padStart(2, "0")}</p>
        <div className="mt-2 h-px w-6 bg-app-line" />
      </div>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Avatar className="size-7">
            <AvatarImage src={post.author_image ?? undefined} alt={`${post.author_name}'s profile`} />
            <AvatarFallback className="text-xs font-bold bg-app-lime-dim text-app-lime">
              {post.author_name.trim().charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-app-text">{post.author_name}</span>
          <span className="text-xs text-app-muted">{formattedDate}</span>
          <span className="text-xs text-app-muted">{readingMinutes} min read</span>
        </div>

        <h3 className="max-w-3xl text-xl font-black leading-tight tracking-tight text-app-text sm:text-2xl">{post.title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-app-muted">
          <BibleReferenceText text={post.excerpt} />
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={`post-body-${post.id}`}
            onClick={onToggle}
            className="inline-flex min-h-9 items-center gap-1.5 border-b border-app-lime text-sm font-bold text-app-lime transition-colors"
          >
            {isExpanded ? "Close story" : "Read full story"}
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <p className="flex items-center gap-1 text-xs text-app-muted">
            <Star className="h-3 w-3 text-app-lime" />
            {averageRating ? averageRating.toFixed(1) : "New"} ({post.rating_count})
          </p>
        </div>

        {isExpanded && (
          <div id={`post-body-${post.id}`} className="mt-5 border-l-2 border-app-line pl-4 sm:pl-5">
            <p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-app-muted">
              <BibleReferenceText text={post.content} />
            </p>
            <div className="mt-5 flex flex-col gap-4 border-t border-app-line pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-1" aria-label={`Rated ${averageRating.toFixed(1)} out of 5`}>
                <span className="mr-1.5 text-xs font-semibold text-app-muted2">Rate</span>
                {[1, 2, 3, 4, 5].map((v) => (
                  <button key={v} type="button" onClick={() => onRate(v)} aria-label={`Rate ${v} out of 5`} className="p-0.5">
                    <Star className="h-4 w-4" style={{ fill: v <= rating ? "var(--app-lime)" : "none", color: v <= rating ? "var(--app-lime)" : "var(--app-muted3)" }} />
                  </button>
                ))}
                <span className="ml-1.5 text-xs text-app-muted">{post.rating_count} ratings</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={onShare}
                  className="inline-flex min-h-9 items-center gap-1.5 border border-app-line px-3 text-xs font-bold text-app-muted transition hover:border-app-lime">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Share"}
                </button>
                <button type="button" onClick={onWhatsapp} aria-label="Share on WhatsApp"
                  className="inline-flex min-h-9 items-center gap-1.5 bg-app-lime-dim px-3 text-xs font-bold text-app-lime transition">
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </button>
                {(["x", "facebook", "linkedin", "telegram", "email"] as const).map((platform) => (
                  <button key={platform} type="button" onClick={() => onSocialShare(platform)} aria-label={`Share via ${platform}`}
                    className="min-h-9 border border-app-line px-3 text-xs font-bold capitalize text-app-muted2 transition hover:border-app-lime">
                    {platform === "x" ? "X" : platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function PublicJournal() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rated, setRated] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [sortBy, setSortBy] = useState<SortOrder>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let isActive = true;
    getPosts()
      .then((loadedPosts) => {
        if (!isActive) return;
        setPosts(loadedPosts);
        const hashMatch = /^#post-(\d+)$/.exec(window.location.hash);
        const postId = Number(hashMatch?.[1]);
        const postIndex = loadedPosts.findIndex((p) => p.id === postId);
        if (postIndex >= 0) {
          setExpandedPost(postId);
          setVisibleCount(Math.max(PAGE_SIZE, Math.ceil((postIndex + 1) / PAGE_SIZE) * PAGE_SIZE));
        }
      })
      .catch(() => { if (isActive) setHasLoadError(true); })
      .finally(() => { if (isActive) setIsLoading(false); });
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    if (expandedPost && window.location.hash === `#post-${expandedPost}`) {
      document.getElementById(`post-${expandedPost}`)?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [expandedPost, visibleCount, posts.length]);

  const matchingPosts = getMatchingPosts(posts, deferredSearch, sortBy);
  const visiblePosts = matchingPosts.slice(0, visibleCount);
  const resultsLabel = isLoading ? "Loading..." : `${Math.min(visibleCount, matchingPosts.length)} of ${matchingPosts.length}`;

  async function rate(postId: number, rating: number) {
    await ratePost(postId, rating);
    setRated((cur) => ({ ...cur, [postId]: rating }));
    setPosts((cur) => cur.map((p) =>
      p.id === postId
        ? { ...p, rating_average: String(((Number(p.rating_average ?? 0) * p.rating_count + rating) / (p.rating_count + 1)).toFixed(1)), rating_count: p.rating_count + 1 }
        : p
    ));
  }

  async function share(post: Post) {
    const url = `${window.location.origin}/journal#post-${post.id}`;
    if (navigator.share) { await navigator.share({ title: post.title, text: post.excerpt, url }).catch(() => undefined); return; }
    await navigator.clipboard.writeText(url);
    setCopied(post.id);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function whatsapp(post: Post) {
    const url = `${window.location.origin}/journal#post-${post.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " - " + url)}`, "_blank", "noopener,noreferrer");
  }

  const socialShare = (platform: SocialPlatform, post: Post) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/journal#post-${post.id}` : "";
    const text = `${post.title} — ${post.excerpt}`;
    const links = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + "\n\nRead more: " + url)}`,
    };
    if (platform === "email") { window.location.href = links.email; return; }
    window.open(links[platform], "_blank", "noopener,noreferrer,width=600,height=500");
  };

  return (
    <main className="min-h-screen bg-app-bg text-app-text px-5 py-6 sm:px-8 lg:px-12">

      {/* header */}
      <header className="mb-0 border-b border-app-line pb-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-app-lime">
            <BookOpen className="h-3.5 w-3.5" /> Community journal
          </p>
          <p className="hidden text-xs text-app-muted sm:block">Stories of faith, change, and hope</p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-app-text sm:text-4xl">
              The stories we carry forward.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-app-muted2">
              Honest reflections from people finding freedom, rebuilding, and learning to live with hope.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-3 border-l border-app-line pl-5 sm:flex">
            <span className="text-3xl font-black text-app-lime">{posts.length.toString().padStart(2, "00")}</span>
            <span className="max-w-20 text-[10px] font-bold uppercase leading-4 tracking-widest text-app-muted">community stories</span>
          </div>
        </div>
      </header>

      {/* sticky search bar */}
      <section
        aria-label="Find a journal post"
        className="sticky z-10 -mx-5 border-b border-app-line px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
        style={{ top: 36, background: "var(--nav-bg)" }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" />
            <span className="sr-only">Search journal posts</span>
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Search stories, people, or scripture"
              className="h-9 w-full border border-app-line bg-app-card pl-9 pr-4 text-sm text-app-text outline-none transition placeholder:text-app-muted3 focus:border-app-lime"
            />
          </label>
          <label className="flex h-9 items-center gap-2 border border-app-line bg-app-card px-3 text-sm sm:w-44">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-app-muted">Order</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOrder)}
              aria-label="Sort journal posts"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-app-text outline-none"
            >
              <option value="newest">Newest</option>
              <option value="top-rated">Top rated</option>
            </select>
          </label>
        </div>
      </section>

      {/* feed */}
      <section aria-label="Journal posts" className="pt-4">
        <div className="mb-1 flex items-baseline justify-between gap-4 py-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-app-muted">
            {deferredSearch.trim() ? "Search results" : "Latest reflections"}
          </h2>
          <p className="text-xs tabular-nums text-app-muted">{resultsLabel}</p>
        </div>

        {hasLoadError && (
          <div className="py-10 text-center border-y border-app-line">
            <p className="font-bold text-app-text">The journal could not load.</p>
            <p className="mt-1 text-sm text-app-muted2">Please refresh the page and try again.</p>
          </div>
        )}
        {!hasLoadError && isLoading && <LoadingStories />}
        {!hasLoadError && !isLoading && visiblePosts.length === 0 && <EmptyStories hasPosts={posts.length > 0} />}
        {!hasLoadError && !isLoading && visiblePosts.length > 0 && (
          <div className="border-t border-app-line">
            {visiblePosts.map((post, index) => (
              <JournalPost
                key={post.id}
                post={post}
                index={index}
                isExpanded={expandedPost === post.id}
                rating={rated[post.id] ?? Math.round(Number(post.rating_average ?? 0))}
                copied={copied === post.id}
                onToggle={() => setExpandedPost((cur) => cur === post.id ? null : post.id)}
                onRate={(v) => void rate(post.id, v)}
                onShare={() => void share(post)}
                onWhatsapp={() => whatsapp(post)}
                onSocialShare={(p) => socialShare(p, post)}
              />
            ))}
          </div>
        )}

        {!isLoading && visibleCount < matchingPosts.length && (
          <div className="py-6 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="min-h-9 border border-app-line px-6 text-sm font-bold text-app-muted transition hover:border-app-lime"
            >
              Load {Math.min(PAGE_SIZE, matchingPosts.length - visibleCount)} more stories
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
