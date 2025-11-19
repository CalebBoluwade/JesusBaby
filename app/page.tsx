"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../components/NavigationProvider";
import {
  Heart,
  Sparkles,
  Quote,
  Plus,
  ChevronRight,
  ChevronLeft,
  Activity,
  ArrowRight,
  BookOpenText,
  PhoneCall,
  MessageSquare,
  Info,
} from "lucide-react";

import Carousel from "@/components/Carousel";
import ContactPage from "@/components/Contact";

// --- Mock/Default Data for Carousel ---
const FEATURED_STORIES = [
  {
    id: "1",
    name: "Sarah J.",
    addiction: "Alcoholism",
    story:
      "Jesus stepped in when I hit rock bottom. The chains are broken, and I finally know what peace feels like through Him.",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Michael R.",
    addiction: "Gambling",
    story:
      "I lost everything, but grace found me. My deliverance came not through my strength, but through the power of Christ.",
    color: "bg-emerald-500",
  },
  {
    id: "3",
    name: "Elena D.",
    addiction: "Depression & Pills",
    story:
      "Fear controlled every breath, but I was delivered by God's truth. Now I wake up with a song in my heart instead of panic.",
    color: "bg-purple-500",
  },
];

const HeroCarousel = ({
  setActiveTab,
}: {
  setActiveTab: (t: string) => void;
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FEATURED_STORIES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % FEATURED_STORIES.length);
  const prevSlide = () =>
    setCurrent(
      (prev) => (prev - 1 + FEATURED_STORIES.length) % FEATURED_STORIES.length
    );

  return (
    <div className="relative --h-[calc(100vh - 200px)] h-dvh w-full overflow-hidden --bg-slate-900 --text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 flex items-center justify-center`}
        >
          {/* Abstract Background */}
          <div
            className={`absolute inset-0 opacity-40 ${FEATURED_STORIES[current].color} bg-linear-to-br from-black/60 to-transparent mix-blend-overlay`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />

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
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => setActiveTab("stories")}
                className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
              >
                Read More Victories <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
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
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
        <button
          onClick={prevSlide}
          aria-label="Previous testimonial"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2 items-center">
          {FEATURED_STORIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          aria-label="Next testimonial"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const TestimonialForm = ({
  setActiveTab,
}: {
  setActiveTab: (t: string) => void;
}) => {
  const [name, setName] = useState("");
  const [addiction, setAddiction] = useState("");
  const [story, setStory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock submission - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setTimeout(() => {
        setActiveTab("stories");
      }, 2000);
    } catch (error) {
      console.error("Error submitting story: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <Sparkles className="w-10 h-10 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Hallelujah!</h3>
        <p className="text-slate-600">
          Your testimony has been shared and will encourage others.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">
          Share Your Victory
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          &#34;They triumphed over him by the blood of the Lamb and by the word of
          their testimony.&#34; - Revelation 12:11
          <br />
          Share how Jesus delivered you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              First Name (or Alias)
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="e.g. John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Delivered From
            </label>
            <input
              required
              type="text"
              value={addiction}
              onChange={(e) => setAddiction(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="e.g. Gambling, Depression, Drugs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Your Testimony
          </label>
          <textarea
            required
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
            placeholder="Share what changed and how Jesus helped you find freedom..."
          />
          <p className="text-xs text-slate-400 text-right">
            Keep it brief and encouraging.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Activity className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          {isSubmitting ? "Posting..." : "Post Testimony"}
        </button>
      </form>
    </div>
  );
};

// const ResourcesSection = () => {
//   const [bibleContent, setBibleContent] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Function to fetch encouraging content from the LLM
//   useEffect(() => {
//     const fetchContent = async () => {
//       setLoading(true);
//       const systemPrompt =
//         "You are a warm, encouraging spiritual counselor. Provide a short, uplifting paragraph (max 50 words) about deliverance and hope through Jesus Christ, followed by three specific Bible verses relevant to freedom, depression, and addiction. Structure the response clearly with the paragraph first, then a list of the three verses using the format: **[Book Chapter:Verse]** - [Text of the verse].";
//       const userQuery =
//         "Generate content for a 'deliverance and hope' resource page focusing on freedom in Jesus Christ.";
//       const apiKey = "";
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

//       const maxRetries = 3;
//       let delay = 1000;

//       for (let i = 0; i < maxRetries; i++) {
//         try {
//           const response = await fetch(apiUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               contents: [{ parts: [{ text: userQuery }] }],
//               systemInstruction: { parts: [{ text: systemPrompt }] },
//             }),
//           });

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }

//           const result = await response.json();
//           const text =
//             result.candidates?.[0]?.content?.parts?.[0]?.text ||
//             "Content could not be loaded.";
//           setBibleContent(text);
//           break; // Success
//         } catch (error) {
//           console.error(`Attempt ${i + 1} failed:`, error);
//           if (i === maxRetries - 1) {
//             setBibleContent(
//               "Failed to load encouraging content. Please try refreshing."
//             );
//           }
//           await new Promise((resolve) => setTimeout(resolve, delay));
//           delay *= 2; // Exponential backoff
//         }
//       }
//       setLoading(false);
//     };

//     fetchContent();
//   }, []);



//   return (
//     <div className="max-w-4xl mx-auto space-y-12">
//       <div className="text-center">
//         <h2 className="text-4xl font-extrabold text-indigo-600 mb-2">
//           Find Deliverance and Hope
//         </h2>
//         <p className="text-lg text-slate-500">
//           Your next step towards freedom starts here.
//         </p>
//       </div>

//       {/* Scripture & Encouragement Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
//       >
//         <div className="flex items-center gap-4 mb-6 border-b pb-4 border-indigo-100">
//           <BookOpenText className="w-7 h-7 text-indigo-600" />
//           <h3 className="text-2xl font-bold text-slate-900">
//             Scripture for Freedom
//           </h3>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <Activity className="w-6 h-6 text-indigo-600 animate-spin" />
//             <span className="ml-3 text-slate-500">
//               Loading encouragement...
//             </span>
//           </div>
//         ) : (
//           <div className="text-slate-700 whitespace-pre-wrap">
//             {bibleContent}
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// --- Main App Component ---
export default function Home() {
  const { activeTab, setActiveTab } = useNavigation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Tab Content */}
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroCarousel setActiveTab={setActiveTab} />

              {/* <Carousel /> */}
            </motion.div>
          )}

          {/* {activeTab === "stories" && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10"
            >
              <StoriesList />
            </motion.div>
          )} */}

          {activeTab === "share" && (
            <motion.div
              key="share"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10"
            >
              <TestimonialForm setActiveTab={setActiveTab} />
            </motion.div>
          )}

          <ContactPage />

          {/* {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10"
            >
              <ResourcesSection />
            </motion.div>
          )} */}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-bold text-xl text-slate-900">TheEngine</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 TheEngine Platform. Building Men, Sharing hope, one story at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
