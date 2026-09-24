"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, X, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewsletterModal({
  open,
  onOpenChange,
}: Readonly<NewsletterModalProps>) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (
      (typeof navigator !== "undefined" && !navigator.canShare) ||
      !navigator.share
    ) {
      return alert("Sharing not supported on this device.");
    }
    try {
      await navigator.share({
        title: "Check this out Deliverance Testimonies",
        text: "This is something awesome! Jesus is changing lives — read powerful testimonies!",
        url: window.location.href,
      });
      console.log("Shared successfully!");
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => {
          setSubmitted(false);
          onOpenChange(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle>Stay Connected</DialogTitle>
          <DialogDescription>
            Get Surrounded by a cloud of witnesses testimonies of transformation
            and receive resources for your journey.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || submitted}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || submitted}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Subscribed!
                </>
              ) : loading ? (
                "Subscribing..."
              ) : (
                "Subscribe"
              )}
            </button>

            <Button onClick={handleShare}>
              <Share2 className="w-5 h-5" /> Share
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
