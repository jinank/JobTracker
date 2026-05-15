"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COMPANY_BRAND_COLORS,
  COMPANY_OPTIONS,
  INTERVIEW_TYPE_LABELS,
  INTERVIEW_TYPE_OPTIONS,
  PRACTICE_INTERVIEWS,
  ROLE_TYPE_OPTIONS,
  type InterviewType,
  type PracticeInterview,
} from "@/lib/practiceInterviewsData";

const PAGE_SIZE = 12;

function InterviewCard({ interview }: { interview: PracticeInterview }) {
  const brand =
    COMPANY_BRAND_COLORS[interview.companySlug] ?? "from-scale-purple to-violet-600";

  return (
    <Link
      href={`/practice-interviews/${interview.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card transition-all hover:border-scale-purple/30 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <CompanyRow interview={interview} brand={brand} />
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
          {INTERVIEW_TYPE_LABELS[interview.interviewType]}
        </span>
      </div>
      <p className="mt-2 text-[11px] font-medium text-slate-500">{interview.roleType}</p>
      <h2 className="mt-1 text-sm font-bold leading-snug text-slate-900 group-hover:text-scale-purple transition-colors">
        {interview.title}
      </h2>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-3">
        {interview.description}
      </p>
      <p className="mt-3 text-[11px] font-medium text-slate-400">
        {interview.durationMinutes} min
      </p>
    </Link>
  );
}

function CompanyRow({
  interview,
  brand,
}: {
  interview: PracticeInterview;
  brand: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${brand} flex items-center justify-center text-[10px] font-bold text-white uppercase`}
      >
        {interview.companySlug.slice(0, 2)}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {interview.companySlug}
        </p>
        <p className="text-xs font-bold text-slate-800 truncate">{interview.companyName}</p>
      </div>
    </div>
  );
}

export function PracticeInterviewsExplorer() {
  const [query, setQuery] = useState("");
  const [roleType, setRoleType] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [companySlug, setCompanySlug] = useState<string | null>(null);
  const [companySearch, setCompanySearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const companyQ = companySearch.trim().toLowerCase();
    return PRACTICE_INTERVIEWS.filter((i) => {
      if (roleType && i.roleType !== roleType) return false;
      if (interviewType && i.interviewType !== interviewType) return false;
      if (companySlug && i.companySlug !== companySlug) return false;
      if (companyQ && !i.companyName.toLowerCase().includes(companyQ)) return false;
      if (!q) return true;
      const blob = `${i.title} ${i.description} ${i.roleType} ${i.companyName}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query, roleType, interviewType, companySlug, companySearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">Practice Interviews</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Improve your interview skills
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          AI-powered mock interviews tailored to different companies and roles. Search, filter,
          and practice at your own pace.
        </p>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_220px]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="Search by title or description..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-scale-purple focus:ring-2 focus:ring-scale-purple/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Role type</span>
          <select
            value={roleType ?? ""}
            onChange={(e) => {
              setRoleType(e.target.value || null);
              resetPage();
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-scale-purple focus:ring-2 focus:ring-scale-purple/20"
          >
            <option value="">All role types</option>
            {ROLE_TYPE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Companies</span>
          <input
            type="search"
            value={companySearch}
            onChange={(e) => {
              setCompanySearch(e.target.value);
              resetPage();
            }}
            placeholder="Search companies..."
            className="mb-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-scale-purple focus:ring-2 focus:ring-scale-purple/20"
          />
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setCompanySlug(null);
                resetPage();
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                companySlug == null
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            {COMPANY_OPTIONS.filter(
              (c) =>
                !companySearch.trim() ||
                c.name.toLowerCase().includes(companySearch.trim().toLowerCase())
            ).map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setCompanySlug((prev) => (prev === c.slug ? null : c.slug));
                  resetPage();
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  companySlug === c.slug
                    ? "bg-scale-purple text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Interview type</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setInterviewType(null);
                resetPage();
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                interviewType == null
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              All
            </button>
            {INTERVIEW_TYPE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setInterviewType((prev) => (prev === t ? null : t));
                  resetPage();
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  interviewType === t
                    ? "bg-scale-purple text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {INTERVIEW_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 text-xs text-slate-500">
        {filtered.length} interview{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>

      {pageItems.length === 0 && (
        <p className="py-16 text-center text-sm text-slate-500">No interviews match your filters.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-400">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
