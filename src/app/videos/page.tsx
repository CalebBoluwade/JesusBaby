import type { Metadata } from "next";
import VideosClient from "@/components/VideosClient";

export const metadata: Metadata = {
  title: "Video Testimonies — JesusBaby",
  description:
    "Watch powerful video testimonies of transformation, deliverance, and faith in Jesus Christ.",
  keywords: [
    "video testimonies",
    "Christian videos",
    "deliverance",
    "transformation",
    "faith",
    "Jesus",
  ],
  openGraph: {
    title: "Video Testimonies — JesusBaby",
    description:
      "Watch powerful video testimonies of transformation, deliverance, and faith in Jesus Christ.",
    url: "https://jesusbaby.com/videos",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "Video Testimonies — JesusBaby" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Testimonies — JesusBaby",
    description: "Watch powerful video testimonies of transformation and faith.",
    images: ["https://jesusbaby.com/og-image.svg"],
  },
  alternates: { canonical: "https://jesusbaby.com/videos" },
};

export default function VideosPage() {
  return <VideosClient />;
}
