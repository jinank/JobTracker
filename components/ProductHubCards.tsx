"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PRODUCT_FEATURES } from "@/lib/productFeatures";

const ACCENTS: Record<string, { ring: string; icon: string; glow: string }> = {
  search: {
    ring: "hover:ring-emerald-500/30",
    icon: "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    glow: "from-emerald-500/5",
  },
  track: {
    ring: "hover:ring-scale-purple/40",
    icon: "bg-scale-purple/10 text-scale-purple group-hover:bg-scale-purple group-hover:text-white",
    glow: "from-scale-purple/8",
  },
  interview: {
    ring: "hover:ring-amber-500/30",
    icon: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    glow: "from-amber-500/5",
  },
  resources: {
    ring: "hover:ring-blue-500/30",
    icon: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    glow: "from-blue-500/5",
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
  resources: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};

export function ProductHubCards() {
  return (
    <section id="products" className="relative py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" aria-hidden />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(107,70,254,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.2) 0%, transparent 45%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">One portal</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need to land the role
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
            Find hidden openings, track every reply, practice interviews, and grab student perks.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {PRODUCT_FEATURES.map((f) => {
            const accent = ACCENTS[f.icon];
            return (
              <Link
                key={f.id}
                href={f.href}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${accent.ring}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
                  aria-hidden
                />
                <div
                  className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${accent.icon}`}
                >
                  {ICONS[f.icon]}
                </div>
                <h3 className="relative text-base font-bold text-white">{f.label}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
                  {f.description}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-300">
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
