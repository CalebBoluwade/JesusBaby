"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, BookOpen, Share2, Heart, Users, AlertCircle, PenLine, LogOut, UserCircle, MoreHorizontal, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { data: session, status } = useSession();

  const primaryNavItems = [
    { href: "/", label: "Home", icon: Sun },
    { href: "/journal", label: "Journal", icon: BookOpen },
    { href: "/blog", label: "Write", icon: PenLine },
    { href: "/share", label: "Share story", icon: Share2 },
  ];

  const secondaryNavItems = [
    { href: "/collage", label: "Wall of Victory", icon: BookOpen },
    { href: "/resources", label: "Deliverance & Help", icon: Heart },
    { href: "/partners", label: "Partners", icon: Users },
    { href: "/disclaimer", label: "Disclaimer", icon: AlertCircle },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center cursor-pointer gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              JesusBaby
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {primaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-1 h-0.5 bg-indigo-600"
                    />
                  )}
                </Link>
              );
            })}
            <div className="relative">
              <button onClick={() => setIsMoreOpen((open) => !open)} className={`flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium ${secondaryNavItems.some((item) => pathname === item.href) ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`} aria-expanded={isMoreOpen}>
                <MoreHorizontal className="h-4 w-4" />
                More
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {isMoreOpen && (
                <div className="absolute right-0 top-11 z-50 w-56 border border-slate-200 bg-white p-2 shadow-xl">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    return <Link key={item.href} href={item.href} onClick={() => setIsMoreOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"><Icon className="h-4 w-4" />{item.label}</Link>;
                  })}
                </div>
              )}
            </div>
            {status === "authenticated" && (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600" title={session.user?.email ?? undefined}>
                  <UserCircle className="h-4 w-4 text-indigo-600" />
                  {session.user?.name ?? "Signed in"}
                </span>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600" title="Log out">
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
            {status === "unauthenticated" && (
              <Link href="/signin" className="border border-slate-900 px-3 py-2 text-xs font-bold text-slate-900 hover:bg-slate-900 hover:text-white">Sign in</Link>
            )}
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
              {allNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {status === "authenticated" && (
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 px-3 py-2 text-base font-bold text-red-600">
                  <LogOut className="h-4 w-4" />
                  Log out ({session.user?.name ?? "account"})
                </button>
              )}
              {status === "unauthenticated" && (
                <Link href="/signin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-base font-bold text-indigo-600">
                  <UserCircle className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
