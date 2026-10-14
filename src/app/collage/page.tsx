import type { Metadata } from "next";
import CollageClient from "@/components/CollageClient";

export const metadata: Metadata = {
  title: "Wall of Victory — JesusBaby",
  description:
    "Real stories of real people who found real freedom in Christ. Browse testimonies of deliverance from addiction, depression, and more.",
  keywords: [
    "testimonies",
    "deliverance",
    "freedom",
    "Jesus",
    "addiction recovery",
    "depression",
    "Wall of Victory",
    "Christian testimonies",
  ],
  openGraph: {
    title: "Wall of Victory — JesusBaby",
    description:
      "Real stories of real people who found real freedom in Christ.",
    url: "https://jesusbaby.com/collage",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "Wall of Victory — JesusBaby" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wall of Victory — JesusBaby",
    description: "Real stories of real people who found real freedom in Christ.",
    images: ["https://jesusbaby.com/og-image.svg"],
  },
  alternates: { canonical: "https://jesusbaby.com/collage" },
};

export default function CollagePage() {
  return <CollageClient />;
}
