"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleAdsSignUpConversion } from "@/components/GoogleAdsSignUpConversion";
import { SuppressWalletExtensionErrors } from "@/components/SuppressWalletExtensionErrors";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SuppressWalletExtensionErrors />
      <GoogleAdsSignUpConversion />
      {children}
    </SessionProvider>
  );
}
