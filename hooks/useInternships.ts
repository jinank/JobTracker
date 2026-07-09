"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { JobListing } from "@/types/jobListing";
import type {
  InternshipQueryParams,
  JobSortField,
  PostedPreset,
  SortDir,
  WorkTypeFilter,
} from "@/lib/findJobsFilters";

export type InternshipStats = {
  totalActive: number;
  companies: number;
  lastSyncedAt: string | null;
};

export type InternshipFilters = {
  search: string;
  roleCategory: string;
  workType: WorkTypeFilter;
  experienceLevel: string;
  postedPreset: PostedPreset;
  locationQuery: string;
  sortField: JobSortField;
  sortDir: SortDir;
  page: number;
  pageSize: number;
  forMe?: boolean;
};

function buildQueryString(filters: InternshipFilters): string {
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.roleCategory !== "All roles") p.set("role", filters.roleCategory);
  if (filters.workType !== "all") p.set("workType", filters.workType);
  if (filters.experienceLevel !== "all") p.set("experience", filters.experienceLevel);
  if (filters.postedPreset !== "all") p.set("posted", filters.postedPreset);
  if (filters.locationQuery) p.set("location", filters.locationQuery);
  p.set("sort", `${filters.sortField}-${filters.sortDir}`);
  p.set("page", String(filters.page));
  p.set("pageSize", String(filters.pageSize));
  if (filters.forMe) p.set("forMe", "1");
  return p.toString();
}

export function useInternships(filters: InternshipFilters) {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<InternshipStats>({
    totalActive: 0,
    companies: 0,
    lastSyncedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);

  const refresh = useCallback(async () => {
    const showBlockingLoader = !hasLoadedOnce.current;
    if (showBlockingLoader) setLoading(true);
    setError(null);

    try {
      const qs = buildQueryString(filters);
      const res = await fetch(`/api/internships?${qs}`);
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.hint
              ? `${data.error} ${data.hint}`
              : data.error
            : "Failed to load internships"
        );
        return;
      }
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? { totalActive: 0, companies: 0, lastSyncedAt: null });
      hasLoadedOnce.current = true;
    } catch {
      setError("Failed to load internships");
    } finally {
      if (showBlockingLoader) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { jobs, total, stats, loading, error, refresh };
}

export function useInternshipPreview(
  limit = 8,
  sort: "posted-asc" | "posted-desc" | "updated-asc" | "updated-desc" = "updated-asc"
) {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [stats, setStats] = useState<InternshipStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/internships?limit=${limit}&sort=${sort}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) {
          setJobs(data.jobs ?? []);
          setStats(data.stats ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit, sort]);

  return { jobs, stats, loading };
}
