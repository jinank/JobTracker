"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_PREFIX = "summer_internships_ads_purchase_fired:";
const PRO_SUBSCRIPTION_VALUE_USD = 9.99;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires Google Ads purchase conversion once per Stripe checkout session on /success. */
export function GoogleAdsPurchaseConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id")?.trim();
    if (!sessionId) return;

    const key = `${STORAGE_PREFIX}${sessionId}`;

    try {
      if (typeof window === "undefined" || localStorage.getItem(key)) return;

      window.gtag?.("event", "ads_conversion_PURCHASE_1", {
        value: PRO_SUBSCRIPTION_VALUE_USD,
        currency: "USD",
        transaction_id: sessionId,
      });
      localStorage.setItem(key, "1");
    } catch {
      // non-fatal
    }
  }, [searchParams]);

  return null;
}
