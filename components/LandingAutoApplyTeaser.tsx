"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/landing/LandingMotion";

export function LandingAutoApplyTeaser() {
  return (
    <section
      id="auto-apply"
      className="landing-section pb-6 pt-2 sm:pb-8"
      aria-labelledby="landing-auto-apply-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-scale-purple/20 bg-gradient-to-br from-scale-purple via-violet-600 to-scale-purple-deep text-white shadow-lg">
            <div className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
              <div className="min-w-0 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-200">
                  New · One-click apply
                </p>
                <h2
                  id="landing-auto-apply-heading"
                  className="mt-2 text-xl font-bold tracking-tight sm:text-2xl"
                >
                  We apply for you
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-violet-100">
                  Save your resume and apply profile once. Click Apply on a listing and we
                  submit on the company career page. Pro and Premium include 100 internship
                  applications on your behalf.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <Link
                  href="/find-internships"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-scale-purple shadow-sm transition hover:bg-scale-mist"
                >
                  Browse internships
                </Link>
                <Link
                  href="#pricing"
                  className="text-center text-xs font-medium text-violet-200 underline decoration-violet-300/60 underline-offset-2 hover:text-white sm:text-right"
                >
                  See Pro and Premium
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
