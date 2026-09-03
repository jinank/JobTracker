import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";
import { isTsentaConfigured, tsentaNotConfiguredMessage } from "@/lib/tsenta/config";
import {
  applyProfileMissingFields,
  isApplyProfileComplete,
  mergeApplyProfile,
  parseStoredApplyProfile,
  splitDisplayName,
  toPublicApplyProfile,
} from "@/lib/tsenta/profile";
import { syncTsentaCandidate } from "@/lib/tsenta/syncCandidate";

export const runtime = "nodejs";

type UserApplyRow = {
  name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  apply_profile: unknown;
  resume_storage_path: string | null;
  resume_filename: string | null;
  tsenta_candidate_id: string | null;
  tsenta_profile_id: string | null;
};

function profilePayload(
  user: { paid: boolean; hasProSubscription: boolean; email: string },
  row: UserApplyRow
) {
  const stored = parseStoredApplyProfile(row.apply_profile);
  const names = splitDisplayName(row.name);
  const profile = stored ?? {
    ...mergeApplyProfile(null, {
      firstName: names.firstName,
      lastName: names.lastName,
      city: row.city ?? "",
      state: row.state ?? "",
      country: row.country ?? "United States",
    }),
  };
  const hasPdf = Boolean(row.resume_storage_path);
  const ready =
    isApplyProfileComplete(profile, hasPdf) &&
    Boolean(row.tsenta_candidate_id && row.tsenta_profile_id) &&
    isTsentaConfigured();

  return {
    profile: toPublicApplyProfile(profile),
    hasPdfResume: hasPdf,
    resumeFilename: row.resume_filename,
    ready,
    paid: user.paid,
    hasProSubscription: user.hasProSubscription,
    configured: isTsentaConfigured(),
    missingFields: applyProfileMissingFields(profile),
    configuredMessage: isTsentaConfigured() ? null : tsentaNotConfiguredMessage(),
  };
}

export async function GET() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select(
      "name, city, state, country, apply_profile, resume_storage_path, resume_filename, tsenta_candidate_id, tsenta_profile_id"
    )
    .eq("id", user.userId)
    .single();

  if (error) {
    const hint = error.message.includes("apply_profile")
      ? "Auto-apply is not set up yet."
      : undefined;
    return NextResponse.json({ error: error.message, hint }, { status: 500 });
  }

  return NextResponse.json(profilePayload(user, data as UserApplyRow));
}

export async function POST(request: Request) {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data: existing, error: loadError } = await supabase
    .from("users")
    .select(
      "name, city, state, country, apply_profile, resume_storage_path, resume_filename, tsenta_candidate_id, tsenta_profile_id"
    )
    .eq("id", user.userId)
    .single();

  if (loadError) {
    const hint = loadError.message.includes("apply_profile")
      ? "Auto-apply is not set up yet."
      : undefined;
    return NextResponse.json({ error: loadError.message, hint }, { status: 500 });
  }

  const row = existing as UserApplyRow;
  const merged = mergeApplyProfile(parseStoredApplyProfile(row.apply_profile), body);
  const missing = applyProfileMissingFields(merged);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Add your ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  const { error: saveError } = await supabase
    .from("users")
    .update({ apply_profile: merged })
    .eq("id", user.userId);

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  let syncError: string | null = null;
  if (row.resume_storage_path && isTsentaConfigured()) {
    const synced = await syncTsentaCandidate({
      userId: user.userId,
      email: user.email,
      profile: merged,
      resumePath: row.resume_storage_path,
      existingCandidateId: row.tsenta_candidate_id,
    });
    if ("error" in synced && synced.error !== "not_configured") {
      syncError = synced.error;
    }
  }

  const { data: refreshed } = await supabase
    .from("users")
    .select(
      "name, city, state, country, apply_profile, resume_storage_path, resume_filename, tsenta_candidate_id, tsenta_profile_id"
    )
    .eq("id", user.userId)
    .single();

  return NextResponse.json({
    ...profilePayload(user, (refreshed as UserApplyRow) ?? { ...row, apply_profile: merged }),
    syncError,
  });
}
