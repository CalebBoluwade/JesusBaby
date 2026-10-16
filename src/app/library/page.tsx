import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Download,
  Mail,
  ShoppingBag,
} from "lucide-react";

const libraryOptions = [
  {
    title: "Digital books",
    description:
      "Ask about books available to read on your phone, tablet, or computer.",
    action: "Ask about downloads",
    subject: "Digital book availability",
    icon: Download,
    accent: "bg-amber-100 text-amber-800",
  },
  {
    title: "Printed books",
    description:
      "Get in touch to ask about print editions, pricing, and delivery options.",
    action: "Ask about print editions",
    subject: "Printed book availability",
    icon: ShoppingBag,
    accent: "bg-amber-100 text-amber-800",
  },
];

export const metadata: Metadata = {
  title: "Library — JesusBaby",
  description: "Explore faith-centered books for seasons of growth, hope, and transformation. Ask about digital downloads or printed editions.",
  keywords: ["Christian books", "faith library", "digital downloads", "printed books", "Jesus", "spiritual growth"],
  openGraph: {
    title: "Library — JesusBaby",
    description: "Explore faith-centered books for seasons of growth, hope, and transformation.",
    url: "https://jesusbaby.com/library",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "JesusBaby Library" }],
  },
  twitter: { card: "summary_large_image", title: "Library — JesusBaby", description: "Explore faith-centered books for seasons of growth, hope, and transformation.", images: ["https://jesusbaby.com/og-image.svg"] },
  alternates: { canonical: "https://jesusbaby.com/library" },
};

export default function LibraryPage() {
  return (
    <main className="min-h-[calc(100dvh-64px)] bg-app-bg px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-app-lime">
            <BookOpenText className="h-4 w-4" />
            JesusBaby Library
          </div>
          <h1 className="text-4xl font-black leading-tight text-app-text sm:text-6xl">
            Books for the journey.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-app-muted">
            Explore faith-centered reading for seasons of growth, hope, and
            transformation. Ask us about digital downloads or printed editions.
          </p>
        </header>

        <section aria-labelledby="formats-heading" className="mt-12 border-y border-app-line">
          <h2 id="formats-heading" className="sr-only">Browse book formats</h2>
          {libraryOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <article
                key={option.title}
                className={`grid gap-6 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10 ${
                  index > 0 ? "border-t border-app-line" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center bg-app-lime-dim text-app-lime">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-app-text">{option.title}</h3>
                    <p className="mt-2 max-w-xl leading-7 text-app-muted">{option.description}</p>
                  </div>
                </div>
                <Link
                  href={`mailto:partners@jesusbaby.com?subject=${encodeURIComponent(option.subject)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-app-lime px-5 py-3 text-sm font-bold text-app-bg transition-opacity hover:opacity-90 sm:justify-self-end"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {option.action}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </section>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-app-muted">
          Our book listings are being prepared. Contact us for current
          availability; any purchase, download, and delivery details will be
          confirmed before you proceed.
        </p>
      </div>
    </main>
  );
}