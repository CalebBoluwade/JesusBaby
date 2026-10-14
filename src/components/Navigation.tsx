"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, BookOpen, Share2, Heart, Users, AlertCircle, PenLine, LogOut, UserCircle, MoreHorizontal, ChevronDown, Library, Headphones } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const isPodcastPage = pathname === "/pods" || pathname.startsWith("/pods/");
  const isRouteActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => { setIsOpen(false); setIsMoreOpen(false); }, [pathname]);
  useEffect(() => { setMounted(true); }, []);

  const isLight = theme === "light";
  const toggleTheme = () => setTheme(isLight ? "dark" : "light");

  const primaryNavItems = [
    { href: "/", label: "Home", icon: Sun },
    { href: "/journal", label: "Journal", icon: BookOpen },
    { href: "/blog", label: "Write", icon: PenLine },
    { href: "/share", label: "Share story", icon: Share2 },
    { href: "/library", label: "Library", icon: Library },
    { href: "/pods", label: "Podcasts", icon: Headphones },
  ];

  const secondaryNavItems = [
    { href: "/collage", label: "Wall of Victory", icon: BookOpen },
    { href: "/resources", label: "Deliverance & Help", icon: Heart },
    { href: "/partners", label: "Partners", icon: Users },
    { href: "/disclaimer", label: "Disclaimer", icon: AlertCircle },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-all duration-300"
      style={isPodcastPage && !navExpanded
        ? { background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderColor: "#1f1f1f", height: 36 }
        : { background: "rgba(16,16,16,0.97)", backdropFilter: "blur(16px)", borderColor: "#2b2b2b" }
      }
      onMouseEnter={() => isPodcastPage && setNavExpanded(true)}
      onMouseLeave={() => isPodcastPage && setNavExpanded(false)}
      onFocusCapture={() => isPodcastPage && setNavExpanded(true)}
      onBlurCapture={() => isPodcastPage && setNavExpanded(false)}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className={`relative flex justify-between items-center transition-all duration-300 ${isPodcastPage && !navExpanded ? "h-9" : "h-16"}`}>

          {/* minimized hint strip */}
          {isPodcastPage && !navExpanded && (
            <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
              <div className="flex items-center gap-2">
                <Heart className="h-3.5 w-3.5 fill-current" style={{ color: "#d7fb66" }} />
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#555" }}>JesusBaby Podcasts</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#a0a0a0" }}>HOVER TO NAVIGATE ↑</span>
            </div>
          )}

          <Link href="/" className={`flex items-center cursor-pointer gap-2 transition-opacity duration-200 ${isPodcastPage && !navExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <motion.span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center text-[#d7fb66]"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart className="h-7 w-7 fill-current" />
            </motion.span>
            <span className="font-bold text-xl tracking-tight text-white">JesusBaby</span>
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden items-center gap-1 lg:flex transition-all duration-200 ${isPodcastPage && !navExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {primaryNavItems.map((item) => {
              const isActive = isRouteActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-[#d7fb66]" : "text-[#888] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="nav-underline" className="absolute inset-x-3 -bottom-1 h-0.5 bg-[#d7fb66]" />
                  )}
                </Link>
              );
            })}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen((open) => !open)}
                className={`flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium ${
                  secondaryNavItems.some((item) => isRouteActive(item.href)) ? "text-[#d7fb66]" : "text-[#888] hover:text-white"
                }`}
                aria-expanded={isMoreOpen}
                aria-controls="more-navigation"
              >
                <MoreHorizontal className="h-4 w-4" />
                More
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {isMoreOpen && (
                <div id="more-navigation" className="absolute right-0 top-11 z-50 w-56 border border-[#2a2a2a] bg-[#161616] p-2 shadow-xl">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isRouteActive(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsMoreOpen(false)} aria-current={isActive ? "page" : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                          isActive ? "bg-[#1f1f1f] text-[#d7fb66]" : "text-[#888] hover:bg-[#1f1f1f] hover:text-white"
                        }`}>
                        <Icon className="h-4 w-4" />{item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            {status === "authenticated" && (
              <div className="flex items-center gap-3 border-l border-[#2b2b2b] pl-5">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#888]" title={session.user?.email ?? undefined}>
                  <UserCircle className="h-4 w-4 text-[#d7fb66]" />
                  {session.user?.name ?? "Signed in"}
                </span>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1 text-xs font-bold text-[#666] hover:text-red-400" title="Log out">
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
            {status === "unauthenticated" && (
              <Link href="/signin" className="border border-[#d7fb66]/40 px-3 py-2 text-xs font-bold text-[#d7fb66] hover:bg-[#d7fb66] hover:text-[#111] transition-colors">Sign in</Link>
            )}
            {/* theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
              className="ml-1 flex h-7 w-14 items-center rounded-full border border-[#2b2b2b] px-1 transition-colors"
              style={{ background: isLight ? "#e8e8e4" : "#1a1a1a" }}
            >
              {mounted && (
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background: isLight ? "#fff" : "#2b2b2b",
                    marginLeft: isLight ? "auto" : 0,
                  }}
                >
                  {isLight
                    ? <Sun className="h-3 w-3" style={{ color: "#5a8a00" }} />
                    : <Moon className="h-3 w-3" style={{ color: "#d7fb66" }} />}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center text-[#888] hover:bg-[#1f1f1f]"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
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
            id="mobile-navigation"
            className="lg:hidden overflow-hidden border-b border-[#2b2b2b]"
            style={{ background: "#111" }}
          >
            <div className="max-h-[calc(100dvh-64px)] overflow-y-auto px-2 pt-2 pb-3 space-y-1">
              {allNavItems.map((item) => {
                const isActive = isRouteActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                      isActive ? "bg-[#1f1f1f] text-[#d7fb66]" : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {status === "authenticated" && (
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 px-3 py-2 text-base font-bold text-red-400">
                  <LogOut className="h-4 w-4" />
                  Log out ({session.user?.name ?? "account"})
                </button>
              )}
              {status === "unauthenticated" && (
                <Link href="/signin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-base font-bold text-[#d7fb66]">
                  <UserCircle className="h-4 w-4" />
                  Sign in
                </Link>
              )}
              <button
                onClick={toggleTheme}
                aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#888]"
              >
                {isLight ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isLight ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
