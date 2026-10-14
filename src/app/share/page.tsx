import type { Metadata } from "next";
import TestimonyForm from "@/components/TestimonyForm";

export const metadata: Metadata = {
  title: "Share Your Testimony — JesusBaby",
  description:
    "Share your story of deliverance and freedom in Christ. Your testimony could be the hope someone else needs today.",
  keywords: [
    "share testimony",
    "deliverance",
    "freedom",
    "Jesus",
    "Christian testimony",
    "faith story",
  ],
  openGraph: {
    title: "Share Your Testimony — JesusBaby",
    description:
      "Share your story of deliverance and freedom in Christ. Your testimony could be the hope someone else needs today.",
    url: "https://jesusbaby.com/share",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "Share Your Testimony — JesusBaby" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Your Testimony — JesusBaby",
    description: "Share your story of deliverance and freedom in Christ.",
    images: ["https://jesusbaby.com/og-image.svg"],
  },
  alternates: { canonical: "https://jesusbaby.com/share" },
};

export default function SharePage() {
  return <TestimonyForm />;
}
