import type { JobListing } from "@/types/jobListing";

export type InternshipUserPrefs = {
  preferredRoles: string[];
  resumeKeywords: string[];
  matchEnabled: boolean;
};

export function personalizeInternships(
  jobs: JobListing[],
  prefs: InternshipUserPrefs
): JobListing[] {
  if (!prefs.matchEnabled) return jobs;

  const roles = prefs.preferredRoles.filter(
    (r) => r && r !== "All roles"
  );
  const keywords = prefs.resumeKeywords
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length >= 2);

  if (roles.length === 0 && keywords.length === 0) return jobs;

  return jobs.filter((job) => {
    const roleHit =
      roles.length > 0 && roles.includes(job.roleCategory);
    const blob =
      `${job.title} ${job.description} ${job.roleCategory} ${(job.tags ?? []).join(" ")}`.toLowerCase();
    const keywordHit =
      keywords.length > 0 && keywords.some((k) => blob.includes(k));

    if (roles.length > 0 && keywords.length > 0) {
      return roleHit || keywordHit;
    }
    if (roles.length > 0) return roleHit;
    return keywordHit;
  });
}
