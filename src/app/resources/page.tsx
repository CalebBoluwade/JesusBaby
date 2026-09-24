"use client";

import { motion } from "framer-motion";
import ContactPage from "@/components/Contact";

export default function ResourcesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <ContactPage />
    </motion.div>
  );
}
