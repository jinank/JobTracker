"use client";

import { LoginLink } from "@/components/LoginLink";
import { ScrollReveal } from "@/components/landing/LandingMotion";

export function LandingReferEarnSection() {
  return (
    <section
      id="refer"
      className="landing-section py-20 sm:py-24"
      aria-labelledby="refer-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="scale">
          <div className="overflow-hidden rounded-[2rem] border border-scale-purple/15 bg-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-scale-purple">
              Pro for a month
            </span>
            <h2
              id="refer-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Refer and Earn
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Refer your friends and get 1 month of Pro subscription completely free
            </p>
            <LoginLink
              callbackUrl="/"
              className="mt-8 inline-flex rounded-xl bg-scale-purple px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-scale-purple-dark active:scale-[0.98]"
            >
              Get started
            </LoginLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
