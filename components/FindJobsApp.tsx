"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { SiteNavApp } from "@/components/SiteNav";
import { AppHeaderActions } from "@/components/AppHeaderActions";
import { InternshipTable } from "@/components/InternshipTable";
import { useChains } from "@/hooks/useChains";
import { useInternships } from "@/hooks/useInternships";
import { useInternshipPreferences } from "@/hooks/useInternshipPreferences";
import { InternshipMatchPanel } from "@/components/InternshipMatchPanel";
import { countUniqueApplications } from "@/lib/uniqueApplications";
import { ROLE_CATEGORIES, WORK_TYPES } from "@/lib/jobs/constants";
import type {
  JobSortField,
  PostedPreset,
  SortDir,
  WorkTypeFilter,
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
  { value: "updated", label: "Recently added" },
  { value: "posted", label: "Date posted" },
  { value: "company", label: "Company" },
  { value: "role", label: "Role" },
  { value: "location", label: "Location" },
];

function sortOptionLabel(field: JobSortField, dir: SortDir): string {
  switch (field) {
    case "updated":
      return dir === "asc" ? "Recently added (newest first)" : "Recently added (oldest first)";
    case "posted":
      return dir === "asc" ? "Date posted (newest first)" : "Date posted (oldest first)";
    case "company":
      return dir === "asc" ? "Company (A→Z)" : "Company (Z→A)";
    case "role":
      return dir === "asc" ? "Role (A→Z)" : "Role (Z→A)";
    case "location":
      return dir === "asc" ? "Location (A→Z)" : "Location (Z→A)";
  }
}

function FilterField({
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
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-scale-purple focus:outline-none focus:ring-2 focus:ring-scale-purple/20"
      >
        {children}
      </select>
    </label>
  );
}

