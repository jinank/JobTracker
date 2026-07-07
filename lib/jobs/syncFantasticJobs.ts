import { supabase } from "@/lib/supabase";
import { fetchFantasticAtsAndJobBoardInternships } from "@/lib/jobs/fetchers/fantasticJobs";
import { normalizeFantasticJob } from "@/lib/jobs/normalizeFantasticJob";
import type { JobSourceRow } from "@/types/jobListing";

export type FantasticSyncSlice = {
  fetched: number;
  internshipsKept: number;
  usKept: number;
  upserted: number;
  deactivated: number;
  errors: string[];
};

const FANTASTIC_SOURCE = {
  company: "Fantastic.jobs",
  company_slug: "fantastic-jobs",
  ats: "fantastic" as const,
  board_token: "us-internships",
  careers_url: "https://fantastic.jobs",
};

async function ensureFantasticSource(now: string): Promise<JobSourceRow | null> {
  const { data, error } = await supabase
    .from("job_sources")
    .upsert(
      {
        ...FANTASTIC_SOURCE,
        enabled: true,
        force_internship: false,
        last_synced_at: now,
      },
      { onConflict: "ats,board_token" }
    )
    .select("*")
    .single();

  if (error) {
    return null;
  }
  return data as JobSourceRow;
}

export type FantasticSyncOptions = {
  timeFrame?: "1h" | "24h" | "7d";
  maxPages?: number;
  titleQuery?: string;
};

/**
 * Ingest US internships from Fantastic.jobs ATS + job board feeds.
 * Default uses time_frame=1h (best for polling every 2–3 hours). Upserts only — does not
 * deactivate listings missing from the latest window.
 */
export async function syncFantasticInternships(
  now: string,
  options?: FantasticSyncOptions
): Promise<FantasticSyncSlice> {
  const slice: FantasticSyncSlice = {
    fetched: 0,
    internshipsKept: 0,
    usKept: 0,
    upserted: 0,
    deactivated: 0,
    errors: [],
  };

  if (!process.env.FANTASTIC_JOBS_API_KEY?.trim()) {
    slice.errors.push("FANTASTIC_JOBS_API_KEY not configured; skipped Fantastic.jobs sync");
    return slice;
  }

  try {
    const source = await ensureFantasticSource(now);
    if (!source) {
      slice.errors.push(
        "Could not upsert Fantastic.jobs source row (run migration_v14_fantastic_ats.sql)"
      );
      return slice;
    }

    const { ats, jobBoard } = await fetchFantasticAtsAndJobBoardInternships({
      timeFrame: options?.timeFrame ?? "1h",
      maxPages: options?.maxPages ?? 15,
      titleQuery: options?.titleQuery,
    });

    slice.fetched = ats.length + jobBoard.length;

    const drafts = [
      ...ats.map((job) => normalizeFantasticJob(job, "ats")),
      ...jobBoard.map((job) => normalizeFantasticJob(job, "jb")),
    ].filter(Boolean);

    const seenApplyUrls = new Set<string>();

    for (const draft of drafts) {
      if (!draft) continue;
      slice.internshipsKept++;
      slice.usKept++;

      if (seenApplyUrls.has(draft.apply_url)) continue;
      seenApplyUrls.add(draft.apply_url);

      const { error: upsertErr } = await supabase.from("job_listings").upsert(
        {
          source_id: source.id,
          external_id: draft.external_id,
          company: draft.company,
          company_slug: draft.company_slug,
          title: draft.title,
          location_raw: draft.location_raw,
          city: draft.city,
          state: draft.state,
          country: draft.country,
          work_type: draft.work_type,
          role_category: draft.role_category,
          employment_type: draft.employment_type,
          experience_level: draft.experience_level,
          apply_url: draft.apply_url,
          description: draft.description,
          posted_at: draft.posted_at,
          tags: draft.tags,
          is_active: true,
          updated_at: now,
        },
        { onConflict: "source_id,external_id" }
      );

      if (upsertErr) {
        slice.errors.push(`Fantastic.jobs: ${upsertErr.message}`);
      } else {
        slice.upserted++;
      }
    }

    await supabase
      .from("job_sources")
      .update({ last_synced_at: now })
      .eq("id", source.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    slice.errors.push(`Fantastic.jobs: ${msg}`);
  }

  return slice;
}
