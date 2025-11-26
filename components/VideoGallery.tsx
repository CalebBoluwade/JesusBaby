"use client";

import React from "react";
import VideoPlayer from "./VideoPlayer";

interface Video {
  id: string;
  title: string;
  src: string;
  poster?: string;
  description?: string;
}

interface VideoGalleryProps {
  videos: Video[];
  columns?: number;
}

export default function VideoGallery({
  videos,
  columns = 3,
}: VideoGalleryProps) {
  return (
    <div
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}
    >
      {videos.map((video) => (
        <div key={video.id} className="flex flex-col">
          <VideoPlayer
            src={video.src}
            poster={video.poster ?? ""}
            title={video.title}
            className="aspect-video"
          />
          {video.description && (
            <p className="mt-3 text-slate-600 text-sm">{video.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