export function FindJobsApp() {
  const { data: session } = useSession();
  const { chains } = useChains();
  const activeCount = countUniqueApplications(
    chains.filter(
      (c) => !["REJECTED", "GHOSTED", "WITHDRAWN"].includes(c.status)
    )
  );

  const [search, setSearch] = useState("");
  const [roleCategory, setRoleCategory] = useState("All roles");
  const [workType, setWorkType] = useState<WorkTypeFilter>("all");
  const [postedPreset, setPostedPreset] = useState<PostedPreset>("all");
  const [locationQuery, setLocationQuery] = useState("");
  const [sortField, setSortField] = useState<JobSortField>("updated");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    prefs: matchPrefs,
    loading: matchLoading,
    saving: matchSaving,
    uploading: matchUploading,
    error: matchError,
    refresh: refreshMatchPrefs,
    savePrefs,
    uploadResume,
    removeResume,
  } = useInternshipPreferences();

  const filters = useMemo(
    () => ({
      search,
      roleCategory,
      workType,
      experienceLevel: "all",
      postedPreset,
      locationQuery,
      sortField,
      sortDir,
      page,
      pageSize,
      forMe: matchPrefs.matchEnabled,
    }),
    [
      search,
      roleCategory,
      workType,
      postedPreset,
      locationQuery,
      sortField,
      sortDir,
      page,
      pageSize,
      matchPrefs.matchEnabled,
    ]
  );

  const { jobs, total, stats, loading, error, refresh } = useInternships(filters);

  const handleMatchChange = useCallback(() => {
    refreshMatchPrefs();
    refresh();
  }, [refreshMatchPrefs, refresh]);

  const matchPanel = (
    <InternshipMatchPanel
      prefs={matchPrefs}
      loading={matchLoading}
      saving={matchSaving}
      uploading={matchUploading}
      error={matchError}
      onSavePrefs={savePrefs}
      onUploadResume={uploadResume}
      onRemoveResume={removeResume}
      onPreferencesChange={handleMatchChange}
    />
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const resetPage = useCallback(() => setPage(1), []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (matchPrefs.matchEnabled) n++;
    if (search.trim()) n++;
    if (roleCategory !== "All roles") n++;
    if (workType !== "all") n++;
    if (postedPreset !== "all") n++;
    if (locationQuery.trim()) n++;
    return n;
  }, [matchPrefs.matchEnabled, search, roleCategory, workType, postedPreset, locationQuery]);

  async function clearFilters() {
    setRoleCategory("All roles");
    setWorkType("all");
    setPostedPreset("all");
    setLocationQuery("");
    setSearch("");
    setPage(1);
    if (matchPrefs.matchEnabled) {
      await savePrefs({ matchEnabled: false });
      handleMatchChange();
    }
  }

  const filtersPanel = (
    <div className="space-y-4">
      <p className="rounded-lg border border-violet-100 bg-violet-50/80 px-3 py-2 text-xs text-violet-900">
        USA internships only, sourced from company career pages.
      </p>

      <div className="relative">
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
          placeholder="Search company, role, city"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-scale-purple focus:outline-none focus:ring-2 focus:ring-scale-purple/20"
        />
      </div>

      <FilterField
        label="Date posted"
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
      </FilterField>

      <FilterField
        label="Role category"
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
      </FilterField>

      <FilterField
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
      </FilterField>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-slate-600">
          US location
        </span>
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => {
            setLocationQuery(e.target.value);
            resetPage();
          }}
          placeholder="e.g. San Francisco, CA, Remote"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-scale-purple focus:outline-none focus:ring-2 focus:ring-scale-purple/20"
        />
      </label>

      <div className="border-t border-slate-200 pt-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">List</p>
        <FilterField
          label="Sort by"
          value={`${sortField}-${sortDir}`}
          onChange={(v) => {
            const [field, dir] = v.split("-") as [JobSortField, SortDir];
            setSortField(field);
            setSortDir(dir);
            setPage(1);
          }}
        >
          {SORT_OPTIONS.flatMap((o) => [
            <option key={`${o.value}-asc`} value={`${o.value}-asc`}>
              {sortOptionLabel(o.value, "asc")}
            </option>,
            <option key={`${o.value}-desc`} value={`${o.value}-desc`}>
              {sortOptionLabel(o.value, "desc")}
            </option>,
          ])}
        </FilterField>

        <FilterField
          label="Jobs per page"
          value={String(pageSize)}
          onChange={(v) => {
            setPageSize(Number(v));
            setPage(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </FilterField>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteNavApp activeCount={activeCount}>
        <AppHeaderActions email={session?.user?.email} />
      </SiteNavApp>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-6">
            <p className="text-sm font-semibold text-emerald-600">Find Internships</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Fresh US internships, straight from the source
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Synced daily from company career pages, apply early, before the crowd finds them.
            </p>
          </div>
          <div className="flex flex-col items-start gap-8 xl:flex-row">
            <div className="min-w-0 w-full max-w-4xl flex-1">
              <div className="mb-4 xl:hidden">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
                  aria-expanded={mobileFiltersOpen}
                >
                  <span>
                    Filters
                    {activeFilterCount > 0 ? (
                      <span className="ml-2 rounded-full bg-scale-purple px-2 py-0.5 text-[10px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    ) : null}
                  </span>
                  <svg
                    className={`h-4 w-4 text-slate-500 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {mobileFiltersOpen && (
                  <div className="mt-3 space-y-3">
                    {matchPanel}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      {filtersPanel}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {error}
                  <button
                    type="button"
                    onClick={() => refresh()}
                    className="ml-2 font-semibold text-amber-950 underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              <p className="mb-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{total}</span>
                {total === 1 ? " internship" : " internships"}
                {matchPrefs.matchEnabled ? (
                  <span className="text-violet-700"> matched for you</span>
                ) : null}
                {stats.companies > 0 ? (
                  <span className="text-slate-500">
                    {" "}
                    · {stats.companies} companies
                  </span>
                ) : null}
                {search.trim() ? (
                  <span className="text-slate-500"> matching &ldquo;{search.trim()}&rdquo;</span>
                ) : null}
              </p>

              {loading && jobs.length === 0 ? (
                <div className="flex justify-center py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
                </div>
              ) : (
                <>
                  <InternshipTable
                    jobs={jobs}
                    loading={loading}
                    showWorkType={false}
                    emptyMessage={
                      matchPrefs.matchEnabled
                        ? "No internships match these filters. Try turning off “Show only relevant internships” or broaden your role picks."
                        : "No internships match these filters. Listings sync every few hours from company career pages."
                    }
                  />
                  {jobs.length === 0 && !loading && (
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-semibold text-scale-purple hover:text-scale-purple-dark"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </>
              )}

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

            <aside
              className="hidden w-72 shrink-0 self-start space-y-4 xl:sticky xl:top-28 xl:block"
              aria-label="Internship filters"
            >
              {matchPanel}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>
                {filtersPanel}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
