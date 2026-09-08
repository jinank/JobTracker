"use client";

import { useState } from "react";
import { signInWithGmailTracking } from "@/lib/authSignIn";

const GMAIL_PRIVACY_ACK_KEY = "summer_internships_signup_gmail_privacy_v1";

export function GmailConnectBanner() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  function beginConnect() {
    try {
      if (localStorage.getItem(GMAIL_PRIVACY_ACK_KEY)) {
        void signInWithGmailTracking("/");
        return;
      }
    } catch {
      /* ignore */
    }
    setPrivacyOpen(true);
  }

  function confirmConnect() {
    try {
      localStorage.setItem(GMAIL_PRIVACY_ACK_KEY, "1");
    } catch {
      /* ignore */
    }
    setPrivacyOpen(false);
    void signInWithGmailTracking("/");
  }

  return (
    <>
      <div className="mb-4 rounded-xl border border-scale-purple/25 bg-gradient-to-r from-scale-mist to-white px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Connect Gmail to sync applications</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Read-only access for job-related mail only. You are signed in without Gmail until you connect.
          </p>
        </div>
        <button
          type="button"
          onClick={beginConnect}
          className="mt-3 shrink-0 rounded-xl bg-scale-purple px-4 py-2 text-xs font-semibold text-white hover:bg-scale-purple-dark sm:mt-0"
        >
          Connect Gmail
        </button>
      </div>

      {privacyOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close"
            onClick={() => setPrivacyOpen(false)}
          />
          <div className="relative max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Connect Gmail for Track Jobs</h3>
            <p className="mt-3 text-sm text-slate-600">
              Google may show an unverified app warning until our OAuth app is verified. We only request read-only
              Gmail for job application emails.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmConnect}
                className="rounded-lg bg-scale-purple px-4 py-2 text-sm font-semibold text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
