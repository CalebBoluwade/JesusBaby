"use client";

import React from "react";
import { Navigation } from "./Navigation";
import { NavigationProvider } from "./NavigationProvider";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <NavigationProvider>
      <Navigation />
      {children}
    </NavigationProvider>
  );
};