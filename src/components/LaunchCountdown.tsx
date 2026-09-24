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

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <motion.div
    key={value}
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex flex-col items-center"
  >
    <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg px-4 py-3 min-w-16">
      <span className="text-2xl md:text-3xl font-bold text-white">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-xs md:text-sm font-semibold text-slate-600 mt-2 uppercase tracking-wider">
      {label}
    </span>
  </motion.div>
);

interface LaunchCountdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const LaunchCountdown = ({ open = true, onOpenChange }: LaunchCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date("2026-01-01T00:00:00").getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <button
            onClick={() => onOpenChange?.(false)}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close countdown"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              🚀 Launching Soon
            </h3>
            <div className="flex gap-3 md:gap-4 justify-center mb-4">
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Get ready for JesusBaby on January 1st
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
