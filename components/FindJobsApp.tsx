"use client";

import { useCallback, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { SiteNavApp } from "@/components/SiteNav";
import { FindJobListCard } from "@/components/FindJobListCard";
import { useChains } from "@/hooks/useChains";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  HIDDEN_JOBS_PREVIEW,
  HIDDEN_JOBS_ROLE_COUNTS,
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

const POSTED_PRESETS: { key: PostedPreset; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "30d", label: "Last 30 days" },
];

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
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  const handleSort = useCallback(
    (field: JobSortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir(field === "posted" ? "asc" : "asc");
      }
      setPage(1);
    },
    [sortField]
  );

  const rolePills = useMemo(() => {
    const all = HIDDEN_JOBS_PREVIEW.length;
    return [
      { key: "All roles", label: "All roles", count: all },
      ...HIDDEN_JOBS_ROLE_COUNTS.map(({ role, count }) => ({
        key: role,
        label: role,
        count,
      })),
    ];
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <SiteNavApp activeCount={activeCount}>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          {session?.user?.email && (
            <span className="text-xs text-slate-500 hidden md:inline truncate max-w-[140px]">
              {session.user.email}
            </span>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sign out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Find Jobs</h1>
            <p className="mt-1 text-sm text-slate-500">
              Roles from company career pages. Filter, review details, and apply on the employer site.
            </p>
          </div>

          {/* Posted date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <svg
                className="w-4 h-4 text-slate-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              {POSTED_PRESETS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setPostedPreset(key);
                    resetPage();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    postedPreset === key
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Role category pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {rolePills.map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setRoleCategory(key);
                  resetPage();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  roleCategory === key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Search + work type */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="relative flex-1 w-full">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
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
                placeholder="Search company, role, or location…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Work type:</span>
              {(["all", ...WORK_TYPES] as const).map((wt) => (
                <button
                  key={wt}
                  type="button"
                  onClick={() => {
                    setWorkType(wt);
                    resetPage();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    workType === wt
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {wt === "all" ? "All" : wt}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced filters */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              aria-expanded={showAdvanced}
            >
              <svg
                className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              Advanced filters
            </button>
            {showAdvanced && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-slate-200 bg-white p-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Location contains</span>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      resetPage();
                    }}
                    placeholder="e.g. Remote, San Francisco"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Employment type</span>
                  <select
                    value={employmentType}
                    onChange={(e) => {
                      setEmploymentType(e.target.value);
                      resetPage();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                  >
                    <option value="all">All</option>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Experience level</span>
                  <select
                    value={experienceLevel}
                    onChange={(e) => {
                      setExperienceLevel(e.target.value);
                      resetPage();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                  >
                    <option value="all">All</option>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Role category</span>
                  <select
                    value={roleCategory}
                    onChange={(e) => {
                      setRoleCategory(e.target.value);
                      resetPage();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                  >
                    {ROLE_CATEGORIES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-slate-400">Sort by:</span>
            {(
              [
                { field: "posted" as JobSortField, label: "Date posted" },
                { field: "company" as JobSortField, label: "Company" },
                { field: "role" as JobSortField, label: "Role" },
                { field: "location" as JobSortField, label: "Location" },
              ] as const
            ).map(({ field, label }) => (
              <button
                key={field}
                type="button"
                onClick={() => handleSort(field)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                  sortField === field
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {label}
                {sortField === field && (
                  <span className="text-[10px]">{sortDir === "asc" ? "▲" : "▼"}</span>
                )}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400">
              {filtered.length} job{filtered.length !== 1 ? "s" : ""}
              {search.trim() ? ` for "${search.trim()}"` : ""}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Per page:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {paginated.map((job) => (
              <FindJobListCard key={job.id} job={job} />
            ))}
            {paginated.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-12">
                No jobs match your filters. Try clearing advanced filters or widening the date range.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-200">
              <p className="text-xs text-slate-400">
                Page {safePage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
