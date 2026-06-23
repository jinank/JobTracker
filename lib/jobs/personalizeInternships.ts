import type { JobListing } from "@/types/jobListing";

export type InternshipUserPrefs = {
  preferredRoles: string[];
  resumeKeywords: string[];
  matchEnabled: boolean;
};

const KEYWORD_STOPWORDS = new Set([
  "intern",
  "internship",
  "internships",
  "student",
  "students",
  "university",
  "college",
  "summer",
  "fall",
  "spring",
  "winter",
  "program",
  "programs",
  "role",
  "position",
  "team",
  "work",
  "year",
  "usa",
  "the",
  "and",
  "for",
  "with",
]);

function meaningfulKeywords(raw: string[]): string[] {
  return raw
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length >= 3 && !KEYWORD_STOPWORDS.has(k));
}

export function personalizeInternships(
  jobs: JobListing[],
  prefs: InternshipUserPrefs
): JobListing[] {
  if (!prefs.matchEnabled) return jobs;

  const roles = prefs.preferredRoles.filter((r) => r && r !== "All roles");
  const keywords = meaningfulKeywords(prefs.resumeKeywords);

  if (roles.length === 0 && keywords.length === 0) return [];

  return jobs.filter((job) => {
    const roleHit =
      roles.length > 0 && roles.includes(job.roleCategory);
    const blob =
      `${job.title} ${job.description} ${job.roleCategory} ${(job.tags ?? []).join(" ")}`.toLowerCase();
    const keywordHit =
      keywords.length > 0 && keywords.some((k) => blob.includes(k));

    if (roles.length > 0 && keywords.length > 0) {
      return roleHit && keywordHit;
    }
    if (roles.length > 0) return roleHit;
    return keywordHit;
  });
}
