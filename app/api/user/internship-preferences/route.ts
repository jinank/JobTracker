import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAppUser } from "@/lib/requirePaid";
import {
  normalizePreferredRoles,
  normalizeResumeKeywords,
  rowToInternshipPreferences,
} from "@/lib/internshipPreferences";

export async function GET() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select(
      "preferred_internship_roles, resume_filename, resume_keywords, internship_match_enabled, resume_text"
    )
    .eq("id", user.userId)
    .single();

  if (error) {
    const hint = error.message.includes("preferred_internship_roles")
      ? "Run supabase/migration_v11_internship_preferences.sql"
      : undefined;
    return NextResponse.json({ error: error.message, hint }, { status: 500 });
  }

  return NextResponse.json(rowToInternshipPreferences(data ?? {}));
}

export async function PATCH(request: Request) {
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

  const update: Record<string, unknown> = {};

  if ("preferredRoles" in body) {
    update.preferred_internship_roles = normalizePreferredRoles(
      body.preferredRoles
    );
  }
  if ("matchEnabled" in body) {
    update.internship_match_enabled = body.matchEnabled === true;
  }
  if ("resumeKeywords" in body) {
    update.resume_keywords = normalizeResumeKeywords(body.resumeKeywords);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .update(update)
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
