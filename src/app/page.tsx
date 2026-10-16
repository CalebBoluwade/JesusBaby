"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import Carousel from "@/components/Carousel";
import VideoPlayer from "@/components/VideoPlayer";
import NewsletterSignup from "@/components/NewsletterSignup";
import NewsletterModal from "@/components/NewsletterModal";
import SalvationAltarCall from "@/components/SalvationAltarCall";
import { LaunchCountdown } from "@/components/LaunchCountdown";

const FEATURED_STORIES = [
  {
    id: "1",
    name: "Sarah J.",
    addiction: "Alcoholism",
    story:
      "Jesus stepped in when I hit rock bottom. The chains are broken, and I finally know what peace feels like through Him.",
    color: "bg-amber-700",
    videoUrl: "/videos/5199861-hd_1080_1920_25fps.mp4",
  },
  {
    id: "2",
    name: "Michael R.",
    addiction: "Gambling",
    story:
      "I lost everything, but grace found me. My deliverance came not through my strength, but through the power of Christ.",
    color: "bg-emerald-500",
    videoUrl: "/videos/5199854-uhd_1440_2560_25fps.mp4",
  },
  {
    id: "3",
    name: "Elena D.",
    addiction: "Depression & Pills",
    story:
      "Fear controlled every breath, but I was delivered by God's truth. Now I wake up with a song in my heart instead of panic.",
    color: "bg-amber-700",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

const HeroCarousel = ({
  onNewsletterClick,
}: {
  onNewsletterClick: () => void;
}) => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FEATURED_STORIES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % FEATURED_STORIES.length);
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + FEATURED_STORIES.length) % FEATURED_STORIES.length);
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 1.04 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.97 }),
  };

  return (
    <div className="relative h-[calc(100dvh-64px)] w-full overflow-hidden scroll-snap-start">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.32, 0, 0.18, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Video Player */}
          <div className="absolute inset-0 z-0">
            <VideoPlayer src={FEATURED_STORIES[current].videoUrl} autoPlay muted loop showControls={false} />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 z-5" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 28 }}
              className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/10 backdrop-blur-sm mb-6"
            >
              <motion.span
                animate={{ rotate: [0, 15, -10, 15, 0] }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#d7fb66" }} />
              </motion.span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">
                Delivered By His Grace
              </span>
            </motion.div>

            <motion.h2
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 24 }}
              className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-white"
            >
              Freedom from{" "}
              <motion.span
                key={FEATURED_STORIES[current].addiction}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 22 }}
                style={{ color: "#d7fb66", display: "inline-block" }}
              >
                {FEATURED_STORIES[current].addiction}
              </motion.span>
            </motion.h2>

            <motion.p
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 26 }}
              className="text-lg md:text-xl text-white/80 font-light italic mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              &ldquo;{FEATURED_STORIES[current].story}&rdquo;
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 260, damping: 26 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-20"
            >
              <motion.button
                onClick={() => router.push("/collage")}
                className="px-8 py-3 font-bold text-sm text-black flex items-center gap-2"
                style={{ background: "#d7fb66" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Read More Victories <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={onNewsletterClick}
                className="px-8 py-3 border border-white/30 bg-white/10 backdrop-blur-sm text-white font-bold text-sm hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Find Hope &amp; Help
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-8 text-white/40 text-xs font-bold tracking-[0.2em] uppercase"
            >
              — {FEATURED_STORIES[current].name}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-30"
      >
        <motion.button
          onClick={prevSlide}
          aria-label="Previous testimonial"
          className="p-2 border border-white/20 bg-white/10 backdrop-blur-sm"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.92 }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div className="flex gap-2 items-center">
          {FEATURED_STORIES.map((_, idx) => (
            <motion.button
              key={idx + 1}
              onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
              aria-label={`Go to testimonial ${idx + 1}`}
              animate={{ width: current === idx ? 28 : 8, opacity: current === idx ? 1 : 0.4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`h-1.5 ${current === idx ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
        <motion.button
          onClick={nextSlide}
          aria-label="Next testimonial"
          className="p-2 border border-white/20 bg-white/10 backdrop-blur-sm"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.92 }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [countdownOpen, setCountdownOpen] = useState(true);

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans scroll-smooth snap-mandatory">
      <LaunchCountdown open={countdownOpen} onOpenChange={setCountdownOpen} />
      <HeroCarousel onNewsletterClick={() => setNewsletterOpen(true)} />
      <Carousel />
      <SalvationAltarCall />
      {/* <Brands /> */}
      <NewsletterSignup />
      <NewsletterModal open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </div>
  );
}
