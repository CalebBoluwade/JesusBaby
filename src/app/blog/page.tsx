import type { Metadata } from "next";
import { auth } from "@/auth";
import BlogWorkspace from "@/components/BlogWorkspace";

export const metadata: Metadata = {
  title: "Journal — JesusBaby",
  description: "Write and share reflections, prayers, and what God is doing in your life. A community space for faith journaling.",
  keywords: ["Christian journal", "faith blog", "prayer", "reflection", "testimony", "Jesus"],
  openGraph: {
    title: "Journal — JesusBaby",
    description: "Write and share reflections, prayers, and what God is doing in your life.",
    url: "https://jesusbaby.com/blog",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "JesusBaby Journal" }],
  },
  twitter: { card: "summary_large_image", title: "Journal — JesusBaby", description: "Write and share reflections, prayers, and what God is doing in your life.", images: ["https://jesusbaby.com/og-image.svg"] },
  alternates: { canonical: "https://jesusbaby.com/blog" },
};

export default async function BlogPage() {
  const session = await auth();
  return <BlogWorkspace userName={session?.user?.name ?? "friend"} />;
}