"use client";

import React from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
};
