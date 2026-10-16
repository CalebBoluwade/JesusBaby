"use client";

import { FormEvent, useState } from "react";
import { Check, PenLine, Send, FileText } from "lucide-react";
import { createPost } from "@/app/blog/actions";

export default function BlogWorkspace({
  userName,
}: Readonly<{ userName: string }>) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    try {
      await createPost({ title, excerpt, content });
    } catch {
      setStatus("error");
      return;
    }
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("saved");
  }

  return (
    <main className="flex h-[calc(100dvh-64px)] flex-col bg-app-bg text-app-text lg:flex-row">

      {/* Left panel — meta fields */}
      <div className="flex flex-col border-b border-app-line px-6 py-8 lg:w-[380px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-app-lime">
            Community journal
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight">
            Write what grace<br /> is teaching you.
          </h1>
          <p className="mt-3 text-sm leading-6 text-app-muted">
            Welcome back, {userName}.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Title</span>
            <input
              required
              form="post-form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A title that invites people in"
              className="w-full border-b-2 border-app-line bg-transparent py-2.5 text-lg font-bold outline-none transition-colors placeholder:text-app-muted3 focus:border-app-lime"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Short excerpt</span>
            <textarea
              required
              form="post-form"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="One or two sentences for the journal feed"
              rows={3}
              className="w-full resize-none border border-app-line bg-app-panel p-3 text-sm outline-none transition-colors placeholder:text-app-muted3 focus:border-app-lime"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="mt-6 border-t border-app-line pt-5">
          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="flex items-center gap-1.5 text-xs text-app-muted">
              {status === "saved" && <><Check className="h-3.5 w-3.5 text-app-lime" /> Post is live.</>}
              {status === "error" && "Something went wrong."}
            </p>
            <button
              type="submit"
              form="post-form"
              disabled={status === "saving"}
              className="inline-flex items-center gap-2 bg-app-lime px-5 py-2.5 text-sm font-bold text-app-bg transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-50"
            >
              {status === "saved" ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {status === "saving" ? "Publishing..." : "Publish"}
            </button>
          </div>
          <a
            href="/journal"
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-app-muted transition-colors hover:text-app-lime"
          >
            <FileText className="h-3.5 w-3.5" />
            Read community posts →
          </a>
        </div>
      </div>

      {/* Right panel — write-up fills remaining space */}
      <form id="post-form" onSubmit={publish} className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-app-line px-6 py-4">
          <span className="grid h-7 w-7 shrink-0 place-items-center bg-app-lime text-app-bg">
            <PenLine className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Your write-up</span>
        </div>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell the story in your own words..."
          className="flex-1 resize-none bg-app-panel p-6 text-sm leading-8 outline-none transition-colors placeholder:text-app-muted3 focus:bg-app-card sm:p-8 sm:text-base"
        />
      </form>
    </main>
  );
}
