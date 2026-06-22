const FANTASTIC_API_BASE = "https://data.fantastic.jobs/v1";

export type FantasticJobKind = "ats" | "jb";

export type FantasticJob = {
  id: number;
  title: string;
  url: string;
  source: string;
  source_type: "ats" | "jobboard";
  organization?: string;
  organization_url?: string;
  date_posted?: string;
  date_created: string;
  locations_derived?: unknown[];
  locations_alt?: string;
  location_type?: string;
  cities_derived?: string[];
  regions_derived?: string[];
  countries_derived?: string[];
  ai_work_arrangement?: "Remote Solely" | "Remote OK" | "Hybrid" | "On-site";
  ai_remote_location_derived?: string;
  ai_employment_type?: string;
  ai_core_responsibilities?: string;
  ai_requirements_summary?: string;
  ai_experience_level?: string;
  org_linkedin_recruitment_agency_derived?: boolean;
  ats_duplicate?: boolean;
  seniority?: string;
};

export type FantasticEndpoint = "active-ats" | "active-jb";

export type FetchFantasticOptions = {
  endpoint: FantasticEndpoint;
  /** Best for polling every 2–3 hours. */
  timeFrame?: "1h" | "24h";
  limit?: number;
  maxPages?: number;
};

function getApiKey(): string | null {
  const key = process.env.FANTASTIC_JOBS_API_KEY?.trim();
  return key || null;
}

function buildInternshipQuery(endpoint: FantasticEndpoint): URLSearchParams {
  const params = new URLSearchParams();
  params.set("location", "United States");
  params.set("ai_employment_type", "INTERN");
  params.set("organization_agency", "exclude");
  params.set("ai_language", "English");
  params.set("title", "intern OR internship");

  if (endpoint === "active-jb") {
    params.set("seniority", "Internship");
    params.set("exclude_ats_duplicate", "true");
  }

  return params;
}

async function fetchFantasticPage(
  apiKey: string,
  endpoint: FantasticEndpoint,
  timeFrame: "1h" | "24h",
  limit: number,
  offset: number
): Promise<FantasticJob[]> {
  const params = buildInternshipQuery(endpoint);
  params.set("time_frame", timeFrame);
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const url = `${FANTASTIC_API_BASE}/${endpoint}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 2000));
    const retry = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!retry.ok) {
      throw new Error(`Fantastic.jobs ${endpoint} rate limited (${retry.status})`);
    }
    return (await retry.json()) as FantasticJob[];
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Fantastic.jobs ${endpoint} failed (${res.status})${body ? `: ${body.slice(0, 200)}` : ""}`
    );
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`Fantastic.jobs ${endpoint} returned unexpected payload`);
  }
  return data as FantasticJob[];
}

/** Paginate offset-based fetches until a short page or maxPages. */
export async function fetchFantasticInternships(
  options: FetchFantasticOptions
): Promise<FantasticJob[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("FANTASTIC_JOBS_API_KEY is not configured");
  }

  const limit = Math.min(1000, Math.max(1, options.limit ?? 500));
  const maxPages = options.maxPages ?? 15;
  const timeFrame = options.timeFrame ?? "1h";
  const all: FantasticJob[] = [];

  for (let page = 0; page < maxPages; page++) {
    const batch = await fetchFantasticPage(
      apiKey,
      options.endpoint,
      timeFrame,
      limit,
      page * limit
    );
    all.push(...batch);
    if (batch.length < limit) break;
  }

  return all;
}

export async function fetchFantasticAtsAndJobBoardInternships(options?: {
  timeFrame?: "1h" | "24h";
  maxPages?: number;
}): Promise<{ ats: FantasticJob[]; jobBoard: FantasticJob[] }> {
  const common = {
    timeFrame: options?.timeFrame ?? "1h",
    maxPages: options?.maxPages ?? 15,
    limit: 500,
  };

  const [ats, jobBoard] = await Promise.all([
    fetchFantasticInternships({ endpoint: "active-ats", ...common }),
    fetchFantasticInternships({ endpoint: "active-jb", ...common }),
  ]);

  return { ats, jobBoard };
}
