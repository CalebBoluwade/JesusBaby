"use client";

import React from "react";
import { motion } from "framer-motion";
import VideoGallery from "@/components/VideoGallery";

const VIDEOS = [
  {
    id: "1",
    title: "Testimony: Freedom from Addiction",
    src: "/videos/testimony-1.mp4",
    poster: "/videos/poster-1.jpg",
    description: "A powerful testimony of deliverance through faith in Jesus.",
  },
  {
    id: "2",
    title: "Hope in Crisis",
    src: "/videos/testimony-2.mp4",
    poster: "/videos/poster-2.jpg",
    description: "Finding hope and strength during life's darkest moments.",
  },
  {
    id: "3",
    title: "Grace Transforms Lives",
    src: "/videos/testimony-3.mp4",
    poster: "/videos/poster-3.jpg",
    description: "How God's grace can transform any life.",
  },
];

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Video Testimonies
          </h1>
          <p className="text-lg text-slate-600">
            Watch powerful stories of transformation and faith.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <VideoGallery videos={VIDEOS} columns={3} />
        </motion.div>
      </div>
    </div>
  );
}
