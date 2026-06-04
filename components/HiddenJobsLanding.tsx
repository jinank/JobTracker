"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { NavAuthAction } from "@/components/NavAuthAction";
import {
  HIDDEN_JOBS_PREVIEW,
  HIDDEN_JOBS_STATS,
  ROLE_CATEGORIES,
  type HiddenJob,
} from "@/lib/hiddenJobsData";

const COMPARISON = {
  boards: [
    "Posted 1 hour ago, 200+ applicants",
    "Low reply rate for interviews",
    "Advertised jobs often mean more competition",
    "Recruiter fees; companies prefer direct hires",
    "Fake or stale listings",
  ],
  rethink: [
    "Less competition on company career pages",
    "Higher chance of a real human reply",
    "Roles that never hit the big job boards",
    "Apply straight to the hiring team",
    "Curated from real career pages",
  ],
};

const HERO_PREVIEW_JOBS = HIDDEN_JOBS_PREVIEW.slice(0, 4);

function CheckIcon({ className = "h-5 w-5 text-scale-purple" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

const FAQ = [
  {
    q: "What roles do you search for?",
    a: "Engineering, product, design, data, marketing, and operations: anything we can find on company career pages. Browse the free preview below.",
  },
  {
    q: "What countries are jobs from?",
    a: "Primarily English-language postings from companies worldwide, with a focus on US and remote-friendly roles in the preview.",
  },
  {
    q: "Is this the same as LinkedIn or Indeed?",
    a: "No. We surface jobs from company websites directly, not aggregated job-board listings with heavy applicant volume.",
  },
];

function JobCard({ job }: { job: HiddenJob }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Company site</p>
          <h3 className="text-sm font-bold text-slate-900">{job.company}</h3>
        </div>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          {job.workType}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-800 leading-snug">{job.title}</p>
      <p className="mt-1 text-xs text-slate-500">{job.location}</p>
      <p className="mt-2 text-[11px] text-slate-400">
        Posted {job.postedDaysAgo === 1 ? "1 day" : `${job.postedDaysAgo} days`} ago · Preview
      </p>
      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center rounded-xl border border-scale-purple/30 bg-scale-mist/50 px-4 py-2.5 text-xs font-semibold text-scale-purple hover:bg-scale-purple hover:text-white transition-colors"
      >
        Apply on company site
      </a>
    </article>
  );
}

/** Marketing landing for /find-jobs (logged-out visitors). */
export function HiddenJobsLanding() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("All roles");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HIDDEN_JOBS_PREVIEW.filter((j) => {
      if (role !== "All roles" && j.roleCategory !== role) return false;
      if (!q) return true;
      const blob = `${j.company} ${j.title} ${j.location} ${j.roleCategory}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query, role]);

  return (
    <div className="pb-16">
      {/* Hero — matches Track Jobs landing layout */}
      <section
        className="relative overflow-hidden landing-hero-mesh pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16"
        aria-labelledby="find-jobs-hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 landing-hero-grid" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
          <div className="landing-hero-stagger text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-scale-purple/20 bg-white/80 px-4 py-1.5 text-xs font-semibold text-scale-purple shadow-sm backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Hidden Job Search · Company career pages
            </p>
            <h1
              id="find-jobs-hero-heading"
              className="mb-6 text-[2rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]"
            >
              Find jobs{" "}
              <span className="text-hero-gradient">not on job boards</span>
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-slate-600 lg:mx-0 lg:text-lg">
              Roles from company sites directly. Less competition, more real conversations with hiring teams.
            </p>
            <div className="mx-auto mb-8 grid max-w-md gap-3 sm:grid-cols-2 lg:mx-0 lg:max-w-none">
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm backdrop-blur-sm">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CheckIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-slate-900">Direct apply</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Skip aggregated boards. Apply on the company site.</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm backdrop-blur-sm">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-scale-purple/10 text-scale-purple">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-900">Fresh listings</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Engineering, product, design, data, and more.</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href="#job-listings"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-scale-purple px-8 py-4 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(107,70,254,0.3),0_12px_32px_-8px_rgba(107,70,254,0.45)] transition-all hover:bg-scale-purple-dark hover:shadow-lg active:scale-[0.98] sm:w-auto"
              >
                View jobs
              </a>
              <NavAuthAction
                callbackUrl="/find-jobs"
                signInLabel="Sign in for full access"
                signedInLabel="Open Track Jobs"
                className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-slate-200/90 bg-white/90 px-8 py-4 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-scale-purple/40 hover:bg-white sm:w-auto"
              />
            </div>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 lg:justify-start">
              <span>
                <span className="font-semibold text-slate-700">{HIDDEN_JOBS_STATS.searchersLabel}</span> searchers
              </span>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <span>
                <span className="font-semibold text-slate-700">{HIDDEN_JOBS_STATS.jobsLabel}</span> roles found
              </span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div
              className="relative landing-pipeline-glow rounded-3xl border border-white/80 bg-white/95 p-1 backdrop-blur-sm animate-float-slow motion-reduce:animate-none"
              style={{ animationDelay: "-1s" }}
            >
              <div className="rounded-[1.35rem] bg-gradient-to-br from-scale-lavender/90 via-white to-slate-50 p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-scale-purple">Live preview</p>
                    <p className="text-2xl font-bold text-slate-900">Hidden job search</p>
                  </div>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-emerald-500/20">
                    <span className="text-lg font-bold text-emerald-600">{HIDDEN_JOBS_PREVIEW.length}</span>
                    <span className="text-[9px] font-semibold uppercase text-slate-500">roles</span>
                  </div>
                </div>
                <div className="mb-5 flex h-3 gap-1 overflow-hidden rounded-full bg-white/80 p-0.5 shadow-inner">
                  <div className="w-[72%] rounded-full bg-emerald-500" title="Company sites" />
                  <div className="flex-1 rounded-full bg-slate-200" title="Job boards" />
                </div>
                <p className="mb-4 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <span className="text-emerald-700">Company sites</span>
                  <span>Job boards</span>
                </p>
                <div className="space-y-2.5">
                  {HERO_PREVIEW_JOBS.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm transition-transform hover:scale-[1.01]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{job.company}</p>
                        <p className="truncate text-xs text-slate-500">{job.title}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                        {job.workType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-14 sm:py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 mb-10">
            Tired of auto-rejections on job boards?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-red-200/80 bg-red-50/50 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-red-800 mb-4">
                LinkedIn / Indeed
              </h3>
              <ul className="space-y-2.5">
                {COMPARISON.boards.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-red-900/90">
                    <span className="text-red-500 shrink-0">✕</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 ring-2 ring-scale-purple/20">
              <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800 mb-4">
                RethinkJobs Hidden Search
              </h3>
              <ul className="space-y-2.5">
                {COMPARISON.rethink.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-emerald-900/90">
                    <span className="text-emerald-600 shrink-0">✓</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="job-listings" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
            <strong>Free preview:</strong> Sample listings below. Sign in to browse the full catalog with filters,
            details, and apply links, and sync applications to{" "}
            <Link href="/" className="font-semibold text-scale-purple hover:underline">
              Track Jobs
            </Link>
            .
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex-1 block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">Search</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Company, title, or location…"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-scale-purple focus:ring-2 focus:ring-scale-purple/20"
              />
            </label>
            <label className="block w-full sm:w-56">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">Role type</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-scale-purple focus:ring-2 focus:ring-scale-purple/20"
              >
                {ROLE_CATEGORIES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mb-4 text-xs text-slate-500">
            Showing {filtered.length} preview job{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-500">No jobs match your filters.</p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 bg-scale-mist/40 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200/80 bg-white p-5">
                <h3 className="text-sm font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Find hidden roles. Track every reply.</h2>
          <p className="mt-3 text-slate-600">
            Use Hidden Job Search to discover roles, Interview Prep to practice, and Track Jobs to manage your
            pipeline, all in RethinkJobs.
          </p>
          <div className="mt-6 flex justify-center">
            <NavAuthAction
              callbackUrl="/find-jobs"
              signInLabel="Get started free"
              signedInLabel="Back to Track Jobs"
              className="rounded-full bg-scale-purple px-8 py-3.5 text-sm font-semibold text-white hover:bg-scale-purple-dark transition-colors"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
