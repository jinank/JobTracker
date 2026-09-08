import { supabase } from "@/lib/supabase";
import {
  rowToInternshipPreferences,
  toPersonalizePrefs,
} from "@/lib/internshipPreferences";
import type { InternshipUserPrefs } from "@/lib/jobs/personalizeInternships";

export async function getInternshipUserPrefs(
  userId: string
): Promise<InternshipUserPrefs | null> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "preferred_internship_roles, resume_keywords, internship_match_enabled"
    )
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return toPersonalizePrefs(rowToInternshipPreferences(data));
}
