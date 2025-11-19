"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun } from "lucide-react";
import { useNavigation } from "./NavigationProvider";

export const Navigation = () => {
  const { activeTab, setActiveTab } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "stories", label: "Wall of Victory" },
    { id: "share", label: "Share Story" },
    { id: "resources", label: "Deliverance & Help" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div
            className="flex items-center cursor-pointer gap-2"
            onClick={() => setActiveTab("home")}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              TheEngine
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === item.id
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="h-0.5 w-full bg-indigo-600 mt-1"
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => setActiveTab("share")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30"
            >
              Submit Story
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};