import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-bold text-xl text-slate-900">JesusBaby</span>
        </div>
        <p className="text-slate-500 text-sm mb-4">
          © 2025 JesusBaby. Building faith, sharing hope, one story at
          a time.
        </p>
        <Link href="/disclaimer" className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-sm transition-colors">
          <AlertCircle className="w-4 h-4" />
          Disclaimer
        </Link>
      </div>
    </footer>
  );
};
