"use client";

import { FormEvent, useEffect, useState } from "react";
import { BookOpen, Check, PenLine, Send } from "lucide-react";
import { createPost, getPosts } from "@/app/blog/actions";

type Post = { id: number; title: string; excerpt: string; content: string; author_name: string; created_at: string | null };

export default function BlogWorkspace({ userName }: Readonly<{ userName: string }>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    try {
      const post = await createPost({ title, excerpt, content });
      setPosts((current) => [post, ...current]);
    } catch {
      setStatus("error");
      return;
    }
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("saved");
  }

  let statusMessage = "";
  if (status === "error") statusMessage = "Something went wrong. Try again.";
  if (status === "saved") statusMessage = "Your post is live.";

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col gap-5 border-b border-slate-900/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Community journal</p>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">Write what grace is teaching you.</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">Welcome back, {userName}. Share a reflection, a practical lesson, or a moment of victory with the JesusBaby community.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><BookOpen className="h-5 w-5 text-amber-600" /> Your private writing room</div>
        </header>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_0.8fr]">
          <form onSubmit={publish} className="border border-slate-900/10 bg-white p-6 shadow-[8px_8px_0_#e7dfcf] sm:p-8">
            <div className="mb-7 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center bg-slate-900 text-white"><PenLine className="h-5 w-5" /></span><div><h2 className="text-xl font-bold">Create a post</h2><p className="text-sm text-slate-500">Published instantly for signed-in readers.</p></div></div>
            <label className="mb-5 block text-sm font-bold">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A title that invites people in" className="mt-2 w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-xl outline-none transition-colors placeholder:text-slate-300 focus:border-amber-500" /></label>
            <label className="mb-5 block text-sm font-bold">Short excerpt<textarea required value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="One or two sentences for the journal feed" rows={2} className="mt-2 w-full resize-none border border-slate-200 bg-slate-50 p-3 font-normal outline-none focus:border-amber-500" /></label>
            <label className="block text-sm font-bold">Your write-up<textarea required value={content} onChange={(event) => setContent(event.target.value)} placeholder="Tell the story in your own words..." rows={9} className="mt-2 w-full resize-y border border-slate-200 bg-slate-50 p-3 font-normal leading-7 outline-none focus:border-amber-500" /></label>
            <div className="mt-6 flex items-center justify-between gap-4"><p aria-live="polite" className="text-sm text-slate-500">{statusMessage}</p><button type="submit" disabled={status === "saving"} className="inline-flex items-center gap-2 bg-amber-500 px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60">{status === "saved" ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}{status === "saving" ? "Publishing..." : "Publish post"}</button></div>
          </form>
          <section><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">Community posts</h2><span className="text-sm text-slate-500">{posts.length} {posts.length === 1 ? "post" : "posts"}</span></div><div className="space-y-4">{posts.length === 0 ? <div className="border border-dashed border-slate-300 p-8 text-center text-slate-500">Your first post will start the conversation.</div> : posts.map((post) => <article key={post.id} className="border-t border-slate-900/15 py-5"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-700">{post.author_name}</p><h3 className="text-xl font-bold">{post.title}</h3><p className="mt-2 leading-7 text-slate-600">{post.excerpt}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">{post.content}</p></article>)}</div></section>
        </div>
      </div>
    </main>
  );
}