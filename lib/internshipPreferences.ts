import { ROLE_CATEGORIES } from "@/lib/jobs/constants";
import type { InternshipUserPrefs } from "@/lib/jobs/personalizeInternships";

export type InternshipPreferencesRecord = {
  preferredRoles: string[];
  resumeFilename: string | null;
  resumeKeywords: string[];
  matchEnabled: boolean;
  hasResume: boolean;
};

const VALID_ROLES = new Set(
  ROLE_CATEGORIES.filter((r) => r !== "All roles")
);

export function normalizePreferredRoles(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.map(String))].filter((r) => VALID_ROLES.has(r as never));
}

export function normalizeResumeKeywords(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.map((k) => String(k).trim().toLowerCase()))].filter(
    (k) => k.length >= 2
  );
}

export function rowToInternshipPreferences(row: {
  preferred_internship_roles?: unknown;
  resume_filename?: string | null;
  resume_keywords?: unknown;
  internship_match_enabled?: boolean | null;
  resume_text?: string | null;
}): InternshipPreferencesRecord {
  return {
    preferredRoles: normalizePreferredRoles(row.preferred_internship_roles),
    resumeFilename: row.resume_filename ?? null,
    resumeKeywords: normalizeResumeKeywords(row.resume_keywords),
    matchEnabled: row.internship_match_enabled === true,
    hasResume: Boolean(row.resume_text?.trim()),
  };
}

export function toPersonalizePrefs(
  record: InternshipPreferencesRecord
): InternshipUserPrefs {
  const hasCriteria =
    record.preferredRoles.length > 0 || record.resumeKeywords.length > 0;

  return {
    preferredRoles: record.preferredRoles,
    resumeKeywords: record.resumeKeywords,
    matchEnabled: record.matchEnabled && hasCriteria,
  };
}

export function mergePreferredRoles(
  existing: string[],
  suggested: string[]
): string[] {
  return normalizePreferredRoles([...existing, ...suggested]);
}
