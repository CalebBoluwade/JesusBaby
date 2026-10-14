import type { Metadata } from "next";
import PodcastApp from "@/components/Podcasts";

export const metadata: Metadata = {
  title: "Podcasts — JesusBaby",
  description:
    "Faith-filled podcast episodes on deliverance, hope, and life in Christ. Stream curated Christian audio from the JesusBaby community.",
  keywords: [
    "Christian podcast",
    "faith audio",
    "deliverance",
    "Jesus",
    "hope",
    "testimony",
    "Christian music",
    "Bible teaching",
  ],
  openGraph: {
    title: "Podcasts — JesusBaby",
    description:
      "Faith-filled podcast episodes on deliverance, hope, and life in Christ.",
    url: "https://jesusbaby.com/pods",
    siteName: "JesusBaby",
    type: "website",
    images: [
      {
        url: "https://jesusbaby.com/og-image.svg",
        width: 1200,
        height: 630,
        alt: "JesusBaby Podcasts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podcasts — JesusBaby",
    description: "Faith-filled podcast episodes on deliverance, hope, and life in Christ.",
    images: ["https://jesusbaby.com/og-image.svg"],
    creator: "@JesusBaby",
  },
  alternates: {
    canonical: "https://jesusbaby.com/pods",
  },
};

export default function PodsPage() {
  return <PodcastApp />;
}