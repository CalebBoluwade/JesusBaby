"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
  <motion.div
    className="flex flex-col items-center gap-2"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
  >
    <div className="relative min-w-14 overflow-hidden bg-app-lime px-4 py-3 text-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="block text-2xl font-black text-app-bg"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted">
      {label}
    </span>
  </motion.div>
);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

interface LaunchCountdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const LaunchCountdown = ({ open = true, onOpenChange }: LaunchCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date("2026-01-01T00:00:00").getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => onOpenChange?.(false)}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 border border-app-line bg-app-card p-8 shadow-2xl"
          >
            <motion.button
              onClick={() => onOpenChange?.(false)}
              className="absolute right-4 top-4 p-1.5 text-app-muted hover:text-app-text transition-colors"
              aria-label="Close countdown"
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <X className="h-4 w-4" />
            </motion.button>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={itemVariants} className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-app-lime">
                Coming soon
              </motion.p>
              <motion.h3 variants={itemVariants} className="mb-6 text-xl font-black text-app-text">
                🚀 Launching January 1st
              </motion.h3>

              <motion.div variants={itemVariants} className="flex gap-3 justify-center mb-4">
                <TimeUnit value={timeLeft.days}    label="Days"  delay={0.2} />
                <TimeUnit value={timeLeft.hours}   label="Hours" delay={0.25} />
                <TimeUnit value={timeLeft.minutes} label="Min"   delay={0.3} />
                <TimeUnit value={timeLeft.seconds} label="Sec"   delay={0.35} />
              </motion.div>

              <motion.p variants={itemVariants} className="mt-4 text-center text-xs text-app-muted">
                Get ready for JesusBaby on January 1st
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
