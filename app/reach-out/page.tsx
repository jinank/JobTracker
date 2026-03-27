"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

interface RecruiterPerson {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  organizationName: string;
  linkedinUrl?: string;
}

function recruiterInitials(p: RecruiterPerson): string {
  const a = (p.firstName || "").trim();
  const b = (p.lastName || "").trim();
  const i1 = a[0] ?? "?";
  const i2 = b[0] ?? "";
  return (i1 + i2).toUpperCase();
}

function ReachOutContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const company = searchParams.get("company") ?? "";
  const role = searchParams.get("role") ?? "";

  const [people, setPeople] = useState<RecruiterPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);

  useEffect(() => {
    if (!company) {
      setError("No company specified");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setInfo(null);

    fetch(`/api/recruiters?company=${encodeURIComponent(company)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setInfo(null);
          setPeople([]);
        } else {
          setPeople(data.people ?? []);
          setDomain(data.domain ?? null);

          if ((data.people?.length ?? 0) === 0 && data.message) {
            setError(data.message);
            setInfo(null);
          } else {
            setError(null);
            setInfo(
              (data.people?.length ?? 0) > 0 && data.message ? data.message : null
            );
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load recruiters");
          setPeople([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [company]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-slate-600">Please sign in to view recruiters.</p>
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const hasResults = !loading && people.length > 0 && !error;

  return (
    <div className="min-h-0 flex-1 bg-slate-50 pb-10">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Back to dashboard"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900">Reach Out</h1>
              <p className="truncate text-xs text-slate-500">
                {company || "—"}
                {role ? ` · ${role}` : ""}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-slate-700 transition-colors hover:bg-slate-100"
          >
            <LogoMark className="h-8 w-8" iconClassName="w-4 h-4" />
            <span className="hidden text-sm font-bold text-slate-900 sm:inline">Rethinkjobs</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">{error}</p>
            {(error.includes("HUNTER_API_KEY") ||
              error.includes("HAPPENSTANCE_API_KEY") ||
              error.includes("CLAY_WEBHOOK_URL") ||
              error.includes("Recruiter search is not configured")) && (
              <p className="mt-2 text-xs text-amber-800">
                In <code className="rounded bg-amber-100/80 px-1">.env.local</code> add{" "}
                <code className="rounded bg-amber-100/80 px-1">HUNTER_API_KEY</code>,{" "}
                <code className="rounded bg-amber-100/80 px-1">HAPPENSTANCE_API_KEY</code>,{" "}
                <code className="rounded bg-amber-100/80 px-1">APOLLO_API_KEY</code>, or{" "}
                <code className="rounded bg-amber-100/80 px-1">CLAY_WEBHOOK_URL</code>. See{" "}
                <code className="rounded bg-amber-100/80 px-1">ENVIRONMENT.md</code>.
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : people.length === 0 && !error ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-800">No recruiters found</h3>
            <p className="mx-auto max-w-sm text-sm text-slate-500">
              We couldn&apos;t find hiring managers or recruiters at {company}. Try a different company or verify the
              company domain.
            </p>
            {domain && <p className="mt-2 text-xs text-slate-400">Searched domain: {domain}</p>}
          </div>
        ) : (
          <>
            {hasResults && (
              <div className="mb-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  {people.length} recruiter{people.length !== 1 ? "s" : ""} and hiring managers at{" "}
                  <span className="text-slate-900">{company}</span>
                  {domain && (
                    <span className="font-normal text-slate-600">
                      {" "}
                      ({domain})
                    </span>
                  )}
                </p>
                {info && <p className="mt-2 text-sm leading-relaxed text-slate-600">{info}</p>}
              </div>
            )}

            <ul className="space-y-3" aria-label="Recruiter and hiring contacts">
              {people.map((p) => (
                <li key={p.id}>
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="flex min-w-0 flex-1 flex-row items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white"
                          aria-hidden
                        >
                          {recruiterInitials(p)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {p.firstName} {p.lastName}
                          </p>
                          {p.title ? (
                            <p className="mt-0.5 text-xs text-slate-600">{p.title}</p>
                          ) : (
                            <p className="mt-0.5 text-xs text-slate-400">Role not listed</p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 sm:items-center sm:justify-end">
                        {p.linkedinUrl ? (
                          <a
                            href={p.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004182] sm:w-auto sm:py-2"
                          >
                            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">No LinkedIn</span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default function ReachOutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      }
    >
      <ReachOutContent />
    </Suspense>
  );
}
