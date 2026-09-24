"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export const ClientLayout = ({ children, session }: ClientLayoutProps) => {
  return (
    <SessionProvider session={session}>
      <Navigation />
      {children}
      <Footer />
    </SessionProvider>
  );
};
