import type { Metadata } from "next";
import PartnersClient from "@/components/PartnersClient";

export const metadata: Metadata = {
  title: "Partners — JesusBaby",
  description:
    "Explore faith-driven projects and initiatives. Partner with JesusBaby to fund missionaries, build community, and spread the love of Jesus Christ.",
  keywords: [
    "partners",
    "collaborate",
    "missionaries",
    "Christian community",
    "faith projects",
    "JesusBaby",
    "get involved",
  ],
  openGraph: {
    title: "Partners — JesusBaby",
    description:
      "Explore faith-driven projects and initiatives. Partner with JesusBaby to spread the love of Jesus Christ.",
    url: "https://jesusbaby.com/partners",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "Partners — JesusBaby" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partners — JesusBaby",
    description: "Explore faith-driven projects and partner with JesusBaby.",
    images: ["https://jesusbaby.com/og-image.svg"],
  },
  alternates: { canonical: "https://jesusbaby.com/partners" },
};

export default function PartnersPage() {
  return <PartnersClient />;
}
