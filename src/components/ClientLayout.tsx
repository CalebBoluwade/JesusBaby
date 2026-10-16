"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { Session } from "next-auth";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export const ClientLayout = ({ children, session }: ClientLayoutProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <SessionProvider session={session}>
        <Navigation />
        {children}
        <Footer />
      </SessionProvider>
    </ThemeProvider>
  );
};
