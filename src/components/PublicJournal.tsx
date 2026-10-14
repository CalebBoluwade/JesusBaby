"use client";

import { useDeferredValue, useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  Share2,
  Star,
  MessageCircle,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matching = posts.filter((post) => {
    if (!normalizedQuery) return true;

    return [post.title, post.excerpt, post.content, post.author_name].some(
      (value) => value.toLocaleLowerCase().includes(normalizedQuery),
    );
  });

  return matching.sort((first, second) => {
    if (sortBy === "top-rated") {
      return (
        Number(second.rating_average ?? 0) -
          Number(first.rating_average ?? 0) ||
        second.rating_count - first.rating_count
      );
    }

    return (
      new Date(second.created_at ?? 0).getTime() -
      new Date(first.created_at ?? 0).getTime()
    );
  });
}

function LoadingStories() {
  return (
    <div
      className="divide-y divide-[#d8d7cc] border-y border-[#d8d7cc]"
      aria-hidden="true"
    >
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse py-7">
          <div className="mb-4 h-3 w-40 bg-[#deddd2]" />
          <div className="h-6 w-3/4 bg-[#deddd2]" />
          <div className="mt-3 h-4 w-full max-w-2xl bg-[#e5e4da]" />
        </div>
      ))}
    </div>
  );
}

function EmptyStories({ hasPosts }: Readonly<{ hasPosts: boolean }>) {
  return (
    <div className="border-y border-[#d8d7cc] py-14 text-center">
      <p className="text-xl font-bold">
        {hasPosts
          ? "No stories match that search."
          : "The first story is still being written."}
      </p>
      <p className="mt-2 text-sm text-[#68756e]">
        {hasPosts
          ? "Try a different name, phrase, or scripture reference."
          : "Check back soon for reflections from the community."}
      </p>
    </div>
  );
}

