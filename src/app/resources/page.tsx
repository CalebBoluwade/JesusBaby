import type { Metadata } from "next";
import ContactPage from "@/components/Contact";

export const metadata: Metadata = {
  title: "Resources — JesusBaby",
  description:
    "Get in touch with JesusBaby. Find resources, support, and connect with our community of believers.",
  keywords: ["resources", "contact", "support", "JesusBaby", "faith", "help"],
  openGraph: {
    title: "Resources — JesusBaby",
    description: "Get in touch with JesusBaby and find resources for your faith journey.",
    url: "https://jesusbaby.com/resources",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "Resources — JesusBaby" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources — JesusBaby",
    description: "Get in touch with JesusBaby and find resources for your faith journey.",
    images: ["https://jesusbaby.com/og-image.svg"],
  },
  alternates: { canonical: "https://jesusbaby.com/resources" },
};

export default function ResourcesPage() {
  return <ContactPage />;
}
