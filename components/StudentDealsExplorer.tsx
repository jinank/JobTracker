"use client";

import { useMemo, useState } from "react";
import {
  STUDENT_DEALS,
  STUDENT_DEAL_CATEGORY_OPTIONS,
  dealExternalHref,
  type StudentDeal,
} from "@/lib/studentDealsData";

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

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
  );
}
