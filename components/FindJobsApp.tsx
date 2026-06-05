"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { SiteNavApp } from "@/components/SiteNav";
import { FindJobListCard } from "@/components/FindJobListCard";
import { useChains } from "@/hooks/useChains";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  HIDDEN_JOBS_PREVIEW,
  ROLE_CATEGORIES,
  WORK_TYPES,
} from "@/lib/hiddenJobsData";
import {
  filterHiddenJobs,
  sortHiddenJobs,
  type JobSortField,
  type PostedPreset,
  type SortDir,
  type WorkTypeFilter,
} from "@/lib/findJobsFilters";

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const POSTED_OPTIONS: { value: PostedPreset; label: string }[] = [
  { value: "all", label: "Any time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "30d", label: "Last 30 days" },
];

const SORT_OPTIONS: { value: JobSortField; label: string }[] = [
  { value: "posted", label: "Date posted" },
  { value: "company", label: "Company" },
  { value: "role", label: "Role" },
  { value: "location", label: "Location" },
];

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0 flex-1 sm:flex-none sm:min-w-[9rem]">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
      >
        {children}
      </select>
    </label>
  );
}

export function FindJobsApp() {
  const { data: session } = useSession();
  const { chains } = useChains();
  const activeCount = chains.filter(
    (c) => !["REJECTED", "GHOSTED", "WITHDRAWN"].includes(c.status)
  ).length;

  const [search, setSearch] = useState("");
  const [roleCategory, setRoleCategory] = useState("All roles");
  const [workType, setWorkType] = useState<WorkTypeFilter>("all");
  const [employmentType, setEmploymentType] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [postedPreset, setPostedPreset] = useState<PostedPreset>("all");
  const [locationQuery, setLocationQuery] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sortField, setSortField] = useState<JobSortField>("posted");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const filtered = useMemo(() => {
    const list = filterHiddenJobs(HIDDEN_JOBS_PREVIEW, {
      search,
      roleCategory,
      workType,
      employmentType,
      experienceLevel,
      postedPreset,
      locationQuery,
    });
    return sortHiddenJobs(list, sortField, sortDir);
  }, [
    search,
    roleCategory,
    workType,
    employmentType,
    experienceLevel,
    postedPreset,
    locationQuery,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = useCallback(() => setPage(1), []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (roleCategory !== "All roles") n++;
    if (workType !== "all") n++;
    if (employmentType !== "all") n++;
    if (experienceLevel !== "all") n++;
    if (postedPreset !== "all") n++;
    if (locationQuery.trim()) n++;
    return n;
  }, [roleCategory, workType, employmentType, experienceLevel, postedPreset, locationQuery]);

  function clearFilters() {
    setRoleCategory("All roles");
    setWorkType("all");
    setEmploymentType("all");
    setExperienceLevel("all");
    setPostedPreset("all");
    setLocationQuery("");
    setSearch("");
    setPage(1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteNavApp activeCount={activeCount}>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
          {session?.user?.email && (
            <span className="hidden max-w-[140px] truncate text-xs text-slate-500 md:inline">
              {session.user.email}
            </span>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Sign out"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </SiteNavApp>

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <header className="mb-6">
            <h1 className="text-lg font-bold text-slate-900">Find Jobs</h1>
            <p className="mt-1 text-sm text-slate-500">
              Company career pages — less competition than job boards.
            </p>
          </header>

          {/* Filters */}
          <section
            className="mb-6 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4"
            aria-label="Job filters"
          >
            <div className="relative mb-4">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
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
                  resetPage();
                }}
                placeholder="Search company, role, or location"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <FilterSelect
                label="Posted"
                value={postedPreset}
                onChange={(v) => {
                  setPostedPreset(v as PostedPreset);
                  resetPage();
                }}
              >
                {POSTED_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Role"
                value={roleCategory}
                onChange={(v) => {
                  setRoleCategory(v);
                  resetPage();
                }}
              >
                {ROLE_CATEGORIES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Work type"
                value={workType}
                onChange={(v) => {
                  setWorkType(v as WorkTypeFilter);
                  resetPage();
                }}
              >
                <option value="all">All</option>
                {WORK_TYPES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Employment"
                value={employmentType}
                onChange={(v) => {
                  setEmploymentType(v);
                  resetPage();
                }}
              >
                <option value="all">All</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </FilterSelect>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMoreFilters((v) => !v)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
                aria-expanded={showMoreFilters}
              >
                {showMoreFilters ? "Hide" : "More"} filters
                {activeFilterCount > 0 && !showMoreFilters ? ` (${activeFilterCount})` : ""}
              </button>
              {(activeFilterCount > 0 || search.trim()) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>

            {showMoreFilters && (
              <div className="mt-3 flex flex-wrap gap-3 border-t border-slate-200/80 pt-3">
                <label className="block min-w-0 flex-1 sm:min-w-[12rem]">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Location
                  </span>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      resetPage();
                    }}
                    placeholder="e.g. Remote, NYC"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </label>
                <FilterSelect
                  label="Experience"
                  value={experienceLevel}
                  onChange={(v) => {
                    setExperienceLevel(v);
                    resetPage();
                  }}
                >
                  <option value="all">All levels</option>
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </FilterSelect>
              </div>
            )}
          </section>

          {/* Results toolbar */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filtered.length}</span>
              {filtered.length === 1 ? " job" : " jobs"}
              {search.trim() ? (
                <span className="text-slate-500"> matching &ldquo;{search.trim()}&rdquo;</span>
              ) : null}
            </p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                Sort
                <select
                  value={`${sortField}-${sortDir}`}
                  onChange={(e) => {
                    const [field, dir] = e.target.value.split("-") as [JobSortField, SortDir];
                    setSortField(field);
                    setSortDir(dir);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-blue-400 focus:outline-none"
                >
                  {SORT_OPTIONS.flatMap((o) => [
                    <option key={`${o.value}-asc`} value={`${o.value}-asc`}>
                      {o.label} (A→Z / newest)
                    </option>,
                    <option key={`${o.value}-desc`} value={`${o.value}-desc`}>
                      {o.label} (Z→A / oldest)
                    </option>,
                  ])}
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-500">
                Show
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-blue-400 focus:outline-none"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Job list */}
          <div className="space-y-2">
            {paginated.map((job) => (
              <FindJobListCard key={job.id} job={job} />
            ))}
            {paginated.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-14 text-center">
                <p className="text-sm font-medium text-slate-700">No jobs match these filters</p>
                <p className="mt-1 text-xs text-slate-500">Try clearing filters or widening the date range.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5"
              aria-label="Pagination"
            >
              <p className="text-xs text-slate-400">
                Page {safePage} of {totalPages}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </div>
      </main>
    </div>
  );
}
