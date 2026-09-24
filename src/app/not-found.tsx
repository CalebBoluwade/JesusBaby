"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400 mb-4">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            The page you&apos;re looking for doesn&apos;t exist. But don&apos;t worry—there&apos;s
            always hope in Christ.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-slate-400 text-sm"
        >
          Need help?{" "}
          <motion.a
            href="/"
            className="text-indigo-400 hover:text-cyan-400 transition-colors"
          >
            Contact us
          </motion.a>
        </motion.p>
      </motion.div>
    </div>
  );
}
