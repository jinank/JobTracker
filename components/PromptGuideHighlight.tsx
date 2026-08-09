"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LoginLink } from "@/components/LoginLink";
import {
  PROMPT_GUIDE_PATH,
  PROMPT_GUIDE_RESOURCE_ID,
} from "@/lib/promptGuide";

export function PromptGuideHighlight() {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signedIn) {
      setRequestStatus(null);
      return;
    }
    fetch("/api/user/resource-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const st = data?.requests?.[PROMPT_GUIDE_RESOURCE_ID]?.status;
        setRequestStatus(typeof st === "string" ? st : null);
      })
      .catch(() => {});
  }, [signedIn]);

  async function handleRequest() {
    setRequesting(true);
    setError(null);
    try {
      const res = await fetch("/api/user/resource-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: PROMPT_GUIDE_RESOURCE_ID }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.hint ? `${data.error} ${data.hint}` : data.error ?? "Request failed");
        return;
      }
      setRequestStatus(data.status ?? "pending");
    } catch {
      setError("Request failed. Try again.");
    } finally {
      setRequesting(false);
    }
  }

  const pending = requestStatus === "pending";
  const approved = requestStatus === "approved";

  return (
    <section
      className="mb-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white shadow-lg"
      aria-labelledby="prompt-guide-highlight-heading"
    >
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300/90">
            Limited time · Free resource
          </p>
          <h2
            id="prompt-guide-highlight-heading"
            className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            AI Prompt Guide (PDF)
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            SuperInterns&apos; own playbook set - 15 stages from resume to offer,
            with strategy under every prompt so you move faster without sounding
            generic.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-amber-300" aria-hidden>
                ✓
              </span>
              <span>Request access - we review and send the PDF when approved</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-300" aria-hidden>
                ✓
              </span>
              <span>Works with Claude, ChatGPT, Gemini - any AI tool</span>
            </li>
          </ul>
          {error && (
            <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              {error}
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {!signedIn ? (
              <LoginLink
                callbackUrl="/resources"
                label="Sign in to request access"
                className="inline-flex rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300"
              />
            ) : approved ? (
              <span className="inline-flex rounded-xl bg-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                Access approved - PDF coming via email
              </span>
            ) : pending ? (
              <span className="inline-flex rounded-xl bg-amber-500/20 px-5 py-2.5 text-sm font-semibold text-amber-100 ring-1 ring-amber-400/30">
                Request sent
              </span>
            ) : (
              <button
                type="button"
                onClick={() => void handleRequest()}
                disabled={requesting}
                className="inline-flex rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 disabled:opacity-60"
              >
                {requesting ? "Sending…" : "Request PDF access"}
              </button>
            )}
            <Link
              href={PROMPT_GUIDE_PATH}
              className="text-sm font-medium text-slate-300 underline decoration-slate-600 underline-offset-2 hover:text-white"
            >
              See what&apos;s inside
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-center border-t border-white/10 bg-white/[0.04] px-6 py-8 sm:px-8 lg:border-l lg:border-t-0">
          <p className="text-sm font-semibold text-white">What&apos;s in the PDF</p>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-black/20 px-2 py-3">
              <dt className="text-xl font-bold text-amber-300">15</dt>
              <dd className="mt-1 text-[11px] text-slate-400">Playbooks</dd>
            </div>
            <div className="rounded-xl bg-black/20 px-2 py-3">
              <dt className="text-xl font-bold text-amber-300">35+</dt>
              <dd className="mt-1 text-[11px] text-slate-400">Prompts</dd>
            </div>
            <div className="rounded-xl bg-black/20 px-2 py-3">
              <dt className="text-xl font-bold text-amber-300">1</dt>
              <dd className="mt-1 text-[11px] text-slate-400">Clear arc</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-slate-400">
            Free with approval. No payment - request access from Resources and we
            send the SuperInterns PDF when your request is approved.
          </p>
        </div>
      </div>
    </section>
  );
}
