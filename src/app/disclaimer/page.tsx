import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — JesusBaby",
  description: "Read our disclaimer on testimonies, books, and resources shared on JesusBaby. All content is for faith-based and informational purposes.",
  keywords: ["disclaimer", "JesusBaby", "testimonies", "faith resources", "terms"],
  openGraph: {
    title: "Disclaimer — JesusBaby",
    description: "Read our disclaimer on testimonies, books, and resources shared on JesusBaby.",
    url: "https://jesusbaby.com/disclaimer",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "JesusBaby" }],
  },
  twitter: { card: "summary_large_image", title: "Disclaimer — JesusBaby", description: "Read our disclaimer on testimonies, books, and resources shared on JesusBaby.", images: ["https://jesusbaby.com/og-image.svg"] },
  alternates: { canonical: "https://jesusbaby.com/disclaimer" },
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: "#0f0f0f" }}>
      <div className="max-w-3xl mx-auto rounded-xl p-8" style={{ background: "#161616", border: "1px solid #2b2b2b" }}>
        <h1 className="text-4xl font-bold text-white mb-6">Disclaimer</h1>
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-white mb-3">Testimonies</h2>
          <p className="text-lg mb-4" style={{ color: "#aaa" }}>
            All testimonies shared on this platform are shared with permission from the individuals who provided them.
          </p>
          <p style={{ color: "#888" }}>
            We are committed to respecting the privacy and dignity of all those who share their stories. Each testimony represents a personal journey and is shared voluntarily with explicit consent.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8 mb-3">Books and other materials</h2>
          <p className="mb-4" style={{ color: "#888" }}>
            Books, downloads, articles, podcasts, videos, and other resources
            are provided for general informational, educational, and faith-based
            purposes. They reflect the perspectives of their respective
            authors and creators and are not a substitute for professional
            medical, mental-health, legal, or other qualified advice. Seek
            appropriate professional support for your individual needs.
          </p>
          <p className="mb-4" style={{ color: "#888" }}>
            Content and resource availability may change. Unless otherwise
            stated, materials remain the property of their respective rights
            holders; please do not copy, republish, or distribute them without
            permission. Links to third-party sellers or services are provided
            for convenience. Their products, pricing, fulfillment, privacy
            practices, and terms are managed by those providers, not JesusBaby.
          </p>
          <p style={{ color: "#888" }}>
            Personal stories and faith-based resources describe individual
            experiences and beliefs. They do not guarantee a particular
            outcome, and experiences may differ from person to person.
          </p>
        </div>
      </div>
    </div>
  );
}
