"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PRODUCT_FEATURES } from "@/lib/productFeatures";

const ACCENTS: Record<
  string,
  { border: string; icon: string; wash: string; cta: string }
> = {
  search: {
    border: "hover:border-emerald-300",
    icon: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    wash: "from-emerald-50",
    cta: "text-emerald-700",
  },
  track: {
    border: "hover:border-scale-purple/40",
    icon: "bg-scale-purple/10 text-scale-purple group-hover:bg-scale-purple group-hover:text-white",
    wash: "from-scale-lavender",
    cta: "text-scale-purple",
  },
  interview: {
    border: "hover:border-amber-300",
    icon: "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white",
    wash: "from-amber-50",
    cta: "text-amber-700",
  },
  mentors: {
    border: "hover:border-rose-300",
    icon: "bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
    wash: "from-rose-50",
    cta: "text-rose-600",
  },
  resources: {
    border: "hover:border-sky-300",
    icon: "bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
    wash: "from-sky-50",
    cta: "text-sky-700",
  },
};

const ICONS: Record<string, ReactNode> = {
  search: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  track: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  interview: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  mentors: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  resources: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};

export function ProductHubCards() {
  return (
    <section id="products" className="relative overflow-hidden bg-gradient-to-b from-white via-scale-mist/60 to-white py-20 lg:py-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
            Everything in one place
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Five tools. One internship search.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600 sm:text-base">
            Find openings, track every reply, practice interviews, meet mentors,
            and grab your student perks.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_FEATURES.map((f) => {
            const accent = ACCENTS[f.icon];
            return (
              <Link
                key={f.id}
                href={f.href}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${accent.border}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.wash} to-transparent opacity-0 transition-opacity group-hover:opacity-60`}
                  aria-hidden
                />
                <div
                  className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300 ${accent.icon}`}
                >
                  {ICONS[f.icon]}
                </div>
                <h3 className="relative text-base font-bold text-slate-900">{f.label}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {f.description}
                </p>
                <span className={`relative mt-5 inline-flex items-center gap-1 text-sm font-semibold ${accent.cta}`}>
                  Open
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
