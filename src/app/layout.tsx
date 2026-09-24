import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";
import { auth } from "@/auth";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JesusBaby - Freedom Found in Christ",
  description:
    "Real stories of deliverance and hope. Discover how Jesus Christ transforms lives from addiction, depression, and despair. Join our community of faith.",
  keywords: [
    "deliverance",
    "faith",
    "Jesus",
    "addiction recovery",
    "hope",
    "Christian",
    "testimony",
    "freedom",
  ],
  authors: [{ name: "JesusBaby" }],
  creator: "JesusBaby",
  publisher: "JesusBaby",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jesusbaby.com",
    siteName: "JesusBaby",
    title: "JesusBaby - Freedom Found in Christ",
    description:
      "Real stories of deliverance and hope. Discover how Jesus Christ transforms lives from addiction, depression, and despair.",
    images: [
      {
        url: "https://jesusbaby.com/og-image.svg",
        width: 1200,
        height: 630,
        alt: "JesusBaby - Freedom Found in Christ",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JesusBaby - Freedom Found in Christ",
    description:
      "Real stories of deliverance and hope. Discover how Jesus Christ transforms lives.",
    images: ["https://jesusbaby.com/og-image.svg"],
    creator: "@JesusBaby",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="canonical" href="https://jesusbaby.com" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout session={session}>{children}</ClientLayout>
      </body>
    </html>
  );
}
