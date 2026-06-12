import { resolveGreenhouseLocation } from "@/lib/jobs/resolveGreenhouseLocation";
import type { GreenhouseJob } from "@/lib/jobs/fetchers/greenhouse";
import type { LeverPosting } from "@/lib/jobs/fetchers/lever";
import {
  inferRoleCategory,
  inferWorkType,
  internSalaryRange,
} from "@/lib/jobs/inferRoleCategory";
import { isUsInternship, parseUsLocation } from "@/lib/jobs/isUsInternship";
import type { JobSourceRow } from "@/types/jobListing";

export type NormalizedJobDraft = {
  external_id: string;
  company: string;
  company_slug: string;
  title: string;
  location_raw: string;
  city: string | null;
  state: string | null;
  country: string;
  work_type: "Remote" | "Hybrid" | "On-site";
  role_category: string;
  employment_type: "Internship";
  experience_level: "Intern";
  apply_url: string;
  description: string;
  posted_at: string | null;
  tags: string[];
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

export function normalizeGreenhouseJob(
  source: JobSourceRow,
  job: GreenhouseJob
): NormalizedJobDraft | null {
  const locationRaw = resolveGreenhouseLocation(job);
  if (
    !isUsInternship(job.title, locationRaw, {
      forceInternship: source.force_internship,
    })
  ) {
    return null;
  }

  const { city, state, country } = parseUsLocation(locationRaw);
  const workType = inferWorkType(locationRaw);
  const roleCategory = inferRoleCategory(job.title);
  const postedAt = job.first_published || job.updated_at || null;

  return {
    external_id: String(job.id),
    company: source.company,
    company_slug: source.company_slug,
    title: job.title.trim(),
    location_raw: locationRaw,
    city,
    state,
    country: country || "US",
    work_type: workType,
    role_category: roleCategory,
    employment_type: "Internship",
    experience_level: "Intern",
    apply_url: job.absolute_url,
    description:
      stripHtml(job.content || "") ||
      `${source.company} is hiring a ${job.title} in ${locationRaw}. Apply on the company career site.`,
    posted_at: postedAt,
    tags: [roleCategory, workType, "Internship", "Company site"],
  };
}

export function normalizeLeverPosting(
  source: JobSourceRow,
  posting: LeverPosting
): NormalizedJobDraft | null {
  const locationRaw =
    posting.categories?.location?.trim() || "United States";
  if (
    !isUsInternship(posting.text, locationRaw, {
      forceInternship: source.force_internship,
    })
  ) {
    return null;
  }

  const { city, state, country } = parseUsLocation(locationRaw);
  const workType = inferWorkType(locationRaw);
  const roleCategory = inferRoleCategory(posting.text);
  const postedAt = posting.createdAt
    ? new Date(posting.createdAt).toISOString()
    : posting.updatedAt
      ? new Date(posting.updatedAt).toISOString()
      : null;

  const desc =
    posting.descriptionPlain ||
    stripHtml(posting.description || "") ||
    `${source.company} is hiring a ${posting.text} in ${locationRaw}.`;

  return {
    external_id: posting.id,
    company: source.company,
    company_slug: source.company_slug,
    title: posting.text.trim(),
    location_raw: locationRaw,
    city,
    state,
    country: country || "US",
    work_type: workType,
    role_category: roleCategory,
    employment_type: "Internship",
    experience_level: "Intern",
    apply_url: posting.hostedUrl,
    description: desc,
    posted_at: postedAt,
    tags: [roleCategory, workType, "Internship", "Company site"],
  };
}

export { internSalaryRange };
