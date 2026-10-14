import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t py-6" style={{ background: "#111", borderColor: "#2b2b2b" }}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-bold text-xl text-white">JesusBaby</span>
        </div>
        <p className="text-sm mb-4" style={{ color: "#555" }}>
          © 2025 JesusBaby. Building faith, sharing hope, one story at a time.
        </p>
        <Link href="/disclaimer" className="inline-flex items-center gap-1 text-sm transition-colors hover:text-[#d7fb66]" style={{ color: "#555" }}>
          <AlertCircle className="w-4 h-4" />
          Disclaimer
        </Link>
      </div>
    </footer>
  );
};
