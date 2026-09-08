import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAppUser } from "@/lib/requirePaid";
import { extractResumeText } from "@/lib/resume/extractResumeText";
import { parseResumeForInternships } from "@/lib/openai/parseResumeForInternships";
import {
  mergePreferredRoles,
  rowToInternshipPreferences,
} from "@/lib/internshipPreferences";
import { deleteResumePdf, uploadResumePdf } from "@/lib/tsenta/resumeStorage";
import { parseStoredApplyProfile } from "@/lib/tsenta/profile";
import { syncTsentaCandidate } from "@/lib/tsenta/syncCandidate";
import { isTsentaConfigured } from "@/lib/tsenta/config";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("resume");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Upload a resume file (PDF or TXT)." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Resume must be 2 MB or smaller." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let resumeText: string;
  try {
    resumeText = await extractResumeText(buffer, file.name, file.type);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not read resume file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const analysis = await parseResumeForInternships(resumeText);

  const { data: existing } = await supabase
    .from("users")
    .select(
      "preferred_internship_roles, resume_storage_path, apply_profile, tsenta_candidate_id"
    )
    .eq("id", user.userId)
    .single();

  const preferredRoles = mergePreferredRoles(
    (existing?.preferred_internship_roles as string[] | undefined) ?? [],
    analysis.suggestedRoles
  );

  const isPdf =
    file.type.toLowerCase().includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
  let resumeStoragePath: string | null = null;
  if (isPdf) {
    try {
      resumeStoragePath = await uploadResumePdf(
        user.userId,
        file.name,
        buffer,
        typeof existing?.resume_storage_path === "string"
          ? existing.resume_storage_path
          : null
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not store resume PDF.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } else if (typeof existing?.resume_storage_path === "string") {
    await deleteResumePdf(existing.resume_storage_path);
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      resume_text: resumeText,
      resume_filename: file.name,
      resume_keywords: analysis.keywords,
      preferred_internship_roles: preferredRoles,
      internship_match_enabled: true,
      resume_storage_path: resumeStoragePath,
    })
    .eq("id", user.userId)
    .select(
      "preferred_internship_roles, resume_filename, resume_keywords, internship_match_enabled, resume_text"
    )
    .single();

  if (error) {
    const hint = error.message.includes("resume_text")
      ? "Run supabase/migration_v11_internship_preferences.sql"
      : undefined;
    return NextResponse.json({ error: error.message, hint }, { status: 500 });
  }

  const prefs = rowToInternshipPreferences(data ?? {});

  const applyProfile = parseStoredApplyProfile(existing?.apply_profile);
  if (resumeStoragePath && applyProfile && isTsentaConfigured()) {
    await syncTsentaCandidate({
      userId: user.userId,
      email: user.email,
      profile: applyProfile,
      resumePath: resumeStoragePath,
      existingCandidateId:
        typeof existing?.tsenta_candidate_id === "string"
          ? existing.tsenta_candidate_id
          : null,
    });
  }

  return NextResponse.json({
    ...prefs,
    suggestedRoles: analysis.suggestedRoles,
    keywordsAdded: analysis.keywords,
    hasPdfResume: Boolean(resumeStoragePath),
  });
}

export async function DELETE() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("users")
    .select("resume_storage_path")
    .eq("id", user.userId)
    .single();

  if (typeof existing?.resume_storage_path === "string") {
    await deleteResumePdf(existing.resume_storage_path);
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      resume_text: null,
      resume_filename: null,
      resume_keywords: [],
      resume_storage_path: null,
    })
    .eq("id", user.userId)
    .select(
      "preferred_internship_roles, resume_filename, resume_keywords, internship_match_enabled, resume_text"
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(rowToInternshipPreferences(data ?? {}));
}
