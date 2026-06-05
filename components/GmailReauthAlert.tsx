"use client";

import { signInWithGmailTracking } from "@/lib/authSignIn";

type GmailReauthAlertProps = {
  message?: string | null;
};

export function GmailReauthAlert({ message }: GmailReauthAlertProps) {
  return (
    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">Gmail needs to be reconnected</p>
      <p className="mt-1 text-amber-900/90">
        {message ??
          "Your Gmail access expired or was revoked. Reconnect to continue syncing job emails."}
      </p>
      <button
        type="button"
        onClick={() => void signInWithGmailTracking("/")}
        className="mt-3 inline-flex rounded-lg bg-scale-purple px-4 py-2 text-xs font-semibold text-white hover:bg-scale-purple-dark transition-colors"
      >
        Reconnect Gmail
      </button>
    </div>
  );
}
