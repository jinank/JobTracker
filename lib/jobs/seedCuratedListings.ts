import { supabase } from "@/lib/supabase";
import {
  CURATED_LISTINGS_2027,
  CURATED_SOURCE,
  type CuratedListingSeed,
} from "@/lib/jobs/curatedListings2027";
import {
  mergeCuratedSeeds,
  PROGRAMS_OPEN_CURATED_SEEDS,
} from "@/lib/jobs/programsOpenCurated";
import { inferRoleCategory } from "@/lib/jobs/inferRoleCategory";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function parsePrimaryLocation(location: string): { city: string | null; state: string | null } {
  const first = location.split(";")[0]?.trim() ?? location;
  const match = first.match(/,\s*([A-Z]{2})\b/);
  if (!match) return { city: first || null, state: null };
  const state = match[1];
  const city = first.replace(/,\s*[A-Z]{2}.*$/, "").trim() || null;
  return { city, state };
}

function buildTags(listing: CuratedListingSeed): string[] {
  const tags: string[] = ["2027-internship"];
  if (listing.season) tags.push(listing.season);
  if (listing.salary) tags.push(`pay:${listing.salary}`);
  if (listing.industries?.length) tags.push(...listing.industries.slice(0, 3));
  return tags;
}

export type SeedCuratedResult = {
  sourceId: string;
  upserted: number;
  errors: string[];
};

export async function seedCuratedListings2027(): Promise<SeedCuratedResult> {
  const result: SeedCuratedResult = { sourceId: "", upserted: 0, errors: [] };
  const now = new Date().toISOString();

  const { data: sourceRow, error: sourceErr } = await supabase
    .from("job_sources")
    .upsert(
      {
        company: CURATED_SOURCE.company,
        company_slug: CURATED_SOURCE.company_slug,
        ats: CURATED_SOURCE.ats,
        board_token: CURATED_SOURCE.board_token,
        careers_url: CURATED_SOURCE.careers_url,
        enabled: false,
        force_internship: true,
      },
      { onConflict: "ats,board_token" }
    )
    .select("id")
    .single();

  if (sourceErr || !sourceRow?.id) {
    result.errors.push(sourceErr?.message ?? "Could not create curated job source.");
    return result;
  }

  result.sourceId = sourceRow.id;

  const listings = mergeCuratedSeeds(
    CURATED_LISTINGS_2027,
    PROGRAMS_OPEN_CURATED_SEEDS
  );

  const seenExternalIds = new Set<string>();

  for (const listing of listings) {
    seenExternalIds.add(listing.externalId);
    const companySlug = slugify(listing.company);
    const { city, state } = parsePrimaryLocation(listing.location);
    const roleCategory = inferRoleCategory(listing.title);

    const { error } = await supabase.from("job_listings").upsert(
      {
        source_id: sourceRow.id,
        external_id: listing.externalId,
        company: listing.company,
        company_slug: companySlug,
        title: listing.title,
        location_raw: listing.location,
        city,
        state,
        country: "US",
        work_type: listing.workType,
        role_category: roleCategory,
        employment_type: "Internship",
        experience_level: "Intern",
        apply_url: listing.applyUrl,
        description: listing.description,
        posted_at: `${listing.postedAt}T12:00:00.000Z`,
        tags: buildTags(listing),
        is_active: true,
        updated_at: now,
      },
      { onConflict: "source_id,external_id" }
    );

    if (error) {
      result.errors.push(`${listing.company} — ${listing.title}: ${error.message}`);
    } else {
      result.upserted++;
    }
  }

  const { data: existing } = await supabase
    .from("job_listings")
    .select("id, external_id")
    .eq("source_id", sourceRow.id)
    .eq("is_active", true);

  for (const row of existing ?? []) {
    if (!seenExternalIds.has(row.external_id)) {
      await supabase
        .from("job_listings")
        .update({ is_active: false, updated_at: now })
        .eq("id", row.id);
    }
  }

  return result;
}
