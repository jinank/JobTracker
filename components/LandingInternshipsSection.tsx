"use client";

import { useMemo } from "react";
import Link from "next/link";
import { LandingCompanyInternshipTable } from "@/components/LandingCompanyInternshipTable";
import { ScrollReveal } from "@/components/landing/LandingMotion";
import { useInternshipPreview } from "@/hooks/useInternships";
import { groupJobsByCompany } from "@/lib/jobs/groupJobsByCompany";

const PREVIEW_LIMIT = 50;

export function LandingInternshipsSection() {
  const { jobs, stats, loading } = useInternshipPreview(PREVIEW_LIMIT, "updated-asc");
  const companyCount = useMemo(() => groupJobsByCompany(jobs).length, [jobs]);

  const totalLabel = stats?.totalActive ?? jobs.length;

  return (
    <section
      id="latest-internships"
      className="landing-section pt-4 pb-16 sm:pt-6 sm:pb-20"
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
                    {companyCount} companies from the latest US listings
                    {stats?.companies ? ` · ${stats.companies} on the full board` : ""}. Expand a
                    row to see every open role. No login required.
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
          <LandingCompanyInternshipTable
            jobs={jobs}
            loading={loading}
            emptyMessage="Internships sync every few hours. Check back soon."
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
