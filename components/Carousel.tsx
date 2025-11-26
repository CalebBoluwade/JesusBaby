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
      title: "Freedom",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  return (
    <div className="relative w-full h-[calc(100dvh-64px)] overflow-hidden bg-slate-900 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 --bg-white p-8 shadow-lg"
        >
          <div className="px-5 text-center h-full flex flex-col justify-center">
            <h3 className="text-4xl font-bold --text-primary mb-4">
              Delivered from{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                {testimonials[currentIndex].title}
              </span>
            </h3>
            <p className="text-xl --text-gray-700 mb-6 italic">
              &#34;{testimonials[currentIndex].verseText}&#34;
            </p>
            <div className="mt-4">
              <p className="text-sm --text-gray-600 font-semibold">
                - {testimonials[currentIndex].book}{" "}
                {testimonials[currentIndex].verse}
              </p>
            </div>
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
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
                currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/30"
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

      {/* <button
        title="Previous testimonial"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        title="Next testimonial"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {testimonials.map((_, index) => (
          <button
            title={`Go to testimonial ${index + 1}`}
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
}