function JournalPost({
  post,
  index,
  isExpanded,
  rating,
  copied,
  onToggle,
  onRate,
  onShare,
  onWhatsapp,
  onSocialShare,
}: Readonly<{
  post: Post;
  index: number;
  isExpanded: boolean;
  rating: number;
  copied: boolean;
  onToggle: () => void;
  onRate: (value: number) => void;
  onShare: () => void;
  onWhatsapp: () => void;
  onSocialShare: (platform: SocialPlatform) => void;
}>) {
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Community post";
  const readingMinutes = Math.max(
    1,
    Math.ceil(post.content.trim().split(/\s+/).length / 200),
  );
  const averageRating = Number(post.rating_average ?? 0);

  return (
    <article
      id={`post-${post.id}`}
      className="scroll-mt-52 grid gap-4 py-6 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-7 sm:py-8"
    >
      <div className="hidden pt-1 sm:block">
        <p className="font-serif text-2xl font-bold text-[#a34830]">
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="mt-3 h-px w-8 bg-[#d69749]" />
      </div>
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <Avatar className="size-9">
            <AvatarImage
              src={post.author_image ?? undefined}
              alt={`${post.author_name}'s profile`}
            />
            <AvatarFallback className="bg-[#dfe9df] text-xs font-bold text-[#193d35]">
              {post.author_name.trim().charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-[#193d35]">
            {post.author_name}
          </span>
          <span className="text-xs text-[#68756e]">{formattedDate}</span>
          <span className="text-xs text-[#68756e]">
            {readingMinutes} min read
          </span>
        </div>

        <h3 className="max-w-3xl text-2xl font-black leading-tight tracking-tight text-[#172b27] sm:text-3xl">
          {post.title}
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[#52635d]">
          <BibleReferenceText text={post.excerpt} />
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={`post-body-${post.id}`}
            onClick={onToggle}
            className="inline-flex min-h-10 items-center gap-2 border-b-2 border-[#a34830] px-0.5 text-sm font-bold text-[#883b2b] transition-colors hover:border-[#193d35] hover:text-[#193d35] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#193d35]"
          >
            {isExpanded ? "Close story" : "Read full story"}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <p className="flex items-center gap-1.5 text-xs text-[#68756e]">
            <Star className="h-3.5 w-3.5 text-[#a34830]" />
            {averageRating ? averageRating.toFixed(1) : "New"} ({post.rating_count})
          </p>
        </div>

        {isExpanded && (
          <div
            id={`post-body-${post.id}`}
            className="mt-6 border-l-2 border-[#d69749] pl-4 sm:pl-6"
          >
            <p className="max-w-3xl whitespace-pre-wrap text-base leading-8 text-[#344740]">
              <BibleReferenceText text={post.content} />
            </p>
            <div className="mt-7 flex flex-col gap-5 border-t border-[#d8d7cc] pt-5 lg:flex-row lg:items-center lg:justify-between">
              <div
                className="flex items-center gap-1"
                aria-label={`Rated ${averageRating.toFixed(1)} out of 5 from ${post.rating_count} ratings`}
              >
                <span className="mr-2 text-sm font-semibold text-[#52635d]">
                  Rate this story
                </span>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onRate(value)}
                    aria-label={`Rate ${value} out of 5`}
                    className="p-1"
                  >
                    <Star
                      className={`h-5 w-5 ${value <= rating ? "fill-[#d69749] text-[#a34830]" : "text-[#c5c9bf] hover:text-[#a34830]"}`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs text-[#68756e]">
                  {post.rating_count} ratings
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex min-h-10 items-center gap-2 border border-[#bfc8bf] px-3 text-sm font-bold text-[#193d35] transition hover:border-[#193d35]"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Share"}
                </button>
                <button
                  type="button"
                  onClick={onWhatsapp}
                  aria-label="Share on WhatsApp"
                  className="inline-flex min-h-10 items-center gap-2 bg-[#193d35] px-3 text-sm font-bold text-white transition hover:bg-[#285a4e]"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </button>
                {(
                  ["x", "facebook", "linkedin", "telegram", "email"] as const
                ).map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => onSocialShare(platform)}
                    aria-label={`Share via ${platform}`}
                    className="min-h-10 border border-[#bfc8bf] px-3 text-sm font-bold capitalize text-[#193d35] transition hover:border-[#193d35]"
                  >
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

function JournalFeed({
  posts,
  visiblePosts,
  isLoading,
  hasLoadError,
  expandedPost,
  rated,
  copied,
  onToggle,
  onRate,
  onShare,
  onWhatsapp,
  onSocialShare,
}: Readonly<{
  posts: Post[];
  visiblePosts: Post[];
  isLoading: boolean;
  hasLoadError: boolean;
  expandedPost: number | null;
  rated: Record<number, number>;
  copied: number | null;
  onToggle: (postId: number) => void;
  onRate: (postId: number, value: number) => void;
  onShare: (post: Post) => void;
  onWhatsapp: (post: Post) => void;
  onSocialShare: (platform: SocialPlatform, post: Post) => void;
}>) {
  if (hasLoadError) {
    return (
      <div className="border-y border-[#c9cec4] py-12 text-center">
        <p className="text-lg font-bold">The journal could not load.</p>
        <p className="mt-2 text-sm text-[#68756e]">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  if (isLoading) return <LoadingStories />;
  if (visiblePosts.length === 0) return <EmptyStories hasPosts={posts.length > 0} />;

  return (
    <div className="divide-y divide-[#d8d7cc] border-y border-[#d8d7cc]">
      {visiblePosts.map((post, index) => (
        <JournalPost
          key={post.id}
          post={post}
          index={index}
          isExpanded={expandedPost === post.id}
          rating={rated[post.id] ?? Math.round(Number(post.rating_average ?? 0))}
          copied={copied === post.id}
          onToggle={() => onToggle(post.id)}
          onRate={(value) => onRate(post.id, value)}
          onShare={() => onShare(post)}
          onWhatsapp={() => onWhatsapp(post)}
          onSocialShare={(platform) => onSocialShare(platform, post)}
        />
      ))}
    </div>
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
        const postIndex = loadedPosts.findIndex((post) => post.id === postId);
        if (postIndex >= 0) {
          setExpandedPost(postId);
          setVisibleCount(
            Math.max(
              PAGE_SIZE,
              Math.ceil((postIndex + 1) / PAGE_SIZE) * PAGE_SIZE,
            ),
          );
        }
      })
      .catch(() => {
        if (isActive) setHasLoadError(true);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (expandedPost && window.location.hash === `#post-${expandedPost}`) {
      document
        .getElementById(`post-${expandedPost}`)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [expandedPost, visibleCount, posts.length]);

  const matchingPosts = getMatchingPosts(posts, deferredSearch, sortBy);
  const visiblePosts = matchingPosts.slice(0, visibleCount);
  const resultsLabel = isLoading
    ? "Loading stories..."
    : `${Math.min(visibleCount, matchingPosts.length)} of ${matchingPosts.length}`;

  async function rate(postId: number, rating: number) {
    await ratePost(postId, rating);
    setRated((current) => ({ ...current, [postId]: rating }));
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              rating_average: String(
                (
                  (Number(post.rating_average ?? 0) * post.rating_count +
                    rating) /
                  (post.rating_count + 1)
                ).toFixed(1),
              ),
              rating_count: post.rating_count + 1,
            }
          : post,
      ),
    );
  }

  async function share(post: Post) {
    const url = `${window.location.origin}/journal#post-${post.id}`;
    if (navigator.share) {
      await navigator
        .share({ title: post.title, text: post.excerpt, url })
        .catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(post.id);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function whatsapp(post: Post) {
    const url = `${window.location.origin}/journal#post-${post.id}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(post.title + " - " + url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const getPostUrl = (post: (typeof posts)[number]) => {
    if (typeof window === "undefined") return "";

    return `${window.location.origin}/journal#post-${post.id}`;
  };

  const socialShare = (
    platform: SocialPlatform,
    post: (typeof posts)[number],
  ) => {
    const url = getPostUrl(post);
    const text = `${post.title} — ${post.excerpt}`;
    const body = `${text}\n\nRead more: ${url}`;

    const links = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(url)}`,

      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url,
      )}`,

      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}`,

      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(text)}`,

      email: `mailto:?subject=${encodeURIComponent(
        post.title,
      )}&body=${encodeURIComponent(body)}`,
    };

    if (platform === "email") {
      window.location.href = links.email;
      return;
    }

    window.open(
      links[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  return (
    <main className="min-h-screen bg-[#f4f2e9] px-5 py-9 text-[#172b27] sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="border-b-2 border-[#193d35] pb-8 sm:pb-10">
          <div className="mb-7 flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#a34830]">
              <BookOpen className="h-4 w-4" /> JesusBaby / Community journal
            </p>
            <p className="hidden text-sm font-medium text-[#66716b] sm:block">
              Stories of faith, change, and hope
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                The stories we carry forward.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#52635d] sm:text-lg">
                Honest reflections from people finding freedom, rebuilding, and
                learning to live with hope.
              </p>
            </div>
            <div className="flex items-center gap-4 border-l-2 border-[#d69749] pl-4 md:justify-self-end">
              <span className="font-serif text-4xl font-bold text-[#a34830]">
                {posts.length.toString().padStart(2, "0")}
              </span>
              <span className="max-w-24 text-xs font-bold uppercase leading-5 tracking-[0.12em] text-[#52635d]">
                community stories
              </span>
            </div>
          </div>
        </header>

        <section
          aria-label="Find a journal post"
          className="sticky top-16 z-10 -mx-5 border-b border-[#d8d7cc] bg-[#f4f2e9]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68756e]" />
              <span className="sr-only">Search journal posts</span>
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search stories, people, or scripture"
                className="h-11 w-full border border-[#c9cec4] bg-[#fffefa] pl-10 pr-4 text-sm outline-none transition focus:border-[#193d35] focus:ring-2 focus:ring-[#193d35]/15"
              />
            </label>
            <label className="flex h-11 items-center gap-2 border border-[#c9cec4] bg-[#fffefa] px-3 text-sm text-[#52635d] sm:w-48">
              <span className="shrink-0 text-xs font-bold uppercase tracking-wider">
                Order
              </span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "newest" | "top-rated")
                }
                aria-label="Sort journal posts"
                className="min-w-0 flex-1 bg-transparent font-semibold text-[#172b27] outline-none"
              >
                <option value="newest">Newest</option>
                <option value="top-rated">Top rated</option>
              </select>
            </label>
          </div>
        </section>

        <section aria-label="Journal posts" className="pt-5">
          <div className="mb-2 flex items-baseline justify-between gap-4 py-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#52635d]">
              {deferredSearch.trim() ? "Search results" : "Latest reflections"}
            </h2>
            <p className="text-xs tabular-nums text-[#68756e]">{resultsLabel}</p>
          </div>

          <JournalFeed
            posts={posts}
            visiblePosts={visiblePosts}
            isLoading={isLoading}
            hasLoadError={hasLoadError}
            expandedPost={expandedPost}
            rated={rated}
            copied={copied}
            onToggle={(postId) =>
              setExpandedPost((current) =>
                current === postId ? null : postId,
              )
            }
            onRate={(postId, value) => void rate(postId, value)}
            onShare={(post) => void share(post)}
            onWhatsapp={whatsapp}
            onSocialShare={socialShare}
          />

          {!isLoading && visibleCount < matchingPosts.length && (
            <div className="py-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="min-h-11 border border-[#193d35] px-6 text-sm font-bold text-[#193d35] transition hover:bg-[#193d35] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#193d35]"
              >
                Load {Math.min(PAGE_SIZE, matchingPosts.length - visibleCount)}
                {" "}
                more stories
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
