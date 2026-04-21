"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useChains } from "@/hooks/useChains";
import { useSync } from "@/hooks/useSync";
import { useNotifications } from "@/hooks/useNotifications";
import { Header } from "./Header";
import { PipelineBar } from "./PipelineBar";
import { ChainCard } from "./ChainCard";
import { ChainView } from "./ChainView";
import { CompanyGroupCard, buildCompanyGroups } from "./CompanyGroupCard";
import { EmptyState } from "./EmptyState";
import { LeaderboardSidebar } from "./LeaderboardSidebar";
import { InviteResponseBanner } from "./InviteResponseBanner";
import type { Chain, ChainStatus } from "@/types/chain";
import { STATUS_ORDER } from "@/types/chain";
import { startOfCalendarWeekMs } from "@/lib/utils";

const TERMINAL_STATUSES: ChainStatus[] = ["REJECTED", "GHOSTED", "WITHDRAWN"];
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

type SortField = "date" | "company" | "role" | "status";
type SortDir = "asc" | "desc";

function sortChains(
  chains: Chain[],
  field: SortField,
  dir: SortDir
): Chain[] {
  const sorted = [...chains];
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case "date":
        cmp = a.last_event_at - b.last_event_at;
        break;
      case "company":
        cmp = a.canonical_company.localeCompare(b.canonical_company);
        break;
      case "role":
        cmp = (a.role_title || "").localeCompare(b.role_title || "");
        break;
      case "status":
        cmp = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function Dashboard() {
  const { data: session } = useSession();
  const {
    chains,
    paid,
    studentVerified,
    chainCount,
    limit,
    loading,
    refresh,
  } = useChains();
  const { syncing, progress, error, newCount, syncHasMore, lastSyncAt, sync } =
    useSync(
    refresh,
    session?.user?.email
  );
  const { notifications, unreadCount, markAllRead, clearAll } =
    useNotifications(chains);

  const freeLimit = limit ?? 50;
  const atLimit = !paid && chainCount >= freeLimit;

  const [showStudentApprovedNotif, setShowStudentApprovedNotif] =
    useState(false);
  useEffect(() => {
    if (!studentVerified) {
      setShowStudentApprovedNotif(false);
      return;
    }
    const email = session?.user?.email;
    if (!email) return;

    const key = `rethinkjobs_student_verified_approved_notif_${email.toLowerCase()}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      // If localStorage is blocked, still show the banner once per page load.
    }
    setShowStudentApprovedNotif(true);
  }, [studentVerified, session?.user?.email]);

  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [datePreset, setDatePreset] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [groupByCompany, setGroupByCompany] = useState(true);

  useEffect(() => {
    setSelectedChain((prev) => {
      if (!prev) return prev;
      const next = chains.find((c) => c.chain_id === prev.chain_id);
      return next ?? prev;
    });
  }, [chains]);

  const dateRange = useMemo(() => {
    if (datePreset === "all") return { from: 0, to: Infinity };
    const now = new Date();
    const startOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const endOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

    switch (datePreset) {
      case "today":
        return { from: startOfDay(now), to: endOfDay(now) };
      case "week": {
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - diff);
        return { from: startOfDay(monday), to: endOfDay(now) };
      }
      case "month":
        return {
          from: new Date(now.getFullYear(), now.getMonth(), 1).getTime(),
          to: endOfDay(now),
        };
      case "30d":
        return {
          from: now.getTime() - 30 * 24 * 60 * 60 * 1000,
          to: endOfDay(now),
        };
      case "90d":
        return {
          from: now.getTime() - 90 * 24 * 60 * 60 * 1000,
          to: endOfDay(now),
        };
      case "custom": {
        const from = dateFrom ? new Date(dateFrom).getTime() : 0;
        const to = dateTo ? endOfDay(new Date(dateTo)) : Infinity;
        return { from, to };
      }
      default:
        return { from: 0, to: Infinity };
    }
  }, [datePreset, dateFrom, dateTo]);

  /** Pipeline “+N …” badge window + label — matches selected date preset. */
  const pipelineGrowth = useMemo(() => {
    const now = new Date();
    const endOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

    if (datePreset === "all") {
      return {
        from: startOfCalendarWeekMs(now),
        to: endOfDay(now),
        label: "this week",
      };
    }

    const label =
      datePreset === "today"
        ? "today"
        : datePreset === "week"
          ? "this week"
          : datePreset === "month"
            ? "this month"
            : datePreset === "30d"
              ? "last 30 days"
              : datePreset === "90d"
                ? "last 90 days"
                : datePreset === "custom"
                  ? dateFrom && dateTo
                    ? `${dateFrom} – ${dateTo}`
                    : "in this range"
                  : "this week";

    return {
      from: dateRange.from,
      to: dateRange.to,
      label,
    };
  }, [datePreset, dateFrom, dateTo, dateRange]);

  const dateFilteredChains = useMemo(() => {
    if (dateRange.from === 0 && dateRange.to === Infinity) return chains;
    return chains.filter(
      (c) => c.last_event_at >= dateRange.from && c.last_event_at <= dateRange.to
    );
  }, [chains, dateRange]);

  const activeChains = dateFilteredChains.filter(
    (c) => !TERMINAL_STATUSES.includes(c.status)
  );
  const closedChains = dateFilteredChains.filter((c) =>
    TERMINAL_STATUSES.includes(c.status)
  );

  const displayChains = useMemo(() => {
    let result: Chain[];
    if (filter === "all") {
      result = dateFilteredChains;
    } else if (filter === "active") {
      result = activeChains;
    } else if (filter === "closed") {
      result = closedChains;
    } else {
      result = dateFilteredChains.filter((c) => c.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.canonical_company.toLowerCase().includes(q) ||
          c.role_title.toLowerCase().includes(q)
      );
    }

    return sortChains(result, sortField, sortDir);
  }, [dateFilteredChains, activeChains, closedChains, filter, search, sortField, sortDir]);

  const groupedChains = useMemo(
    () => (groupByCompany ? buildCompanyGroups(displayChains) : null),
    [groupByCompany, displayChains]
  );

  const totalItems = groupedChains
    ? groupedChains.length
    : displayChains.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedChains = displayChains.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const paginatedGroups = groupedChains
    ? groupedChains.slice((safePage - 1) * pageSize, safePage * pageSize)
    : null;

  const handleFilterChange = useCallback((f: string) => {
    setFilter(f);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    []
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir(field === "company" || field === "role" ? "asc" : "desc");
      }
      setPage(1);
    },
    [sortField]
  );

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const handleBack = useCallback(() => setSelectedChain(null), []);

  const handleChainUpdated = useCallback(() => {
    refresh();
    setSelectedChain(null);
  }, [refresh]);

  if (selectedChain) {
    return (
      <div>
        <Header
          email={session?.user?.email}
          activeCount={activeChains.length}
          syncing={syncing}
          progress={progress}
          paid={paid}
          onSync={sync}
          lastSyncAt={lastSyncAt}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onClearNotifications={clearAll}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <InviteResponseBanner
            chainsLoading={loading}
            onChainsRefresh={refresh}
          />
          <div className="flex flex-col xl:flex-row gap-8 items-start">
          <main className="flex-1 min-w-0 w-full max-w-4xl">
            <ChainView
              chain={selectedChain}
              onBack={handleBack}
              onUpdated={handleChainUpdated}
            />
          </main>
          <LeaderboardSidebar chains={chains} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        email={session?.user?.email}
        activeCount={activeChains.length}
        syncing={syncing}
        progress={progress}
        paid={paid}
        onSync={sync}
        lastSyncAt={lastSyncAt}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
        onClearNotifications={clearAll}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <InviteResponseBanner
          chainsLoading={loading}
          onChainsRefresh={refresh}
        />
        <div className="flex flex-col xl:flex-row gap-8 items-start">
        <main className="flex-1 min-w-0 w-full max-w-4xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {showStudentApprovedNotif && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl px-4 py-3 mb-5 animate-fade-in">
            <div className="font-semibold">Student verification approved</div>
            <div className="text-xs text-emerald-700/90 mt-1">
              You now have free student access. Reach out and manage your
              applications in the dashboard.
            </div>
            <div className="mt-3">
              <button
                onClick={() => setShowStudentApprovedNotif(false)}
                className="text-xs font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!paid && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-card p-4 mb-5 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">
                Free plan: {chainCount}/{freeLimit} applications
              </span>
              {!atLimit ? (
                <span className="text-xs text-slate-400">
                  {freeLimit - chainCount} remaining
                </span>
              ) : (
                <a
                  href="/pricing"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Upgrade to Pro →
                </a>
              )}
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  atLimit ? "bg-red-500" : chainCount > freeLimit * 0.8 ? "bg-amber-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (chainCount / freeLimit) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {(newCount > 0 || syncHasMore) && !syncing && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-5">
            {newCount > 0 ? (
              <>
                Found {newCount} new job-related email{newCount !== 1 ? "s" : ""}!
              </>
            ) : (
              <span className="font-medium">Sync batch finished.</span>
            )}
            {syncHasMore && (
              <span className="block mt-2 text-xs text-emerald-800/90 font-medium">
                More messages are queued — press Sync again to continue importing.
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chains.length === 0 ? (
          <EmptyState onSync={sync} />
        ) : (
          <>
            {/* Date Filter - above pipeline so it filters the stats */}
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
                {([
                  { key: "all", label: "All Time" },
                  { key: "today", label: "Today" },
                  { key: "week", label: "This Week" },
                  { key: "month", label: "This Month" },
                  { key: "30d", label: "Last 30 Days" },
                  { key: "90d", label: "Last 90 Days" },
                  { key: "custom", label: "Custom" },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setDatePreset(key); setPage(1); }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      datePreset === key
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {datePreset === "custom" && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                    className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                    className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
              )}
            </div>

            {/* Pipeline stat boxes - filtered by date above */}
            <PipelineBar
              chains={dateFilteredChains}
              selectedFilter={filter}
              onFilterClick={handleFilterChange}
              growthFromMs={pipelineGrowth.from}
              growthToMs={pipelineGrowth.to}
              growthLabel={pipelineGrowth.label}
            />

            {/* Search + Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5 mt-6">
              <div className="relative flex-1 w-full sm:w-auto">
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
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search company or role..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {([
                  { key: "all", label: "All", count: dateFilteredChains.length },
                  { key: "active", label: "Active", count: activeChains.length },
                  { key: "closed", label: "Closed", count: closedChains.length },
                ] as const).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => handleFilterChange(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      filter === key
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Sort by:</span>
              {(
                [
                  { field: "date" as SortField, label: "Date" },
                  { field: "company" as SortField, label: "Company" },
                  { field: "role" as SortField, label: "Role" },
                  { field: "status" as SortField, label: "Status" },
                ] as const
              ).map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                    sortField === field
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {label}
                  {sortField === field && (
                    <span className="text-[10px]">
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setGroupByCompany((v) => !v);
                  setPage(1);
                }}
                aria-pressed={groupByCompany}
                title="Merge threads from the same company into one row"
                className={`ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  groupByCompany
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
                Group by company
              </button>
            </div>

            {/* Results info */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400">
                {groupedChains
                  ? `${groupedChains.length} compan${groupedChains.length !== 1 ? "ies" : "y"} · ${displayChains.length} application${displayChains.length !== 1 ? "s" : ""}`
                  : `${displayChains.length} application${displayChains.length !== 1 ? "s" : ""}`}
                {search.trim() ? ` for "${search.trim()}"` : ""}
                {datePreset !== "all" && (
                  <span className="ml-1 text-blue-500 font-medium">
                    ({datePreset === "custom"
                      ? `${dateFrom || "..."} – ${dateTo || "..."}`
                      : datePreset === "today" ? "today"
                      : datePreset === "week" ? "this week"
                      : datePreset === "month" ? "this month"
                      : datePreset === "30d" ? "last 30 days"
                      : "last 90 days"})
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Per page:</label>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
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

            {/* Chain List */}
            <div className="space-y-3">
              {paginatedGroups
                ? paginatedGroups.map((group) => (
                    <CompanyGroupCard
                      key={group.key}
                      group={group}
                      onChainClick={(chain) => setSelectedChain(chain)}
                    />
                  ))
                : paginatedChains.map((chain) => (
                    <ChainCard
                      key={chain.chain_id}
                      chain={chain}
                      onClick={() => setSelectedChain(chain)}
                    />
                  ))}
              {(paginatedGroups ? paginatedGroups.length : paginatedChains.length) === 0 && (
                <p className="text-sm text-slate-500 text-center py-12">
                  No applications match your search.
                </p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-200">
                <p className="text-xs text-slate-400">
                  Page {safePage} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={safePage <= 1}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - safePage) <= 1
                    )
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1)
                        acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === "..." ? (
                        <span
                          key={`dots-${i}`}
                          className="px-1 text-xs text-slate-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                            safePage === item
                              ? "bg-blue-600 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safePage >= totalPages}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={safePage >= totalPages}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        </main>
        <LeaderboardSidebar chains={chains} />
        </div>
      </div>
    </div>
  );
}
