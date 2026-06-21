export type AshbyJob = {
  id: string;
  title: string;
  department?: string;
  team?: string;
  employmentType?: string;
  location: string;
  secondaryLocations?: Array<{ location?: string }>;
  publishedAt?: string;
  isListed?: boolean;
  isRemote?: boolean;
  workplaceType?: string;
  jobUrl: string;
  descriptionHtml?: string;
};

export type AshbyBoardResponse = {
  jobs?: AshbyJob[];
};

export async function fetchAshbyJobs(boardToken: string): Promise<AshbyJob[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(boardToken)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Ashby ${boardToken}: HTTP ${res.status}`);
  }
  const data = (await res.json()) as AshbyBoardResponse;
  return Array.isArray(data.jobs) ? data.jobs : [];
}

export function resolveAshbyLocation(job: AshbyJob): string {
  const parts = [job.location?.trim()].filter(Boolean);
  for (const sec of job.secondaryLocations ?? []) {
    const loc = sec.location?.trim();
    if (loc) parts.push(loc);
  }
  if (job.isRemote && !/\bremote\b/i.test(parts.join("; "))) {
    parts.push("Remote (US)");
  }
  return parts.join("; ") || "United States";
}
