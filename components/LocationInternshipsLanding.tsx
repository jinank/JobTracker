"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { InternshipTable } from "@/components/InternshipTable";
import { LoginLink } from "@/components/LoginLink";
import { SiteNavMarketing } from "@/components/SiteNav";
import { ROLE_CATEGORIES } from "@/lib/jobs/constants";
import type { InternshipsQueryResult } from "@/lib/jobs/queryInternships";

const PAGE_SIZE = 25;

/** Shared shape for location + topic SEO landing pages. */
export type BrowseInternshipsPage = {
  path: string;
  heading: string;
  intro: string;
  relatedLinks: { href: string; label: string }[];
  badgeLabel?: string;
  countPhrase?: string;
};

type Props = {
  page: BrowseInternshipsPage;
  initial: InternshipsQueryResult;
};

export function LocationInternshipsLanding({ page, initial }: Props) {
  const [search, setSearch] = useState("");
  const [roleCategory, setRoleCategory] = useState("All roles");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initial.jobs.filter((job) => {
      if (roleCategory !== "All roles" && job.roleCategory !== roleCategory) {
        return false;
      }
      if (!q) return true;
      const blob =
        `${job.company} ${job.title} ${job.location} ${job.roleCategory}`.toLowerCase();
      return blob.includes(q);
    });
  }, [initial.jobs, search, roleCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageJobs = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const companies = new Set(filtered.map((j) => j.company)).size;
  const badgeLabel = page.badgeLabel ?? "Summer 2027 · US internships";
  const countPhrase = page.countPhrase ?? "in this area";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteNavMarketing />
      <main id="main-content" className="flex-1">
        <section
          className="relative overflow-hidden landing-hero-mesh border-b border-slate-200/80 pb-10 pt-10 sm:pb-12 sm:pt-14"
          aria-labelledby="location-internships-heading"
        >
          <div className="pointer-events-none absolute inset-0 landing-hero-grid" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-semibold text-emerald-600">{badgeLabel}</p>
            <h1
              id="location-internships-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              {page.heading}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              {page.intro}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              {filtered.length > 0 ? (
                <>
                  <strong className="font-semibold text-slate-700">{filtered.length}</strong>{" "}
                  {filtered.length === 1 ? "internship" : "internships"} {countPhrase}
                  {companies > 0 ? (
                    <>
                      {" "}
                      across <strong className="font-semibold text-slate-700">{companies}</strong>{" "}
                      {companies === 1 ? "company" : "companies"}
                    </>
                  ) : null}
                  . No login required to browse.
                </>
              ) : (
                <>Listings sync every few hours from company career pages. No login required.</>
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LoginLink
                callbackUrl={page.path}
                className="inline-flex items-center justify-center rounded-xl bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-scale-purple-dark"
              >
                Get started free
              </LoginLink>
              <Link
                href="/find-internships"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Browse all internships
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12" aria-label="Internship listings">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative block flex-1">
                  <span className="sr-only">Search company or role</span>
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search company, role, or keyword"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-scale-purple focus:outline-none focus:ring-2 focus:ring-scale-purple/20"
                  />
                </label>
                <label className="block sm:w-48">
                  <span className="sr-only">Role category</span>
                  <select
                    value={roleCategory}
                    onChange={(e) => {
                      setRoleCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-scale-purple focus:outline-none focus:ring-2 focus:ring-scale-purple/20"
                  >
                    {ROLE_CATEGORIES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <InternshipTable
              jobs={pageJobs}
              showWorkType={false}
              emptyMessage={`No ${page.heading.toLowerCase()} match your search yet. Try clearing filters or browse all internships.`}
            />

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                  Page {safePage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {page.relatedLinks.length > 0 && (
          <section className="border-t border-slate-200/80 bg-slate-50/80 py-10 sm:py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">Related searches</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {page.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-scale-purple/30 hover:text-scale-purple"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
