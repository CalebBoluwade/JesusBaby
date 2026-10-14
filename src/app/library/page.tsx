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

export default function LibraryPage() {
  return (
    <main className="min-h-[calc(100dvh-64px)] px-5 py-12 sm:px-8 sm:py-16" style={{ background: "#0f0f0f" }}>
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#d7fb66" }}>
            <BookOpenText className="h-4 w-4" />
            JesusBaby Library
          </div>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
            Books for the journey.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#888" }}>
            Explore faith-centered reading for seasons of growth, hope, and
            transformation. Ask us about digital downloads or printed editions.
          </p>
        </header>

        <section aria-labelledby="formats-heading" className="mt-12 border-y" style={{ borderColor: "#2b2b2b" }}>
          <h2 id="formats-heading" className="sr-only">Browse book formats</h2>
          {libraryOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <article
                key={option.title}
                className={`grid gap-6 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10 ${
                  index > 0 ? "border-t" : ""
                }`}
                style={index > 0 ? { borderColor: "#2b2b2b" } : {}}
              >
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center" style={{ background: "#1a2a12", color: "#d7fb66" }}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{option.title}</h3>
                    <p className="mt-2 max-w-xl leading-7" style={{ color: "#888" }}>{option.description}</p>
                  </div>
                </div>
                <Link
                  href={`mailto:partners@jesusbaby.com?subject=${encodeURIComponent(option.subject)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-sm font-bold transition-colors sm:justify-self-end"
                  style={{ background: "#d7fb66", color: "#111" }}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {option.action}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </section>

        <p className="mt-6 max-w-3xl text-sm leading-6" style={{ color: "#555" }}>
          Our book listings are being prepared. Contact us for current
          availability; any purchase, download, and delivery details will be
          confirmed before you proceed.
        </p>
      </div>
    </main>
  );
}