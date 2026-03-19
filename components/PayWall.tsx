"use client";

import { useState } from "react";

interface PayWallProps {
  chainCount?: number;
  limit?: number;
}

export function PayWall({ chainCount = 0, limit = 50 }: PayWallProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  const atLimit = chainCount >= limit;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-lg mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-5">
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {atLimit ? "Free tier limit reached" : "Upgrade to Pro"}
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        {atLimit
          ? `You've tracked ${chainCount}/${limit} free applications. Upgrade for unlimited access.`
          : `You're on the free plan (${chainCount}/${limit} applications used). Go Pro for unlimited.`}
      </p>

      <div className="bg-slate-50 rounded-xl p-5 mb-6 text-left">
        <div className="flex items-baseline justify-center gap-1 mb-1">
          <span className="text-4xl font-bold text-slate-900">$9.99</span>
          <span className="text-sm text-slate-500">/month</span>
        </div>
        <p className="text-xs text-slate-400 text-center mb-4">
          Cancel anytime
        </p>
        <ul className="space-y-2.5">
          {[
            "Unlimited application tracking",
            "Unlimited Gmail syncs",
            "AI-powered email classification",
            "Full pipeline dashboard",
            "Timeline & deadline tracking",
            "Priority support",
          ].map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <svg
                className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Redirecting to checkout..." : "Upgrade to Pro — $9.99/mo"}
      </button>

      <p className="text-xs text-slate-400 mt-4">
        Secure payment via Stripe. Cancel anytime.
      </p>
    </div>
  );
}
