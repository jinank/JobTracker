"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SiteNavMarketing } from "@/components/SiteNav";
import { useChains } from "@/hooks/useChains";
import { getPricingPlan } from "@/lib/pricingPlans";
import { getPayPalProCheckoutUrl } from "@/lib/payments";

function FeatureList({ items, accent }: { items: string[]; accent: "emerald" | "blue" | "purple" }) {
  const iconClass =
    accent === "emerald"
      ? "text-emerald-500"
      : accent === "purple"
        ? "text-scale-purple"
        : "text-blue-500";

  return (
    <ul className="mb-6 flex-1 space-y-2.5">
      {items.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
          <svg
            className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const { hasProSubscription, studentVerified, chainCount, limit, loading } = useChains();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const freeLimit = limit ?? 50;
  const studentPlan = getPricingPlan("student")!;
  const proPlan = getPricingPlan("professional")!;
  const premiumPlan = getPricingPlan("premium")!;

  const handleProCheckout = () => {
    setCheckoutLoading(true);
    window.location.href = getPayPalProCheckoutUrl();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNavMarketing />

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        {hasProSubscription && !loading ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-7 w-7 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">You&apos;re on Pro</h1>
            <p className="mt-2 text-sm text-slate-500">
              You have unlimited application tracking and Pro benefits. Need Premium with
              done-for-you applications?{" "}
              <Link href="/contact-us?plan=premium" className="font-semibold text-scale-purple hover:underline">
                Contact us
              </Link>
              .
            </p>
            <Link
              href="/tracker"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-scale-purple px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-scale-purple-dark"
            >
              Go to Tracker
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">Pricing</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Choose your plan
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                {studentVerified
                  ? "You're on the free student plan with unlimited tracking. Upgrade to Pro or Premium for done-for-you internship applications and extra support."
                  : session
                    ? `You're using ${chainCount} of ${freeLimit} free applications. Verify as a student for free unlimited access, or upgrade to Pro / Premium anytime.`
                    : "Verify as a student for free unlimited access, or choose Pro / Premium for unlimited tracking and done-for-you applications."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {/* Student Plan */}
              <div
                className={`flex flex-col rounded-2xl border bg-white p-7 shadow-sm ${
                  studentVerified ? "border-emerald-400 ring-2 ring-emerald-100" : "border-emerald-300"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{studentPlan.name}</h2>
                      <p className="text-xs text-slate-400">{studentPlan.note}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-700">
                    {studentVerified ? "Current" : studentPlan.badge}
                  </span>
                </div>

                <div className="mb-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{studentPlan.price}</span>
                </div>

                <FeatureList items={studentPlan.features} accent="emerald" />

                {studentVerified ? (
                  <p className="w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-center text-sm font-medium text-emerald-800">
                    Student plan active
                  </p>
                ) : (
                  <Link
                    href="/verify-student"
                    className="block w-full rounded-xl bg-emerald-600 py-3 text-center font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    {studentPlan.cta}
                  </Link>
                )}
              </div>

              {/* Pro Plan */}
              <div className="relative flex flex-col rounded-2xl border-2 border-blue-500 bg-white p-7 shadow-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white">
                    {proPlan.badge}
                  </span>
                </div>

                <div className="mb-4 mt-1 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700">
                    <svg
                      className="h-5 w-5 text-white"
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
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{proPlan.name}</h2>
                    <p className="text-xs text-slate-400">{proPlan.note}</p>
                  </div>
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{proPlan.price}</span>
                  <span className="text-sm text-slate-500">{proPlan.cadence}</span>
                </div>
                <p className="mb-5 text-xs text-slate-400">Cancel anytime</p>

                <FeatureList items={proPlan.features} accent="blue" />

                <button
                  type="button"
                  onClick={handleProCheckout}
                  disabled={checkoutLoading}
                  className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkoutLoading ? "Redirecting to checkout..." : "Upgrade to Pro"}
                </button>

                <p className="mt-3 text-center text-xs text-slate-400">Secure payment via PayPal</p>
              </div>

              {/* Premium Plan */}
              <div className="relative flex flex-col rounded-2xl border-2 border-scale-purple/50 bg-white p-7 shadow-sm md:col-span-2 xl:col-span-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-scale-purple px-3 py-1 text-[11px] font-semibold text-white">
                    {premiumPlan.badge}
                  </span>
                </div>

                <div className="mb-4 mt-1 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699-.119a6 6 0 017.38-5.84H9.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{premiumPlan.name}</h2>
                    <p className="text-xs text-slate-400">{premiumPlan.note}</p>
                  </div>
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{premiumPlan.price}</span>
                  <span className="text-sm text-slate-500">{premiumPlan.cadence}</span>
                </div>
                <p className="mb-5 text-xs text-slate-400">Hands-off internship search</p>

                <FeatureList items={premiumPlan.features} accent="purple" />

                <Link
                  href={premiumPlan.href ?? "/contact-us?plan=premium"}
                  className="block w-full rounded-xl bg-scale-purple py-3 text-center font-medium text-white transition-colors hover:bg-scale-purple-dark"
                >
                  {premiumPlan.cta}
                </Link>

                <p className="mt-3 text-center text-xs text-slate-400">
                  We&apos;ll confirm your target roles before applying
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                Free tier includes up to {freeLimit} applications with no payment required.{" "}
                <Link href="/login" className="font-medium text-scale-purple hover:underline">
                  Get started free
                </Link>
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
