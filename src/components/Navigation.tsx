"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  BookOpen,
  Heart,
  Users,
  AlertCircle,
  PenLine,
  LogOut,
  UserCircle,
  MoreHorizontal,
  ChevronDown,
  Library,
  Headphones,
} from "lucide-react";
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
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setIsOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || theme !== "light";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const primaryNavItems = [
    { href: "/", label: "Home", icon: Sun },
    { href: "/journal", label: "Journal", icon: BookOpen },
    { href: "/pods", label: "Podcasts", icon: Headphones },
    { href: "/partners", label: "Partners", icon: Users },
  ];

  const secondaryNavItems = [
    { href: "/library", label: "Library", icon: Library },
    { href: "/blog", label: "Write", icon: PenLine },
    { href: "/collage", label: "Wall of Victory", icon: BookOpen },
    { href: "/resources", label: "Deliverance & Help", icon: Heart },
    { href: "/disclaimer", label: "Disclaimer", icon: AlertCircle },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-all duration-300"
      style={
        isPodcastPage && !navExpanded
          ? {
              background: "rgba(10,10,10,0.92)",
              backdropFilter: "blur(12px)",
              borderColor: "var(--nav-border)",
              height: 36,
            }
          : {
              background: "var(--nav-bg)",
              backdropFilter: "blur(16px)",
              borderColor: "var(--nav-border)",
            }
      }
      onMouseEnter={() => isPodcastPage && setNavExpanded(true)}
      onMouseLeave={() => isPodcastPage && setNavExpanded(false)}
      onFocusCapture={() => isPodcastPage && setNavExpanded(true)}
      onBlurCapture={() => isPodcastPage && setNavExpanded(false)}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex justify-between items-center transition-all duration-300 ${isPodcastPage && !navExpanded ? "h-9" : "h-16"}`}
        >
          {/* minimized hint strip */}
          {isPodcastPage && !navExpanded && (
            <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
              <div className="flex items-center gap-2">
                <Heart
                  className="h-3.5 w-3.5 fill-current"
                  style={{ color: "var(--nav-active)" }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--nav-muted)" }}
                >
                  JesusBaby Podcasts
                </span>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--nav-muted)" }}
              >
                HOVER TO NAVIGATE ↑
              </span>
            </div>
          )}

          <Link
            href="/"
            className={`flex items-center cursor-pointer gap-2 transition-opacity duration-200 ${isPodcastPage && !navExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <motion.span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center"
              style={{ color: "var(--nav-active)" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart className="h-7 w-7 fill-current" />
            </motion.span>
            <span className="font-bold text-xl tracking-tight" style={{ color: "var(--nav-text)" }}>
              JesusBaby
            </span>
          </Link>

          {/* Desktop Nav */}
          <div
            className={`hidden items-center gap-1 lg:flex transition-all duration-200 ${isPodcastPage && !navExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            {primaryNavItems.map((item) => {
              const isActive = isRouteActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--nav-active)]"
                      : "text-[var(--nav-muted)] hover:text-[var(--nav-text)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-1 h-0.5"
                      style={{ background: "var(--nav-active)" }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen((open) => !open)}
                className={`flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium ${
                  secondaryNavItems.some((item) => isRouteActive(item.href))
                    ? "text-[var(--nav-active)]"
                    : "text-[var(--nav-muted)] hover:text-[var(--nav-text)]"
                }`}
                aria-expanded={isMoreOpen}
                aria-controls="more-navigation"
              >
                <MoreHorizontal className="h-4 w-4" />
                More
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {isMoreOpen && (
                <div
                  id="more-navigation"
                  className="absolute right-0 top-11 z-50 w-56 p-2 shadow-xl"
                  style={{
                    border: "1px solid var(--nav-border)",
                    background: "var(--nav-panel-bg)",
                  }}
                >
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isRouteActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                          isActive
                            ? "text-[var(--nav-active)]"
                            : "text-[var(--nav-muted)] hover:text-[var(--nav-text)]"
                        }`}
                        style={
                          isActive
                            ? { background: "var(--nav-hover-bg)" }
                            : undefined
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            {status === "authenticated" && (
              <div
                className="flex items-center gap-3 pl-5"
                style={{ borderLeft: "1px solid var(--nav-border)" }}
              >
                <span
                  className="flex items-center gap-2 text-xs font-semibold"
                  style={{ color: "var(--nav-muted)" }}
                  title={session.user?.email ?? undefined}
                >
                  <UserCircle
                    className="h-4 w-4"
                    style={{ color: "var(--nav-active)" }}
                  />
                  {session.user?.name ?? "Signed in"}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-xs font-bold text-app-muted hover:text-red-400"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
            {status === "unauthenticated" && (
              <Link
                href="/signin"
                className="px-3 py-2 text-xs font-bold transition-colors"
                style={{
                  border:
                    "1px solid color-mix(in srgb, var(--nav-active) 40%, transparent)",
                  color: "var(--nav-active)",
                }}
              >
                Sign in
              </Link>
            )}
            {/* theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="ml-1 flex h-7 w-14 items-center rounded-full border px-1 transition-colors"
                style={{ background: isDark ? "#1a1a1a" : "#e8e8e4", borderColor: "var(--nav-border)" }}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background: isDark ? "var(--nav-border)" : "#fff",
                    marginLeft: isDark ? 0 : "auto",
                  }}
                >
                  {isDark
                    ? <Moon className="h-3 w-3" style={{ color: "var(--nav-active)" }} />
                    : <Sun className="h-3 w-3" style={{ color: "var(--nav-active)" }} />}
                </motion.span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center"
              style={{ color: "var(--nav-muted)" }}
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
            className="lg:hidden overflow-hidden border-b"
            style={{
              background: "var(--nav-bg)",
              borderColor: "var(--nav-border)",
            }}
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
                      isActive ? "" : ""
                    }`}
                    style={
                      isActive
                        ? {
                            background: "var(--nav-hover-bg)",
                            color: "var(--nav-active)",
                          }
                        : { color: "var(--nav-muted)" }
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {status === "authenticated" && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-3 py-2 text-base font-bold text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Log out ({session.user?.name ?? "account"})
                </button>
              )}
              {status === "unauthenticated" && (
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-base font-bold"
                  style={{ color: "var(--nav-active)" }}
                >
                  <UserCircle className="h-4 w-4" />
                  Sign in
                </Link>
              )}
              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium"
                style={{ color: "var(--nav-muted)" }}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? "Switch to light" : "Switch to dark"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
