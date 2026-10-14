import type { Metadata } from "next";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Sign In — JesusBaby",
  description: "Sign in to the JesusBaby community to share reflections, read testimonies, and connect with believers.",
  keywords: ["sign in", "login", "JesusBaby", "community", "faith"],
  openGraph: {
    title: "Sign In — JesusBaby",
    description: "Sign in to the JesusBaby community to share reflections and connect with believers.",
    url: "https://jesusbaby.com/signin",
    siteName: "JesusBaby",
    type: "website",
    images: [{ url: "https://jesusbaby.com/og-image.svg", width: 1200, height: 630, alt: "JesusBaby" }],
  },
  twitter: { card: "summary_large_image", title: "Sign In — JesusBaby", description: "Sign in to the JesusBaby community.", images: ["https://jesusbaby.com/og-image.svg"] },
  alternates: { canonical: "https://jesusbaby.com/signin" },
};

export default function SignInPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-5 py-16" style={{ background: "#0f0f0f" }}>
      <div className="w-full max-w-md p-8 text-center sm:p-10" style={{ background: "#161616", border: "1px solid #2b2b2b" }}>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em]" style={{ color: "#d7fb66" }}>JesusBaby community</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Come write with us.</h1>
        <p className="mt-4 leading-7" style={{ color: "#888" }}>Sign in to read community reflections and share what God is doing in your life.</p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/blog" });
          }}
        >
          <button className="w-full px-5 py-3 font-bold transition-colors" style={{ background: "#d7fb66", color: "#111" }}>
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}