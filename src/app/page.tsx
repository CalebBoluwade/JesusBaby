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
    color: "bg-blue-500",
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
    color: "bg-purple-500",
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

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % FEATURED_STORIES.length);
  const prevSlide = () =>
    setCurrent(
      (prev) => (prev - 1 + FEATURED_STORIES.length) % FEATURED_STORIES.length
    );

  return (
    <div className="relative h-[calc(100dvh-64px)] w-full overflow-hidden scroll-snap-start">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 flex items-center justify-center`}
        >
          {/* Video Player */}
          <div className="absolute inset-0 z-0">
            <VideoPlayer
              src={FEATURED_STORIES[current].videoUrl}
              autoPlay
              muted
              loop
              showControls={false}
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 z-5" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Delivered By His Grace
              </span>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              &#34;Freedom from{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                {FEATURED_STORIES[current].addiction}
              </span>{" "}
              Found in Jesus&#34;
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-slate-200 font-light italic mb-8 max-w-2xl mx-auto"
            >
              &#34;{FEATURED_STORIES[current].story}&#34;
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20"
            >
              <button
                onClick={() => router.push("/collage")}
                className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-colors flex items-center gap-2"
              >
                Read More Victories <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNewsletterClick}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              >
                Find Hope & Help
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-slate-400 text-sm font-medium tracking-widest uppercase"
            >
              — {FEATURED_STORIES[current].name}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-30">
        <button
          onClick={prevSlide}
          aria-label="Previous testimonial"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2 items-center">
          {FEATURED_STORIES.map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
                current === idx ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          aria-label="Next testimonial"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [countdownOpen, setCountdownOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth snap-mandatory">
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
