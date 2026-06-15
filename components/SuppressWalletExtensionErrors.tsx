"use client";

import { useEffect } from "react";

function rejectionMessage(reason: unknown): string {
  if (typeof reason === "string") return reason;
  if (reason instanceof Error) return reason.message;
  if (reason && typeof reason === "object" && "message" in reason) {
    return String((reason as { message: unknown }).message);
  }
  return "";
}

/**
 * MetaMask injects on every tab; failed auto-connect is not a Summer Internships error.
 * Prevents the Next.js dev overlay from treating it as an unhandled rejection.
 */
export function SuppressWalletExtensionErrors() {
  useEffect(() => {
    function onUnhandledRejection(event: PromiseRejectionEvent) {
      const msg = rejectionMessage(event.reason);
      if (/failed to connect to metamask|metamask|wallet extension/i.test(msg)) {
        event.preventDefault();
      }
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
  }, []);

  return null;
}
