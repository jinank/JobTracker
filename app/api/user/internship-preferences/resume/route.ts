import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAppUser } from "@/lib/requirePaid";
import { extractResumeText } from "@/lib/resume/extractResumeText";
import { parseResumeForInternships } from "@/lib/openai/parseResumeForInternships";
import {
  mergePreferredRoles,
  rowToInternshipPreferences,
} from "@/lib/internshipPreferences";

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
    .select("preferred_internship_roles")
    .eq("id", user.userId)
    .single();

  const preferredRoles = mergePreferredRoles(
    (existing?.preferred_internship_roles as string[] | undefined) ?? [],
    analysis.suggestedRoles
  );

  const { data, error } = await supabase
    .from("users")
    .update({
      resume_text: resumeText,
      resume_filename: file.name,
      resume_keywords: analysis.keywords,
      preferred_internship_roles: preferredRoles,
      internship_match_enabled: true,
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

  return NextResponse.json({
    ...prefs,
    suggestedRoles: analysis.suggestedRoles,
    keywordsAdded: analysis.keywords,
  });
}

export async function DELETE() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      resume_text: null,
      resume_filename: null,
      resume_keywords: [],
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
