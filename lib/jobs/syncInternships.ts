import { supabase } from "@/lib/supabase";
import { fetchGreenhouseJobs } from "@/lib/jobs/fetchers/greenhouse";
import { fetchLeverPostings } from "@/lib/jobs/fetchers/lever";
import {
  normalizeGreenhouseJob,
  normalizeLeverPosting,
} from "@/lib/jobs/normalizeListing";
import { isUsInternship, isInternshipTitle } from "@/lib/jobs/isUsInternship";
import { resolveGreenhouseLocation } from "@/lib/jobs/resolveGreenhouseLocation";
import type { JobSourceRow } from "@/types/jobListing";

export type SyncInternshipsResult = {
  sourcesProcessed: number;
  fetched: number;
  internshipsKept: number;
  usKept: number;
  upserted: number;
  deactivated: number;
  errors: string[];
};

export async function syncInternships(): Promise<SyncInternshipsResult> {
  const result: SyncInternshipsResult = {
    sourcesProcessed: 0,
    fetched: 0,
    internshipsKept: 0,
    usKept: 0,
    upserted: 0,
    deactivated: 0,
    errors: [],
  };

  const runStarted = new Date().toISOString();
  let runId: string | null = null;

  try {
    const { data: runRow } = await supabase
      .from("job_sync_runs")
      .insert({ started_at: runStarted })
      .select("id")
      .single();
    runId = runRow?.id ?? null;
  } catch {
    /* table may not exist yet */
  }

  let { data: sources, error: srcErr } = await supabase
    .from("job_sources")
    .select("*")
    .eq("enabled", true);

  if (srcErr) {
    result.errors.push(srcErr.message);
    return result;
  }

  if (!sources?.length) {
    await seedJobSources();
    const retry = await supabase
      .from("job_sources")
      .select("*")
      .eq("enabled", true);
    sources = retry.data;
    if (retry.error) {
      result.errors.push(retry.error.message);
      return result;
    }
  }

  const now = new Date().toISOString();

  for (const raw of sources ?? []) {
    const source = raw as JobSourceRow;
    result.sourcesProcessed++;

    try {
      let drafts: ReturnType<typeof normalizeGreenhouseJob>[] = [];
      let fetchedCount = 0;

      if (source.ats === "greenhouse") {
        const jobs = await fetchGreenhouseJobs(source.board_token);
        fetchedCount = jobs.length;
        for (const job of jobs) {
          const title = job.title;
          const loc = resolveGreenhouseLocation(job);
          if (!isInternshipTitle(title, source.force_internship)) {
            continue;
          }
          result.internshipsKept++;
          if (!isUsInternship(title, loc, { forceInternship: source.force_internship })) {
            continue;
          }
          result.usKept++;
          const draft = normalizeGreenhouseJob(source, job);
          if (draft) drafts.push(draft);
        }
      } else {
        const postings = await fetchLeverPostings(source.board_token);
        fetchedCount = postings.length;
        for (const posting of postings) {
          const title = posting.text;
          const loc = posting.categories?.location?.trim() || "";
          if (!isInternshipTitle(title, source.force_internship)) {
            continue;
          }
          result.internshipsKept++;
          if (!isUsInternship(title, loc || "United States", { forceInternship: source.force_internship })) {
            continue;
          }
          result.usKept++;
          const draft = normalizeLeverPosting(source, posting);
          if (draft) drafts.push(draft);
        }
      }

      result.fetched += fetchedCount;
      const seenExternalIds = new Set<string>();

      for (const draft of drafts) {
        if (!draft) continue;
        seenExternalIds.add(draft.external_id);

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
          result.errors.push(`${source.company}: ${upsertErr.message}`);
        } else {
          result.upserted++;
        }
      }

      const { data: existing } = await supabase
        .from("job_listings")
        .select("id, external_id")
        .eq("source_id", source.id)
        .eq("is_active", true);

      for (const row of existing ?? []) {
        if (!seenExternalIds.has(row.external_id)) {
          const { error: deactErr } = await supabase
            .from("job_listings")
            .update({ is_active: false, updated_at: now })
            .eq("id", row.id);
          if (!deactErr) result.deactivated++;
        }
      }

      await supabase
        .from("job_sources")
        .update({ last_synced_at: now })
        .eq("id", source.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      result.errors.push(`${source.company}: ${msg}`);
    }
  }

  if (runId) {
    await supabase
      .from("job_sync_runs")
      .update({
        finished_at: new Date().toISOString(),
        sources_processed: result.sourcesProcessed,
        fetched: result.fetched,
        internships_kept: result.internshipsKept,
        us_kept: result.usKept,
        upserted: result.upserted,
        deactivated: result.deactivated,
        errors: result.errors,
      })
      .eq("id", runId);
  }

  return result;
}

export async function seedJobSources(): Promise<number> {
  const { INTERNSHIP_SOURCE_SEED } = await import("@/lib/jobs/seedSources");
  const activeKeys = new Set(
    INTERNSHIP_SOURCE_SEED.map((r) => `${r.ats}:${r.board_token}`)
  );

  const { data: existing } = await supabase
    .from("job_sources")
    .select("id, ats, board_token");

  for (const row of existing ?? []) {
    const key = `${row.ats}:${row.board_token}`;
    if (!activeKeys.has(key)) {
      await supabase.from("job_sources").update({ enabled: false }).eq("id", row.id);
    }
  }

  let count = 0;
  for (const row of INTERNSHIP_SOURCE_SEED) {
    const { error } = await supabase.from("job_sources").upsert(
      {
        company: row.company,
        company_slug: row.company_slug,
        ats: row.ats,
        board_token: row.board_token,
        careers_url: row.careers_url,
        enabled: true,
      },
      { onConflict: "ats,board_token" }
    );
    if (!error) count++;
  }
  return count;
}
