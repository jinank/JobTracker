import { inferRoleCategory, internSalaryRange } from "@/lib/jobs/inferRoleCategory";
import type { JobListing, JobListingRow } from "@/types/jobListing";

export function daysAgo(iso: string | null, fallback = 30): number {
  if (!iso) return fallback;
  const ms = Date.now() - new Date(iso).getTime();
  if (ms <= 0) return 0;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export function postedDaysAgo(postedAt: string | null): number {
  return daysAgo(postedAt);
}

export function rowToJobListing(row: JobListingRow): JobListing {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  return {
    id: row.id,
    company: row.company,
    companySlug: row.company_slug,
    title: row.title,
    location: row.location_raw,
    roleCategory: inferRoleCategory(row.title),
    postedDaysAgo: postedDaysAgo(row.posted_at),
    updatedDaysAgo: daysAgo(row.updated_at, postedDaysAgo(row.posted_at)),
    workType: row.work_type,
    applyUrl: row.apply_url,
    description: row.description,
    employmentType: "Internship",
    experienceLevel: "Intern",
    salaryRange: internSalaryRange(),
    tags,
  };
}
