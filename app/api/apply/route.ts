import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";
import {
  isTsentaConfigured,
  TSENTA_DAILY_APPLY_CAP,
  tsentaNotConfiguredMessage,
} from "@/lib/tsenta/config";
import {
  createApplication,
  detectAts,
  isInFlightStatus,
  TsentaApiError,
} from "@/lib/tsenta/client";
import {
  applyRemoteStatus,
  countTodayApplies,
  findApplicationByUrl,
  listUserApplications,
  toPublicApplication,
  upsertApplicationRow,
} from "@/lib/tsenta/applications";
import {
  isApplyProfileComplete,
  parseStoredApplyProfile,
} from "@/lib/tsenta/profile";
import { isClearlyUnsupportedApplyUrl } from "@/lib/tsenta/unsupportedUrl";
import { syncTsentaCandidate } from "@/lib/tsenta/syncCandidate";

export const runtime = "nodejs";

export async function GET() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const rows = await listUserApplications(user.userId);
    return NextResponse.json({
      applications: rows.map(toPublicApplication),
      paid: user.paid,
      configured: isTsentaConfigured(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load applications";
    const hint = message.includes("tsenta_applications")
      ? "Auto-apply is not set up yet."
      : undefined;
    return NextResponse.json({ error: message, hint }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!user.paid) {
    return NextResponse.json(
      { error: "Auto-apply is available on student and paid plans." },
      { status: 403 }
    );
  }
  if (!isTsentaConfigured()) {
    return NextResponse.json(
      { error: tsentaNotConfiguredMessage(), unsupported: false },
      { status: 503 }
    );
  }

  let body: { listingId?: unknown; applyUrl?: unknown };
  try {
    body = (await request.json()) as { listingId?: unknown; applyUrl?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const listingId = typeof body.listingId === "string" ? body.listingId.trim() : "";
  let applyUrl = typeof body.applyUrl === "string" ? body.applyUrl.trim() : "";
  let company = "";
  let roleTitle = "";

  if (listingId) {
    const { data: listing, error } = await supabase
      .from("job_listings")
      .select("id, apply_url, company, title")
      .eq("id", listingId)
      .maybeSingle();
    if (error || !listing) {
      return NextResponse.json({ error: "Internship not found." }, { status: 404 });
    }
    applyUrl = String(listing.apply_url ?? "");
    company = String(listing.company ?? "");
    roleTitle = String(listing.title ?? "");
  }

  if (!applyUrl) {
    return NextResponse.json({ error: "Missing apply URL." }, { status: 400 });
  }

  if (isClearlyUnsupportedApplyUrl(applyUrl)) {
    return NextResponse.json(
      {
        error: "This posting is not on a supported application system.",
        unsupported: true,
        applyUrl,
      },
      { status: 422 }
    );
  }

  const existing = await findApplicationByUrl(user.userId, applyUrl);
  if (existing && (existing.status === "submitted" || isInFlightStatus(existing.status))) {
    return NextResponse.json({
      application: toPublicApplication(existing),
      alreadyApplied: existing.status === "submitted",
    });
  }

  const usedToday = await countTodayApplies(user.userId);
  if (usedToday >= TSENTA_DAILY_APPLY_CAP) {
    return NextResponse.json(
      { error: `Daily auto-apply limit reached (${TSENTA_DAILY_APPLY_CAP}).` },
      { status: 429 }
    );
  }

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select(
      "apply_profile, resume_storage_path, tsenta_candidate_id, tsenta_profile_id"
    )
    .eq("id", user.userId)
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const profile = parseStoredApplyProfile(userRow.apply_profile);
  if (!isApplyProfileComplete(profile, Boolean(userRow.resume_storage_path)) || !profile) {
    return NextResponse.json(
      { error: "Finish your apply profile and upload a PDF resume first.", needsProfile: true },
      { status: 400 }
    );
  }

  let profileId = userRow.tsenta_profile_id as string | null;
  if (!profileId || !userRow.tsenta_candidate_id) {
    const synced = await syncTsentaCandidate({
      userId: user.userId,
      email: user.email,
      profile,
      resumePath: userRow.resume_storage_path,
      existingCandidateId: userRow.tsenta_candidate_id,
    });
    if ("error" in synced) {
      return NextResponse.json({ error: synced.error }, { status: 400 });
    }
    profileId = synced.profileId;
  }

  let ats: string | null = null;
  try {
    const detected = await detectAts(applyUrl);
    ats = detected.ats;
  } catch (err) {
    if (err instanceof TsentaApiError && err.code === "unsupported_site") {
      return NextResponse.json(
        { error: err.message, unsupported: true, applyUrl },
        { status: 422 }
      );
    }
  }

  if (!ats) {
    return NextResponse.json(
      {
        error: "This posting is not on a supported application system.",
        unsupported: true,
        applyUrl,
      },
      { status: 422 }
    );
  }

  if (ats === "workday" && !profile.workdayPassword) {
    return NextResponse.json(
      {
        error: "Add a Workday password in your apply profile for Workday postings.",
        needsProfile: true,
      },
      { status: 400 }
    );
  }

  try {
    const remote = await createApplication(profileId, applyUrl);
    const row = await upsertApplicationRow({
      ...(existing?.id ? { id: existing.id } : {}),
      user_id: user.userId,
      listing_id: listingId || existing?.listing_id || null,
      apply_url: applyUrl,
      company: company || existing?.company || "",
      role_title: roleTitle || existing?.role_title || "",
      tsenta_application_id: remote.id,
      ats: remote.ats ?? ats,
      status: remote.status,
      failure_reason: remote.failure_reason,
      price_usd: remote.price_usd,
    });

    const synced =
      remote.status === "submitted"
        ? await applyRemoteStatus(row, remote)
        : row;

    return NextResponse.json({ application: toPublicApplication(synced) }, { status: 202 });
  } catch (err) {
    if (err instanceof TsentaApiError && err.code === "duplicate_application") {
      const row = await upsertApplicationRow({
        ...(existing?.id ? { id: existing.id } : {}),
        user_id: user.userId,
        listing_id: listingId || existing?.listing_id || null,
        apply_url: applyUrl,
        company: company || existing?.company || "",
        role_title: roleTitle || existing?.role_title || "",
        status: "submitted",
        ats,
      });
      return NextResponse.json({
        application: toPublicApplication(row),
        alreadyApplied: true,
      });
    }
    if (err instanceof TsentaApiError && err.code === "unsupported_site") {
      return NextResponse.json(
        { error: err.message, unsupported: true, applyUrl },
        { status: 422 }
      );
    }
    if (
      err instanceof TsentaApiError &&
      (err.code === "insufficient_credit" || err.status === 402)
    ) {
      return NextResponse.json(
        {
          error:
            "Auto Apply is paused until credit is added. Apply on the company site instead.",
          unsupported: true,
          applyUrl,
        },
        { status: 402 }
      );
    }
    const message = err instanceof Error ? err.message : "Could not start Auto Apply.";
    const status = err instanceof TsentaApiError ? Math.max(400, err.status) : 500;
    return NextResponse.json({ error: message }, { status: status >= 500 ? 502 : status });
  }
}
