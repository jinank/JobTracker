"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const STORAGE_PREFIX = "rethinkjobs_ads_signup_fired:";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires Google Ads "Sign-up" conversion once per account after first Google sign-in. */
export function GoogleAdsSignUpConversion() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.adsSignUpConversion || !session.user?.email) return;

    const email = session.user.email.trim().toLowerCase();
    const key = `${STORAGE_PREFIX}${email}`;

    try {
      if (typeof window === "undefined" || localStorage.getItem(key)) return;

      window.gtag?.("event", "conversion", {
        send_to: "AW-18093007265/7XLVCJLZ3ZwcEKHDtbND",
        value: 1.0,
        currency: "USD",
      });
      localStorage.setItem(key, "1");
    } catch {
      // non-fatal
    }
  }, [status, session]);

  return null;
}
