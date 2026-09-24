"use client";

import { useEffect, useState } from "react";
import { BookOpen, Check, Share2, Star } from "lucide-react";
import { getPosts, ratePost } from "@/app/blog/actions";

type Post = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  created_at: string | null;
  rating_average: string | null;
  rating_count: number;
};

export default function PublicJournal() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rated, setRated] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  async function rate(postId: number, rating: number) {
    await ratePost(postId, rating);
    setRated((current) => ({ ...current, [postId]: rating }));
    setPosts((current) => current.map((post) => post.id === postId ? { ...post, rating_average: String(((Number(post.rating_average ?? 0) * post.rating_count + rating) / (post.rating_count + 1)).toFixed(1)), rating_count: post.rating_count + 1 } : post));
  }

  async function share(post: Post) {
    const url = `${window.location.origin}/journal#post-${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: post.title, text: post.excerpt, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(post.id);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function whatsapp(post: Post) {
    const url = `${window.location.origin}/journal#post-${post.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " - " + url)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 border-b border-slate-900/10 pb-8">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-700"><BookOpen className="h-4 w-4" /> Open journal</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Stories worth passing on.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Read reflections from the JesusBaby community, rate the ones that encourage you, and share hope with someone who needs it.</p>
        </header>
        <div className="space-y-8">{posts.length === 0 ? <div className="border border-dashed border-slate-300 p-12 text-center text-slate-500">No journal posts yet. Check back soon.</div> : posts.map((post) => <article id={`post-${post.id}`} key={post.id} className="scroll-mt-24 border border-slate-900/10 bg-white p-6 shadow-[8px_8px_0_#e7dfcf] sm:p-9"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Written by {post.author_name}</p><p className="text-sm text-slate-400">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</p></div><h2 className="mt-4 text-3xl font-black tracking-tight">{post.title}</h2><p className="mt-4 text-lg leading-8 text-slate-600">{post.excerpt}</p><p className="mt-6 whitespace-pre-wrap border-t border-slate-100 pt-6 leading-8 text-slate-700">{post.content}</p><div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5"><div className="flex items-center gap-1" aria-label={`Rated ${Number(post.rating_average ?? 0).toFixed(1)} out of 5 from ${post.rating_count} ratings`}><span className="mr-2 text-sm font-semibold text-slate-500">Rate this</span>{[1, 2, 3, 4, 5].map((value) => <button key={value} onClick={() => rate(post.id, value)} aria-label={`Rate ${value} out of 5`} className="p-1"><Star className={`h-5 w-5 ${value <= (rated[post.id] ?? Math.round(Number(post.rating_average ?? 0))) ? "fill-amber-400 text-amber-500" : "text-slate-300 hover:text-amber-400"}`} /></button>)}<span className="ml-2 text-sm text-slate-500">{Number(post.rating_average ?? 0) ? Number(post.rating_average).toFixed(1) : "New"} ({post.rating_count})</span></div><div className="flex items-center gap-2"><button onClick={() => share(post)} className="inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-sm font-bold hover:border-slate-900">{copied === post.id ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}{copied === post.id ? "Copied" : "Share"}</button><button onClick={() => whatsapp(post)} className="bg-[#25D366] px-3 py-2 text-sm font-bold text-white hover:bg-[#1daa55]">WhatsApp</button></div></div></article>)}</div>
      </div>
    </main>
  );
}