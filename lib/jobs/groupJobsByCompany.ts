import type { JobListing } from "@/types/jobListing";

export type CompanyJobGroup = {
  key: string;
  company: string;
  jobs: JobListing[];
};

function applyUrlKey(job: JobListing): string {
  return job.applyUrl.trim().toLowerCase();
}

function roleKey(job: JobListing): string {
  return `${job.companySlug}|${job.title.trim().toLowerCase()}|${job.location.trim().toLowerCase()}`;
}

function companyKey(job: JobListing): string {
  return job.companySlug || job.company.trim().toLowerCase();
}

/** Dedupe identical listings, then group remaining jobs by company in first-seen order. */
export function groupJobsByCompany(jobs: JobListing[]): CompanyJobGroup[] {
  const seenUrls = new Set<string>();
  const seenRoles = new Set<string>();
  const unique: JobListing[] = [];

  for (const job of jobs) {
    const url = applyUrlKey(job);
    const role = roleKey(job);
    if (seenUrls.has(url) || seenRoles.has(role)) continue;
    seenUrls.add(url);
    seenRoles.add(role);
    unique.push(job);
  }

  const groups = new Map<string, CompanyJobGroup>();
  const order: string[] = [];

  for (const job of unique) {
    const key = companyKey(job);
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, { key, company: job.company, jobs: [job] });
      order.push(key);
      continue;
    }
    existing.jobs.push(job);
  }

  return order.map((key) => groups.get(key)).filter((group): group is CompanyJobGroup => Boolean(group));
}
