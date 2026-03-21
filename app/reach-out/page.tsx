"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RecruiterPerson {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  organizationName: string;
  linkedinUrl?: string;
}

function ReachOutContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const company = searchParams.get("company") ?? "";
  const chainId = searchParams.get("chainId") ?? "";
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
              (data.people?.length ?? 0) > 0 && data.message
                ? data.message
                : null
            );
          }
        }
      })
      .catch((err) => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Please sign in to view recruiters.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-base font-bold text-slate-900">Reach Out</h1>
                <p className="text-xs text-slate-500">
                  {company}
                  {role && ` · ${role}`}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm font-semibold text-slate-900"
            >
              Rethinkjobs
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">{error}</p>
            {(error.includes("HUNTER_API_KEY") ||
              error.includes("HAPPENSTANCE_API_KEY") ||
              error.includes("CLAY_WEBHOOK_URL") ||
              error.includes("Recruiter search is not configured")) && (
              <p className="text-xs text-amber-600 mt-1">
                In <code className="bg-amber-100/80 px-1 rounded">.env.local</code> add{" "}
                <code className="bg-amber-100/80 px-1 rounded">HUNTER_API_KEY</code>,{" "}
                <code className="bg-amber-100/80 px-1 rounded">HAPPENSTANCE_API_KEY</code>,{" "}
                <code className="bg-amber-100/80 px-1 rounded">APOLLO_API_KEY</code>, or{" "}
                <code className="bg-amber-100/80 px-1 rounded">CLAY_WEBHOOK_URL</code>. See{" "}
                <code className="bg-amber-100/80 px-1 rounded">ENVIRONMENT.md</code>.
              </p>
            )}
          </div>
        )}

        {info && !error && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-sky-900">{info}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : people.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No recruiters found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find hiring managers or recruiters at {company}. Try a different company or verify the company domain.
            </p>
            {domain && (
              <p className="text-xs text-slate-400 mt-2">Searched domain: {domain}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 mb-4">
              {people.length} recruiter{people.length !== 1 ? "s" : ""} and hiring managers at {company}
              {domain && ` (${domain})`}
            </p>
            {people.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {p.firstName[0]}{p.lastName[0] || ""}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {p.firstName} {p.lastName}
                    </p>
                    {p.title && (
                      <p className="text-xs text-slate-500 truncate">{p.title}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {p.linkedinUrl ? (
                    <a
                      href={p.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A66C2] text-white text-xs font-medium hover:bg-[#004182] transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No LinkedIn</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ReachOutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReachOutContent />
    </Suspense>
  );
}
