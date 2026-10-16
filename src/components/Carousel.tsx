"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: BibleVerseReference[] = [
    {
      id: 1,
      title: "Depression",
      book: "Psalms",
      verse: "34:17-18",
      verseText:
        "The righteous cry out, and the Lord hears them; he delivers them from all their troubles. The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    },
    {
      id: 2,
      title: "Addiction",
      book: "2 Corinthians",
      verse: "5:17",
      verseText:
        "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
    },
    {
      id: 3,
      title: "Demons",
      book: "John",
      verse: "8:36",
      verseText: "So if the Son sets you free, you will be free indeed.",
    },
    {
      id: 4,
      title: "Anxiety",
      book: "Philippians",
      verse: "4:6-7",
      verseText:
        "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    },
    {
      id: 5,
      title: "Anger",
      book: "Proverbs",
      verse: "3:5-6",
      verseText:
        "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    },
    {
      id: 6,
      title: "Loneliness",
      book: "Isaiah",
      verse: "43:2",
      verseText:
        "When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you; when you walk through fire you shall not be burned, and the flame shall not consume you.",
    },
    {
      id: 7,
      title: "Grief",
      book: "John",
      verse: "14:6",
      verseText:
        "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    },
    {
      id: 8,
      title: "Stress",
      book: "Proverbs",
      verse: "3:5-6",
      verseText:
        "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    },
    {
      id: 9,
      title: "Self-Doubt",
      book: "Proverbs",
      verse: "3:6",
      verseText:
        "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    },
    {
      id: 10,
      title: "Peace",
      book: "Proverbs",
      verse: "3:6",
      verseText:
        "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    },
  ];

  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -80 }),
  };

  return (
    <div className="relative w-full h-[calc(100dvh-64px)] overflow-hidden bg-app-bg">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.32, 0, 0.18, 1] }}
          className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 26 }}
              className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-app-lime"
            >
              {testimonials[currentIndex].book} {testimonials[currentIndex].verse}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 280, damping: 24 }}
              className="mb-6 text-4xl font-black leading-tight tracking-tight text-app-text sm:text-5xl"
            >
              Delivered from{" "}
              <motion.span
                key={testimonials[currentIndex].title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, type: "spring", stiffness: 300, damping: 22 }}
                className="inline-block text-app-lime"
              >
                {testimonials[currentIndex].title}
              </motion.span>
            </motion.h3>
            <motion.blockquote
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26, type: "spring", stiffness: 260, damping: 26 }}
              className="border-l-2 border-app-lime pl-6 text-xl leading-9 text-app-muted sm:text-2xl"
            >
              &ldquo;{testimonials[currentIndex].verseText}&rdquo;
            </motion.blockquote>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-30"
      >
        <motion.button
          onClick={prevSlide}
          aria-label="Previous verse"
          className="p-2 border border-app-line bg-app-card"
          whileHover={{ scale: 1.1, borderColor: "var(--app-lime)" }}
          whileTap={{ scale: 0.92 }}
        >
          <ChevronLeft className="w-5 h-5 text-app-muted" />
        </motion.button>
        <div className="flex gap-2 items-center">
          {testimonials.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
              aria-label={`Go to verse ${idx + 1}`}
              animate={{ width: currentIndex === idx ? 28 : 6, opacity: currentIndex === idx ? 1 : 0.35 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`h-1.5 ${currentIndex === idx ? "bg-app-lime" : "bg-app-line"}`}
            />
          ))}
        </div>
        <motion.button
          onClick={nextSlide}
          aria-label="Next verse"
          className="p-2 border border-app-line bg-app-card"
          whileHover={{ scale: 1.1, borderColor: "var(--app-lime)" }}
          whileTap={{ scale: 0.92 }}
        >
          <ChevronRight className="w-5 h-5 text-app-muted" />
        </motion.button>
      </motion.div>
    </div>
  );
}
