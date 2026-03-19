"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useChains } from "@/hooks/useChains";
import Link from "next/link";

export default function PricingPage() {
  const { data: session } = useSession();
  const { paid, chainCount, limit } = useChains();
  const [loading, setLoading] = useState(false);

  const freeLimit = limit ?? 50;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-slate-900">Rethinkjobs</h1>
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {paid ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">You have full access!</h2>
            <p className="text-slate-500 text-sm mb-6">
              You have unlimited application tracking. No limits on syncing or classification.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Plan</h2>
              <p className="text-sm text-slate-500">
                {session
                  ? `You're using ${chainCount} of ${freeLimit} free applications.`
                  : "Pick the plan that works best for you."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Plan */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Student</h3>
                    <p className="text-xs text-slate-400">For active students</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-slate-900">Free</span>
                </div>
                <p className="text-xs text-slate-400 mb-5">Verify your student status</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {[
                    "Unlimited application tracking",
                    "Unlimited Gmail syncs",
                    "AI-powered email classification",
                    "Full pipeline dashboard",
                    "Timeline & deadline tracking",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/verify-student"
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors text-center block"
                >
                  Verify Student Status
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-sm p-7 flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-600 text-white">
                    Most Popular
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Professional</h3>
                    <p className="text-xs text-slate-400">For job seekers & professionals</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-slate-900">$9.99</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <p className="text-xs text-slate-400 mb-5">Cancel anytime</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {[
                    "Unlimited application tracking",
                    "Unlimited Gmail syncs",
                    "AI-powered email classification",
                    "Full pipeline dashboard",
                    "Timeline & deadline tracking",
                    "Priority support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Redirecting to checkout..." : "Upgrade to Pro — $9.99/mo"}
                </button>

                <p className="text-xs text-slate-400 mt-3 text-center">
                  Secure payment via Stripe
                </p>
              </div>
            </div>

            {/* Free tier info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                Free tier includes up to {freeLimit} applications with no payment required.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
