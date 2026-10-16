"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      viewport={{ once: true }}
      className="border-t border-app-line bg-app-panel px-5 py-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 26 }}
              viewport={{ once: true }}
              className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-app-lime"
            >
              Stay connected
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 280, damping: 24 }}
              viewport={{ once: true }}
              className="max-w-md text-3xl font-black leading-tight tracking-tight text-app-text sm:text-4xl"
            >
              Stories of deliverance, straight to you.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 280, damping: 26 }}
              viewport={{ once: true }}
              className="mt-3 max-w-sm text-sm leading-6 text-app-muted"
            >
              Get inspired by testimonies of transformation and receive resources for your journey.
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, type: "spring", stiffness: 260, damping: 26 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="flex w-full max-w-md gap-0"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || submitted}
                className="h-11 w-full border border-r-0 border-app-line bg-app-card pl-10 pr-4 text-sm text-app-text outline-none transition placeholder:text-app-muted3 focus:border-app-lime disabled:opacity-50"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading || submitted}
              className="h-11 shrink-0 bg-app-lime px-6 text-sm font-bold text-app-bg disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              whileHover={{ opacity: 0.88 }}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Subscribed
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {loading ? "..." : "Subscribe"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 text-xs text-app-muted3"
        >
          We respect your privacy. Unsubscribe at any time.
        </motion.p>
      </div>
    </motion.section>
  );
}
