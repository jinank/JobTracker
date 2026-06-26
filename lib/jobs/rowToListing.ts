import { inferRoleCategory, internSalaryRange } from "@/lib/jobs/inferRoleCategory";
import type { JobListing, JobListingRow } from "@/types/jobListing";

type JobSourceSummary = {
  careers_url?: string | null;
};

export function postedDaysAgo(postedAt: string | null): number {
  if (!postedAt) return 30;
  const ms = Date.now() - new Date(postedAt).getTime();
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function websiteUrlFromCareersUrl(careersUrl?: string | null): string | undefined {
  if (!careersUrl) return undefined;
  try {
    const url = new URL(careersUrl);
    return url.origin;
  } catch {
    return undefined;
  }
}

export function rowToJobListing(
  row: JobListingRow,
  source?: JobSourceSummary
): JobListing {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  const companyCareersUrl = source?.careers_url || undefined;
  return {
    id: row.id,
    company: row.company,
    companySlug: row.company_slug,
    title: row.title,
    location: row.location_raw,
    roleCategory: inferRoleCategory(row.title),
    postedDaysAgo: postedDaysAgo(row.posted_at),
    workType: row.work_type,
    applyUrl: row.apply_url,
    companyCareersUrl,
    companyWebsiteUrl: websiteUrlFromCareersUrl(companyCareersUrl),
    description: row.description,
    employmentType: "Internship",
    experienceLevel: "Intern",
    salaryRange: internSalaryRange(),
    tags,
  };
}
