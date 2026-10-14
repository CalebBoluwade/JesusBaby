import type { Metadata } from "next";
import PublicJournal from "@/components/PublicJournal";

export const metadata: Metadata = {
  title: "Community Journal — JesusBaby",
  description: "Read community reflections, prayers, and testimonies from believers sharing what God is doing in their lives.",
  keywords: ["Christian journal", "community reflections", "faith", "prayer", "testimony", "Jesus"],
  openGraph: {
    title: "Community Journal — JesusBaby",
    description: "Read community reflections, prayers, and testimonies from believers.",
    url: "https://jesusbaby.com/journal",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "JesusBaby Journal" }],
  },
  twitter: { card: "summary_large_image", title: "Community Journal — JesusBaby", description: "Read community reflections, prayers, and testimonies from believers.", images: ["https://jesusbaby.com/og-image.svg"] },
  alternates: { canonical: "https://jesusbaby.com/journal" },
};

export default function JournalPage() {
  return <PublicJournal />;
}