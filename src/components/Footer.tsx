import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-app-line bg-app-panel py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-bold text-xl text-app-text">JesusBaby</span>
        </div>
        <p className="text-sm mb-4 text-app-muted">
          © 2025 JesusBaby. Building faith, sharing hope, one story at a time.
        </p>
        <Link href="/disclaimer" className="inline-flex items-center gap-1 text-sm text-app-muted transition-colors hover:text-app-lime">
          <AlertCircle className="w-4 h-4" />
          Disclaimer
        </Link>
      </div>
    </footer>
  );
};
