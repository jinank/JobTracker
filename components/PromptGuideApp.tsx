"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LoginLink } from "@/components/LoginLink";
import {
  PROMPT_GUIDE_PATH,
  PROMPT_GUIDE_PLAYBOOK_TITLES,
  PROMPT_GUIDE_RESOURCE_ID,
  PROMPT_GUIDE_STAGES,
} from "@/lib/promptGuide";

export function PromptGuideApp() {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!signedIn) {
      setRequestStatus(null);
      return;
    }
    try {
      const res = await fetch("/api/user/resource-access");
      const data = await res.json();
      const st = data?.requests?.[PROMPT_GUIDE_RESOURCE_ID]?.status;
      setRequestStatus(typeof st === "string" ? st : null);
    } catch {
      setRequestStatus(null);
    }
  }, [signedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
        Resources · Featured
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        AI Prompt Guide (PDF)
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        SuperInterns&apos; job-search prompt system - 15 playbooks from the first
        resume draft to the offer conversation. Request access and we send the PDF
        after approval. Prompt content stays private until then.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800 ring-1 ring-emerald-100">
          Free with approval
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
          15 playbooks · 35+ prompts
        </span>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Request access</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in, submit a request, and our team will approve and share the PDF.
          No payment required.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!signedIn ? (
            <LoginLink
              callbackUrl={PROMPT_GUIDE_PATH}
              label="Sign in to request access"
              className="inline-flex rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300"
            />
          ) : approved ? (
            <span className="inline-flex rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
              Access approved - check your email for the PDF
            </span>
          ) : pending ? (
            <span className="inline-flex rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900 ring-1 ring-amber-100">
              Request sent - we&apos;ll review shortly
            </span>
          ) : (
            <button
              type="button"
              onClick={() => void handleRequest()}
              disabled={requesting}
              className="inline-flex rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 disabled:opacity-60"
            >
              {requesting ? "Sending…" : "Request PDF access"}
            </button>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">The four stages</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PROMPT_GUIDE_STAGES.map((s) => (
            <li
              key={s.stage}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Stage {s.stage}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{s.title}</p>
              <p className="mt-1 text-xs text-slate-500">{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">Playbooks in the PDF</h2>
        <p className="mt-2 text-sm text-slate-600">
          Full prompts and strategy sections are only in the approved PDF.
        </p>
        <ol className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {PROMPT_GUIDE_PLAYBOOK_TITLES.map((title) => (
            <li
              key={title}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <span className="text-slate-300" aria-hidden>
                ▸
              </span>
              {title}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
