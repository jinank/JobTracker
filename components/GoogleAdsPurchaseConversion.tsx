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

/** Fires Google Ads purchase conversion on /success (Stripe session_id or PayPal return). */
export function GoogleAdsPurchaseConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id")?.trim();

    if (!sessionId) {
      const fromPayPal = typeof document !== "undefined" && /paypal\.com/i.test(document.referrer);
      if (!fromPayPal) return;
    }

    const key = sessionId ? `${STORAGE_PREFIX}${sessionId}` : `${STORAGE_PREFIX}paypal-return`;

    try {
      if (typeof window === "undefined" || localStorage.getItem(key)) return;

      window.gtag?.("event", "conversion_event_purchase", {
        value: PRO_SUBSCRIPTION_VALUE_USD,
        currency: "USD",
        transaction_id: sessionId ?? `paypal-${Date.now()}`,
      });
      localStorage.setItem(key, "1");
    } catch {
      // non-fatal
    }
  }, [searchParams]);

  return null;
}
