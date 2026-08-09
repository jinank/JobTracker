"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LoginLink } from "@/components/LoginLink";
import { ScrollReveal } from "@/components/landing/LandingMotion";
import { PROMPT_GUIDE_PATH } from "@/lib/promptGuide";

export function LandingPromptGuideTeaser() {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  return (
    <section
      id="ai-prompt-guide"
      className="landing-section pb-6 pt-2 sm:pb-8"
      aria-labelledby="landing-prompt-guide-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white shadow-lg">
            <div className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
              <div className="min-w-0 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300/90">
                  Limited time · Free resource
                </p>
                <h2
                  id="landing-prompt-guide-heading"
                  className="mt-2 text-xl font-bold tracking-tight sm:text-2xl"
                >
                  AI Prompt Guide (PDF)
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  15 playbooks from resume to offer - strategy under every prompt so you
                  move faster without sounding generic. Sign in to request access and get
                  the PDF after approval.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                {signedIn ? (
                  <Link
                    href={PROMPT_GUIDE_PATH}
                    className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300"
                  >
                    Request access
                  </Link>
                ) : (
                  <LoginLink
                    callbackUrl={PROMPT_GUIDE_PATH}
                    label="Sign in to get access"
                    className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300"
                  />
                )}
                <Link
                  href={PROMPT_GUIDE_PATH}
                  className="text-center text-xs font-medium text-slate-400 underline decoration-slate-600 underline-offset-2 hover:text-white sm:text-right"
                >
                  See what&apos;s inside
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
