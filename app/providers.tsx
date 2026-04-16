"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleAdsSignUpConversion } from "@/components/GoogleAdsSignUpConversion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleAdsSignUpConversion />
      {children}
    </SessionProvider>
  );
}
