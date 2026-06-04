"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { LoginLink } from "@/components/LoginLink";
import { RETHINKJOBS_COMING_SOON_RESOURCES } from "@/lib/rethinkJobsResources";
import {
  STUDENT_DEALS,
  STUDENT_DEAL_CATEGORY_OPTIONS,
  dealExternalHref,
  type StudentDeal,
} from "@/lib/studentDealsData";
import type { RethinkJobsResource } from "@/lib/rethinkJobsResources";

const RESOURCE_ICONS: Record<string, ReactNode> = {
  "linkedin-profile-review": (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.062 2.062 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  "resume-review": (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  "linkedin-headshot": (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-3.704 0l-.822 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

function ComingSoonResourceCard({ resource }: { resource: RethinkJobsResource }) {
  const icon = RESOURCE_ICONS[resource.id];
  return (
    <article className="flex h-full min-h-[11rem] flex-col items-center rounded-2xl border border-slate-200/90 bg-white px-5 py-6 text-center shadow-sm">
      <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-scale-purple/10 text-scale-purple">
        {icon}
      </div>
      <h2 className="text-base font-bold text-slate-900">{resource.title}</h2>
      <p className="mt-2 text-sm text-slate-500 leading-snug">{resource.tagline}</p>
      <span className="mt-auto pt-5 rounded-full bg-scale-mist px-3 py-1 text-[11px] font-semibold text-scale-purple">
        Coming soon
      </span>
    </article>
  );
}

function DealCard({ deal }: { deal: StudentDeal }) {
  const href = dealExternalHref(deal);
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {deal.provider}
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-100">
          {deal.badge}
        </span>
      </div>
      <h2 className="text-sm font-bold leading-snug text-slate-900">{deal.title}</h2>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">{deal.description}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        <p>
          <span className="font-semibold text-slate-800">{deal.studentPrice}</span>
          {deal.regularPrice ? (
            <span className="text-slate-400 line-through decoration-slate-300 ml-2">
              {deal.regularPrice}
            </span>
          ) : null}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap gap-1">
          {deal.categories.slice(0, 2).map((c) => (
            <span
              key={c}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
            >
              {c}
            </span>
          ))}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-scale-purple px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-scale-purple-dark"
        >
          Get deal
        </a>
      </div>
    </article>
  );
}

export function StudentDealsExplorer() {
  const { status } = useSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const signedIn = status === "authenticated";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENT_DEALS.filter((d) => {
      if (category && !d.categories.includes(category)) return false;
      if (!q) return true;
      const blob = `${d.provider} ${d.title} ${d.description} ${d.categories.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query, category]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <section className="mb-12" aria-labelledby="rethinkjobs-resources-heading">
        <div className="mb-8 text-center sm:text-left">
          <h2
            id="rethinkjobs-resources-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            Free for members
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Free with your RethinkJobs account. Launching soon.
            {!signedIn && (
              <>
                {" "}
                <LoginLink
                  callbackUrl="/resources"
                  label="Sign in"
                  className="font-medium text-scale-purple hover:underline"
                />
              </>
            )}
          </p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-3">
          {RETHINKJOBS_COMING_SOON_RESOURCES.map((resource) => (
            <li key={resource.id} className="h-full">
              <ComingSoonResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mb-8 border-t border-slate-200/80 pt-8">
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-950/90">
          <strong className="font-semibold">Heads up:</strong> Programs, prices, and eligibility change
          often. Always confirm the current offer on the provider&apos;s official site. Rethinkjobs
          doesn&apos;t run these programs and may earn nothing from these links.
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {STUDENT_DEALS.length} curated programs
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Student discounts &amp; education offers
          </h1>
        </div>
        <label className="block w-full sm:max-w-sm">
          <span className="sr-only">Search deals</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, companies, topics…"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-scale-purple/20 placeholder:text-slate-400 focus:border-scale-purple focus:ring-2"
          />
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            category == null
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          All
        </button>
        {STUDENT_DEAL_CATEGORY_OPTIONS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory((prev) => (prev === c ? null : c))}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              category === c
                ? "bg-scale-purple text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-scale-lavender"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No deals match your filters. Try clearing search or choosing &quot;All&quot;.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deal) => (
            <li key={deal.id}>
              <DealCard deal={deal} />
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
