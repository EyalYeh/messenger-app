"use client"; // this makes the file a Client Component

import { SessionProvider } from "next-auth/react";
import React from "react";

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}