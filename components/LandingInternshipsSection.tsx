"use client";

import Link from "next/link";
import { InternshipTable } from "@/components/InternshipTable";
import { ScrollReveal } from "@/components/landing/LandingMotion";
import { useInternshipPreview } from "@/hooks/useInternships";

const PREVIEW_LIMIT = 50;

export function LandingInternshipsSection() {
  const { jobs, stats, loading } = useInternshipPreview(PREVIEW_LIMIT);

  const totalLabel = stats?.totalActive ?? jobs.length;

  return (
    <section
      id="latest-internships"
      className="landing-section py-20 sm:py-24"
      aria-labelledby="latest-internships-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Live listings
              </span>
              <h2
                id="latest-internships-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
              >
                Latest Summer 2027 internships
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-500">
                {totalLabel > 0 ? (
                  <>
                    Showing the {Math.min(PREVIEW_LIMIT, jobs.length)} most recent US internships
                    from company career pages
                    {stats?.companies ? ` across ${stats.companies} companies` : ""}. No login
                    required.
                  </>
                ) : (
                  <>US internships sync every few hours from company career pages. No login required.</>
                )}
              </p>
            </div>
            <Link
              href="/find-internships"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all internships
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <InternshipTable
            jobs={jobs}
            loading={loading}
            emptyMessage="Internships sync every few hours. Check back soon."
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
