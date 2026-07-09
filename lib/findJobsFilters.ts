import type { JobListing } from "@/types/jobListing";
import type { HiddenJob } from "@/lib/hiddenJobsData";

export type PostedPreset = "all" | "today" | "week" | "month" | "30d";
export type WorkTypeFilter = "all" | JobListing["workType"];
export type JobSortField = "posted" | "updated" | "company" | "role" | "location";

const JOB_SORT_FIELDS: JobSortField[] = ["posted", "updated", "company", "role", "location"];
export type SortDir = "asc" | "desc";

export type InternshipQueryParams = {
  search: string;
  roleCategory: string;
  workType: WorkTypeFilter;
  experienceLevel: string;
  postedPreset: PostedPreset;
  locationQuery: string;
  /** When set, listing location must match any matcher (overrides locationQuery). */
  locationMatchers?: string[];
  sortField: JobSortField;
  sortDir: SortDir;
  page?: number;
  pageSize?: number;
  limit?: number;
  forMe?: boolean;
};

export function postedDaysForPreset(preset: PostedPreset): number | null {
  switch (preset) {
    case "today":
      return 1;
    case "week":
      return 7;
    case "month":
      return 30;
    case "30d":
      return 30;
    default:
      return null;
  }
}

export function filterJobListings(
  jobs: JobListing[],
  opts: Pick<
    InternshipQueryParams,
    | "search"
    | "roleCategory"
    | "workType"
    | "experienceLevel"
    | "postedPreset"
    | "locationQuery"
    | "locationMatchers"
  >
): JobListing[] {
  const q = opts.search.trim().toLowerCase();
  const locQ = opts.locationQuery.trim().toLowerCase();
  const maxDays = postedDaysForPreset(opts.postedPreset);

  return jobs.filter((j) => {
    if (opts.roleCategory !== "All roles" && j.roleCategory !== opts.roleCategory) {
      return false;
    }
    if (opts.workType !== "all" && j.workType !== opts.workType) return false;
    if (
      opts.experienceLevel !== "all" &&
      j.experienceLevel !== opts.experienceLevel
    ) {
      return false;
    }
    if (maxDays != null && j.postedDaysAgo > maxDays) return false;
    if (opts.locationMatchers?.length) {
      const loc = j.location.toLowerCase();
      if (
        !opts.locationMatchers.some((matcher) =>
          loc.includes(matcher.toLowerCase())
        )
      ) {
        return false;
      }
    } else if (locQ && !j.location.toLowerCase().includes(locQ)) {
      return false;
    }
    if (!q) return true;
    const blob = `${j.company} ${j.title} ${j.location} ${j.roleCategory} ${j.description} ${(j.tags ?? []).join(" ")}`.toLowerCase();
    return blob.includes(q);
  });
}

export function sortJobListings(
  jobs: JobListing[],
  field: JobSortField,
  dir: SortDir
): JobListing[] {
  const sorted = [...jobs];
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case "posted":
        cmp = a.postedDaysAgo - b.postedDaysAgo;
        break;
      case "updated":
        cmp = a.updatedDaysAgo - b.updatedDaysAgo;
        break;
      case "company":
        cmp = a.company.localeCompare(b.company);
        break;
      case "role":
        cmp = a.title.localeCompare(b.title);
        break;
      case "location":
        cmp = a.location.localeCompare(b.location);
        break;
    }
    if (cmp === 0 && (field === "updated" || field === "posted")) {
      cmp = a.postedDaysAgo - b.postedDaysAgo;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

/** @deprecated Use filterJobListings — static preview only */
export function filterHiddenJobs(
  jobs: HiddenJob[],
  opts: {
    search: string;
    roleCategory: string;
    workType: WorkTypeFilter;
    employmentType: string;
    experienceLevel: string;
    postedPreset: PostedPreset;
    locationQuery: string;
  }
): HiddenJob[] {
  const q = opts.search.trim().toLowerCase();
  const locQ = opts.locationQuery.trim().toLowerCase();
  const maxDays = postedDaysForPreset(opts.postedPreset);

  return jobs.filter((j) => {
    if (opts.roleCategory !== "All roles" && j.roleCategory !== opts.roleCategory) {
      return false;
    }
    if (opts.workType !== "all" && j.workType !== opts.workType) return false;
    if (
      opts.employmentType !== "all" &&
      j.employmentType !== opts.employmentType
    ) {
      return false;
    }
    if (
      opts.experienceLevel !== "all" &&
      j.experienceLevel !== opts.experienceLevel
    ) {
      return false;
    }
    if (maxDays != null && j.postedDaysAgo > maxDays) return false;
    if (locQ && !j.location.toLowerCase().includes(locQ)) return false;
    if (!q) return true;
    const blob = `${j.company} ${j.title} ${j.location} ${j.roleCategory} ${j.description} ${(j.tags ?? []).join(" ")}`.toLowerCase();
    return blob.includes(q);
  });
}

/** @deprecated Use sortJobListings */
export function sortHiddenJobs(
  jobs: HiddenJob[],
  field: JobSortField,
  dir: SortDir
): HiddenJob[] {
  const sorted = [...jobs];
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case "posted":
        cmp = a.postedDaysAgo - b.postedDaysAgo;
        break;
      case "company":
        cmp = a.company.localeCompare(b.company);
        break;
      case "role":
        cmp = a.title.localeCompare(b.title);
        break;
      case "location":
        cmp = a.location.localeCompare(b.location);
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function parseInternshipQueryParams(
  searchParams: URLSearchParams
): InternshipQueryParams {
  const sortRaw = searchParams.get("sort") || "updated-asc";
  const [rawField, sortDir] = sortRaw.split("-") as [JobSortField, SortDir];
  const sortField = JOB_SORT_FIELDS.includes(rawField) ? rawField : "updated";

  return {
    search: searchParams.get("search") || "",
    roleCategory: searchParams.get("role") || "All roles",
    workType: (searchParams.get("workType") || "all") as WorkTypeFilter,
    experienceLevel: searchParams.get("experience") || "all",
    postedPreset: (searchParams.get("posted") || "all") as PostedPreset,
    locationQuery: searchParams.get("location") || "",
    sortField,
    sortDir: sortDir === "desc" ? "desc" : "asc",
    page: Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1),
    pageSize: Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "25", 10) || 25)
    ),
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined,
    forMe: searchParams.get("forMe") === "1",
  };
}
