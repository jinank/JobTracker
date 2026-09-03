import { inferRoleCategory, inferWorkType } from "@/lib/jobs/inferRoleCategory";
import { isUsInternship, parseUsLocation } from "@/lib/jobs/isUsInternship";
import type { FantasticJob, FantasticJobKind } from "@/lib/jobs/fetchers/fantasticJobs";
import type { NormalizedJobDraft } from "@/lib/jobs/normalizeListing";

function slugifyCompany(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "company"
  );
}

function resolveFantasticLocation(job: FantasticJob): string {
  if (job.locations_derived?.length) {
    return job.locations_derived
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object" && "name" in entry) {
          return String((entry as { name?: string }).name ?? "");
        }
        return "";
      })
      .filter(Boolean)
      .join("; ");
  }

  if (job.cities_derived?.length || job.regions_derived?.length) {
    const city = job.cities_derived?.[0] ?? "";
    const region = job.regions_derived?.[0] ?? "";
    const country = job.countries_derived?.[0] ?? "";
    return [city, region, country].filter(Boolean).join(", ");
  }

  if (job.ai_remote_location_derived) return job.ai_remote_location_derived;
  if (job.locations_alt) return job.locations_alt;
  if (job.countries_derived?.includes("United States")) return "United States";
  return "";
}

function mapFantasticWorkType(job: FantasticJob): NormalizedJobDraft["work_type"] {
  switch (job.ai_work_arrangement) {
    case "Remote Solely":
    case "Remote OK":
      return "Remote";
    case "Hybrid":
      return "Hybrid";
    case "On-site":
      return "On-site";
    default:
      break;
  }
  if (job.location_type === "TELECOMMUTE") return "Remote";
  return inferWorkType(resolveFantasticLocation(job));
}

function buildDescription(job: FantasticJob, company: string, location: string): string {
  const parts = [job.ai_core_responsibilities, job.ai_requirements_summary].filter(Boolean);
  if (parts.length) return parts.join(" ").slice(0, 2000);
  return `${company} is hiring a ${job.title}${location ? ` in ${location}` : ""}. Apply on the company career site.`;
}

export function normalizeFantasticJob(
  job: FantasticJob,
  kind: FantasticJobKind
): NormalizedJobDraft | null {
  if (job.org_linkedin_recruitment_agency_derived) return null;
  if (kind === "jb" && job.ats_duplicate) return null;

  const title = job.title?.trim();
  const applyUrl = job.url?.trim();
  if (!title || !applyUrl) return null;

  const company = (job.organization || "Unknown company").trim();
  const locationRaw = resolveFantasticLocation(job);

  if (!isUsInternship(title, locationRaw || "United States", { forceInternship: false })) {
    return null;
  }

  const { city, state, country } = parseUsLocation(locationRaw || "United States");
  const roleCategory = inferRoleCategory(title);
  const workType = mapFantasticWorkType(job);
  const postedAt = job.date_posted || job.date_created || null;
  const sourceLabel = kind === "ats" ? job.source : `${job.source} (board)`;

  return {
    external_id: `${kind}:${job.id}`,
    company,
    company_slug: slugifyCompany(company),
    title,
    location_raw: locationRaw || "United States",
    city,
    state,
    country: country || "US",
    work_type: workType,
    role_category: roleCategory,
    employment_type: "Internship",
    experience_level: "Intern",
    apply_url: applyUrl,
    description: buildDescription(job, company, locationRaw),
    posted_at: postedAt,
    tags: [roleCategory, workType, "Internship", sourceLabel, "Fantastic.jobs", ...( /2027/i.test(title) ? ["2027-internship"] : [])],
  };
}
