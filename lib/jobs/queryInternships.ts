import { supabase } from "@/lib/supabase";
import { rowToJobListing } from "@/lib/jobs/rowToListing";
import {
  filterJobListings,
  sortJobListings,
  type InternshipQueryParams,
} from "@/lib/findJobsFilters";
import { personalizeInternships } from "@/lib/jobs/personalizeInternships";
import type { InternshipUserPrefs } from "@/lib/jobs/personalizeInternships";
import { shouldExcludeInternshipTitle } from "@/lib/jobs/internshipTitleQuality";
import type { JobListing, JobListingRow } from "@/types/jobListing";

type JobSourceSummary = {
  id: string;
  careers_url: string | null;
};

export type InternshipsQueryResult = {
  jobs: JobListing[];
  total: number;
  stats: {
    totalActive: number;
    companies: number;
    lastSyncedAt: string | null;
  };
};

export async function queryInternships(
  params: InternshipQueryParams,
  userPrefs?: InternshipUserPrefs | null
): Promise<InternshipsQueryResult> {
  const { data, error } = await supabase
    .from("job_listings")
    .select("*")
    .eq("country", "US")
    .eq("employment_type", "Internship")
    .eq("is_active", true)
    .order("posted_at", { ascending: false, nullsFirst: false })
    .range(0, 4999);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as JobListingRow[];
  const sourceIds = Array.from(new Set(rows.map((row) => row.source_id)));
  const sourceById = new Map<string, JobSourceSummary>();

  if (sourceIds.length > 0) {
    const { data: sources } = await supabase
      .from("job_sources")
      .select("id, careers_url")
      .in("id", sourceIds);

    for (const source of (sources ?? []) as JobSourceSummary[]) {
      sourceById.set(source.id, source);
    }
  }

  const listings = rows
    .map((row) => rowToJobListing(row, sourceById.get(row.source_id)))
    .filter((job) => !shouldExcludeInternshipTitle(job.title));

  let filtered = filterJobListings(listings, params);
  if (params.forMe && userPrefs?.matchEnabled) {
    filtered = personalizeInternships(filtered, userPrefs);
  }
  const sorted = sortJobListings(filtered, params.sortField, params.sortDir);

  const total = sorted.length;
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 25));
  const offset = (page - 1) * pageSize;
  const jobs = params.limit
    ? sorted.slice(0, params.limit)
    : sorted.slice(offset, offset + pageSize);

  const companies = new Set(listings.map((j) => j.company)).size;

  const { data: syncRow } = await supabase
    .from("job_sources")
    .select("last_synced_at")
    .order("last_synced_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    jobs,
    total,
    stats: {
      totalActive: listings.length,
      companies,
      lastSyncedAt: syncRow?.last_synced_at ?? null,
    },
  };
}
