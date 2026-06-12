"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleAdsSignUpConversion } from "@/components/GoogleAdsSignUpConversion";
import { SuppressWalletExtensionErrors } from "@/components/SuppressWalletExtensionErrors";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <SuppressWalletExtensionErrors />
      <GoogleAdsSignUpConversion />
      {children}
    </SessionProvider>
  );
}
