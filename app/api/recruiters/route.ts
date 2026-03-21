import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/requirePaid";
import { companyNameToDomain } from "@/lib/companyDomain";
import { supabase } from "@/lib/supabase";

const RECRUITER_TITLES = [
  "recruiter",
  "recruitment",
  "hiring manager",
  "talent acquisition",
  "talent manager",
  "technical recruiter",
  "recruiting",
  "talent partner",
  "talent coordinator",
  "talent specialist",
  "talent advisor",
  "talent consultant",
  "talent operations",
  "talent ops",
  "head of talent",
  "director of talent",
  "vp of talent",
  "staffing",
  "sourcer",
  "human resources",
  "people operations",
  "people partner",
  "people business partner",
  "people & culture",
  "people and culture",
  "people team",
  "head of people",
  "director of people",
  "vp of people",
  "chief people",
  "people lead",
  "employer brand",
  "campus recruiting",
  "university relations",
  "workforce",
  "personnel",
  "onboarding",
  "hrbp",
  "people analyst",
];

const CLAY_TIMEOUT_MS = 45_000;
const APOLLO_API = "https://api.apollo.io/api/v1/mixed_people/api_search";
const HAPPENSTANCE_API = "https://api.happenstance.ai/v1";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Max people returned per provider / Reach Out page (free tiers often cap at 5–10). */
function recruiterResultCap(): number {
  const raw = process.env.RECRUITER_MAX_RESULTS?.trim();
  const n = raw ? parseInt(raw, 10) : 5;
  if (!Number.isFinite(n)) return 5;
  return Math.min(50, Math.max(1, n));
}

function isHunterPaginationLimitError(json: unknown): boolean {
  if (!json || typeof json !== "object") return false;
  const o = json as { errors?: unknown[] };
  if (!Array.isArray(o.errors)) return false;
  return o.errors.some((e) => {
    if (!e || typeof e !== "object") return false;
    const err = e as { id?: string; code?: number; details?: string };
    if (err.id === "pagination_error") return true;
    const d = String(err.details ?? "").toLowerCase();
    return d.includes("limited to") && d.includes("email");
  });
}

export interface RecruiterPerson {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  organizationName: string;
  linkedinUrl?: string;
}

function parseReachOutProviders(): string[] {
  const raw = process.env.REACH_OUT_PROVIDERS?.trim();
  // Hunter = domain emails; Apollo/Clay = vendor; Happenstance = async search over
  // the professional network tied to HAPPENSTANCE_API_KEY (see docs).
  if (!raw) return ["hunter", "happenstance", "apollo", "clay"];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function titleLooksRecruiter(title: string | null | undefined): boolean {
  if (!title) return false;
  const t = title.toLowerCase();
  if (RECRUITER_TITLES.some((kw) => t.includes(kw))) return true;
  // Short tokens as whole words (Hunter often uses "HR Manager", "HRBP", etc.)
  if (/\bhr\b/.test(t) || /\bhrbp\b/.test(t)) return true;
  // "People" in HR sense (avoid matching random "people" in long sentences—titles are short)
  if (t.length < 80 && /\bpeople\b/.test(t) && /(hr|talent|culture|operations|partner|lead|director|head|vp|chief)/.test(t))
    return true;
  return false;
}

function extractPeopleArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const o = data as Record<string, unknown>;

  if (Array.isArray(o.people)) return o.people;
  if (Array.isArray(o.results)) return o.results;
  if (Array.isArray(o.contacts)) return o.contacts;
  if (Array.isArray(o.data)) return o.data;

  const nested = o.data;
  if (nested && typeof nested === "object") {
    const d = nested as Record<string, unknown>;
    if (Array.isArray(d.people)) return d.people;
    if (Array.isArray(d.results)) return d.results;
  }

  const nestedPayload = o.payload;
  if (nestedPayload && typeof nestedPayload === "object") {
    const p = nestedPayload as Record<string, unknown>;
    if (Array.isArray(p.people)) return p.people;
  }

  return [];
}

function mapClayRecord(
  raw: unknown,
  fallbackCompany: string
): RecruiterPerson | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;

  const firstName = String(
    p.firstName ?? p.first_name ?? p.given_name ?? p.givenName ?? ""
  ).trim();
  const lastName = String(
    p.lastName ?? p.last_name ?? p.family_name ?? p.familyName ?? ""
  ).trim();
  const titleRaw = p.title ?? p.job_title ?? p.jobTitle ?? p.headline;
  const title =
    titleRaw === null || titleRaw === undefined
      ? null
      : String(titleRaw).trim() || null;

  const organizationName = String(
    p.organizationName ??
      p.organization_name ??
      p.company ??
      p.company_name ??
      p.companyName ??
      fallbackCompany
  ).trim();

  const linkedinRaw =
    p.linkedinUrl ?? p.linkedin_url ?? p.linkedin ?? p.linkedin_profile_url;
  const linkedinUrl =
    linkedinRaw !== null && linkedinRaw !== undefined
      ? String(linkedinRaw).trim() || undefined
      : undefined;

  const idRaw = p.id ?? p._id ?? p.linkedin_id ?? p.linkedinId;
  const id =
    idRaw !== null && idRaw !== undefined
      ? String(idRaw)
      : `clay:${firstName}:${lastName}:${title ?? ""}`;

  if (!firstName && !lastName && !title) return null;

  return {
    id,
    firstName,
    lastName,
    title,
    organizationName: organizationName || fallbackCompany,
    linkedinUrl,
  };
}

function parseJsonBody(text: string): unknown {
  const t = text.trim();
  if (!t) return null;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return null;
  }
}

async function fetchRecruitersFromClay(args: {
  company: string;
  domain: string;
  webhookUrl: string;
  apiKey: string | undefined;
}): Promise<{ people: RecruiterPerson[]; rawStatus: number }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (args.apiKey?.trim()) {
    headers.Authorization = `Bearer ${args.apiKey.trim()}`;
  }

  const body = {
    company: args.company,
    domain: args.domain,
    recruiter_title_filters: RECRUITER_TITLES,
    source: "rethinkjobs-reach-out",
  };

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), CLAY_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(args.webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(t);
  }

  const text = await res.text();
  const parsed = parseJsonBody(text);
  const arr = extractPeopleArray(parsed);

  const people: RecruiterPerson[] = [];
  for (const row of arr) {
    const person = mapClayRecord(row, args.company);
    if (person) people.push(person);
    if (people.length >= recruiterResultCap()) break;
  }

  return { people: people.slice(0, recruiterResultCap()), rawStatus: res.status };
}

async function fetchRecruitersFromApollo(args: {
  company: string;
  domain: string;
  apiKey: string;
}): Promise<{
  people: RecruiterPerson[];
  rawStatus: number;
  blocked?: boolean;
  details?: string;
}> {
  const params = new URLSearchParams();
  params.append("q_organization_domains_list[]", args.domain);
  RECRUITER_TITLES.forEach((t) => params.append("person_titles[]", t));
  params.set("per_page", String(recruiterResultCap()));
  params.set("page", "1");

  const res = await fetch(`${APOLLO_API}?${params.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "x-api-key": args.apiKey,
    },
    body: "{}",
  });

  const errText = await res.text();
  if (!res.ok) {
    try {
      const errJson = JSON.parse(errText) as {
        error?: string;
        error_code?: string;
      };
      if (errJson?.error_code === "API_INACCESSIBLE") {
        return {
          people: [],
          rawStatus: res.status,
          blocked: true,
          details: errJson.error,
        };
      }
    } catch {
      /* ignore */
    }
    return {
      people: [],
      rawStatus: res.status,
      details: errText.slice(0, 500),
    };
  }

  const data = JSON.parse(errText) as {
    people?: Array<{
      id?: string;
      first_name?: string;
      last_name?: string;
      last_name_obfuscated?: string;
      title?: string;
      linkedin_url?: string;
      organization?: { name?: string };
    }>;
    total_entries?: number;
  };

  const cap = recruiterResultCap();
  const people: RecruiterPerson[] = (data.people ?? []).slice(0, cap).map((p) => ({
    id: p.id ?? `apollo:${p.first_name}:${p.last_name}`,
    firstName: p.first_name ?? "",
    lastName: p.last_name ?? p.last_name_obfuscated ?? "",
    title: p.title ?? null,
    organizationName: p.organization?.name ?? args.company,
    linkedinUrl: p.linkedin_url,
  }));

  return { people, rawStatus: res.status };
}

async function fetchRecruitersFromHunter(args: {
  company: string;
  domain: string;
  apiKey: string;
}): Promise<{
  people: RecruiterPerson[];
  rawStatus: number;
  message?: string;
  details?: string;
}> {
  const cap = recruiterResultCap();
  /** Free Hunter plans cap domain-search batch size (often 10); we request ≤5 by default. */
  const requestLimits = Array.from(
    new Set(
      [Math.min(cap, 10), 5, 3, 1].filter((n) => n >= 1)
    )
  ).sort((a, b) => b - a);

  let lastJson: unknown = null;
  let lastStatus = 0;

  for (const requestLimit of requestLimits) {
    const url = new URL("https://api.hunter.io/v2/domain-search");
    url.searchParams.set("domain", args.domain);
    url.searchParams.set("api_key", args.apiKey);
    url.searchParams.set("limit", String(Math.min(requestLimit, 10)));

    const res = await fetch(url.toString());
    lastStatus = res.status;
    let json: {
      data?: {
        emails?: Array<{
          first_name?: string | null;
          last_name?: string | null;
          position?: string | null;
          linkedin?: string | null;
          value?: string | null;
        }>;
      };
      errors?: unknown;
    };

    try {
      json = (await res.json()) as typeof json;
    } catch {
      return {
        people: [],
        rawStatus: lastStatus,
        details: "Invalid JSON from Hunter.io",
      };
    }

    lastJson = json;

    if (json.errors && isHunterPaginationLimitError(json)) {
      continue;
    }

    if (json.errors) {
      return {
        people: [],
        rawStatus: lastStatus,
        details: JSON.stringify(json.errors).slice(0, 500),
      };
    }

    const emails = json.data?.emails ?? [];
    const mapped: RecruiterPerson[] = [];

    for (let i = 0; i < emails.length; i++) {
      const e = emails[i];
      const firstName = (e.first_name ?? "").trim();
      const lastName = (e.last_name ?? "").trim();
      const title = e.position?.trim() || null;
      if (!firstName && !lastName && !title) continue;
      mapped.push({
        id: `hunter:${e.value ?? `${firstName}-${lastName}-${i}`}`,
        firstName,
        lastName,
        title,
        organizationName: args.company,
        linkedinUrl: e.linkedin?.trim() || undefined,
      });
      if (mapped.length >= cap) break;
    }

    const recruiting = mapped.filter((p) => titleLooksRecruiter(p.title));
    const chosen =
      recruiting.length > 0 ? recruiting.slice(0, cap) : mapped.slice(0, cap);
    // Don’t nag users when we’re already showing useful rows; wider title matching above
    // covers most HR/recruiting roles Hunter returns.

    if (chosen.length === 0 && emails.length === 0) {
      continue;
    }

    return {
      people: chosen,
      rawStatus: lastStatus,
    };
  }

  return {
    people: [],
    rawStatus: lastStatus,
    details: lastJson
      ? JSON.stringify(
          (lastJson as { errors?: unknown }).errors ?? lastJson
        ).slice(0, 500)
      : "Hunter.io domain search failed after retries.",
  };
}

function mapHappenstanceResults(
  results: Array<{
    id?: string;
    name?: string;
    current_title?: string | null;
    current_company?: string | null;
    socials?: { linkedin_url?: string | null };
  }>,
  fallbackCompany: string,
  cap: number
): RecruiterPerson[] {
  const out: RecruiterPerson[] = [];
  for (const r of results) {
    if (out.length >= cap) break;
    const name = (r.name ?? "").trim();
    const parts = name.split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    const title = r.current_title?.trim() || null;
    const org = (r.current_company ?? "").trim() || fallbackCompany;
    if (!firstName && !lastName && !title) continue;
    out.push({
      id: `happenstance:${r.id ?? name}`,
      firstName,
      lastName,
      title,
      organizationName: org,
      linkedinUrl: r.socials?.linkedin_url?.trim() || undefined,
    });
  }
  return out;
}

/**
 * Happenstance: natural-language search over groups + connections for the account
 * that owns the API key (async; polls until COMPLETED). Not a global people directory—
 * complements Hunter/domain APIs. Docs: https://developer.happenstance.ai/quickstart
 */
async function fetchRecruitersFromHappenstance(args: {
  company: string;
  domain: string;
  apiKey: string;
}): Promise<{
  people: RecruiterPerson[];
  rawStatus: number;
  message?: string;
  details?: string;
}> {
  const cap = recruiterResultCap();
  const pollMs = Math.max(
    2000,
    parseInt(process.env.HAPPENSTANCE_POLL_MS ?? "4000", 10) || 4000
  );
  const maxWaitMs = Math.min(
    120_000,
    Math.max(15_000, parseInt(process.env.HAPPENSTANCE_MAX_WAIT_MS ?? "55000", 10) || 55_000)
  );

  const text = `Recruiters, talent acquisition, hiring managers, or HR contacts at ${args.company} (company domain ${args.domain})`;

  const createRes = await fetch(`${HAPPENSTANCE_API}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      include_my_connections: true,
      include_friends_connections:
        process.env.HAPPENSTANCE_INCLUDE_FRIENDS_CONNECTIONS === "true",
    }),
  });

  const createText = await createRes.text();
  if (!createRes.ok) {
    return {
      people: [],
      rawStatus: createRes.status,
      details: createText.slice(0, 500),
    };
  }

  let createJson: { id?: string };
  try {
    createJson = JSON.parse(createText) as { id?: string };
  } catch {
    return {
      people: [],
      rawStatus: createRes.status,
      details: "Invalid JSON from Happenstance create search",
    };
  }

  const searchId = createJson.id;
  if (!searchId) {
    return {
      people: [],
      rawStatus: createRes.status,
      details: "Happenstance did not return a search id",
    };
  }

  const deadline = Date.now() + maxWaitMs;
  let lastStatus = createRes.status;

  while (Date.now() < deadline) {
    await sleep(pollMs);
    const pollRes = await fetch(`${HAPPENSTANCE_API}/search/${searchId}`, {
      headers: { Authorization: `Bearer ${args.apiKey}` },
    });
    lastStatus = pollRes.status;
    const pollText = await pollRes.text();
    let data: {
      status?: string;
      results?: Array<{
        id?: string;
        name?: string;
        current_title?: string | null;
        current_company?: string | null;
        socials?: { linkedin_url?: string | null };
      }>;
    };
    try {
      data = JSON.parse(pollText) as typeof data;
    } catch {
      return {
        people: [],
        rawStatus: lastStatus,
        details: "Invalid JSON while polling Happenstance",
      };
    }

    const st = data.status ?? "";
    if (st === "FAILED" || st === "FAILED_AMBIGUOUS") {
      return {
        people: [],
        rawStatus: lastStatus,
        details: `Happenstance search ${st}`,
      };
    }
    if (st === "COMPLETED" && Array.isArray(data.results)) {
      const people = mapHappenstanceResults(data.results, args.company, cap);
      return {
        people,
        rawStatus: lastStatus,
        message:
          people.length > 0
            ? "Matches from your Happenstance network (connections/groups)—warmer paths than raw domain lists."
            : undefined,
      };
    }
  }

  return {
    people: [],
    rawStatus: lastStatus,
    message:
      "Happenstance search is still running (often 30–60s). Try Reach Out again in a minute or open the search on happenstance.ai.",
  };
}

function recruiterDedupeKey(p: RecruiterPerson): string {
  const li = (p.linkedinUrl ?? "").toLowerCase().trim();
  if (li) return `li:${li}`;
  const n = `${p.firstName} ${p.lastName}`.toLowerCase().replace(/\s+/g, " ").trim();
  const t = (p.title ?? "").toLowerCase().trim();
  return `n:${n}|${t}`;
}

function mergeRecruiterPeople(
  remotePeople: RecruiterPerson[],
  localPeople: RecruiterPerson[],
  maxResults: number
): RecruiterPerson[] {
  const seen = new Set<string>();
  const out: RecruiterPerson[] = [];
  for (const p of remotePeople) {
    if (out.length >= maxResults) break;
    const k = recruiterDedupeKey(p);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  for (const p of localPeople) {
    if (out.length >= maxResults) break;
    const k = recruiterDedupeKey(p);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

async function getLocalRecruiterPeople(args: {
  userId: string;
  company: string;
}): Promise<RecruiterPerson[]> {
  const { data: matchedChains, error: chainsErr } = await supabase
    .from("chains")
    .select("chain_id")
    .eq("user_id", args.userId)
    .eq("canonical_company", args.company);

  if (chainsErr || !matchedChains?.length) return [];

  const chainIds = matchedChains
    .map((c: { chain_id: string }) => c.chain_id)
    .filter(Boolean);
  if (chainIds.length === 0) return [];

  const { data: eventsData, error: eventsErr } = await supabase
    .from("events")
    .select("extracted_entities")
    .eq("user_id", args.userId)
    .in("chain_id", chainIds);

  const recruiters = new Set<string>();
  if (!eventsErr && eventsData) {
    for (const ev of eventsData as {
      extracted_entities?: { recruiter_name?: string };
    }[]) {
      const rn = ev?.extracted_entities?.recruiter_name;
      if (typeof rn === "string" && rn.trim()) recruiters.add(rn.trim());
    }
  }

  if (recruiters.size === 0) return [];

  return Array.from(recruiters)
    .slice(0, recruiterResultCap())
    .map((name) => {
      const parts = name.split(/\s+/).filter(Boolean);
      const firstName = parts[0] ?? "";
      const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
      return {
        id: `local:${name}`,
        firstName,
        lastName,
        title: null,
        organizationName: args.company,
      };
    });
}

type RemoteFetchResult = {
  people: RecruiterPerson[];
  source: string;
  httpStatus?: number;
  message?: string;
};

async function fetchFromConfiguredProviders(args: {
  company: string;
  domain: string;
  webhookUrl: string | undefined;
  clayBearer: string | undefined;
  apolloKey: string | undefined;
  hunterKey: string | undefined;
  happenstanceKey: string | undefined;
}): Promise<RemoteFetchResult> {
  const order = parseReachOutProviders();
  const notes: string[] = [];

  for (const provider of order) {
    if (provider === "clay" && args.webhookUrl) {
      const { people, rawStatus } = await fetchRecruitersFromClay({
        company: args.company,
        domain: args.domain,
        webhookUrl: args.webhookUrl,
        apiKey: args.clayBearer,
      });
      if (people.length > 0) {
        return { people, source: "clay_webhook", httpStatus: rawStatus };
      }
      if (rawStatus < 200 || rawStatus >= 300) {
        notes.push(`Clay HTTP ${rawStatus}`);
      } else {
        notes.push("Clay returned no people in the response body.");
      }
      continue;
    }

    if (provider === "apollo" && args.apolloKey) {
      const apollo = await fetchRecruitersFromApollo({
        company: args.company,
        domain: args.domain,
        apiKey: args.apolloKey,
      });
      if (apollo.people.length > 0) {
        return {
          people: apollo.people,
          source: "apollo",
          httpStatus: apollo.rawStatus,
        };
      }
      if (apollo.blocked) {
        notes.push(
          "Apollo blocked this endpoint on your plan; try Hunter.io or Clay."
        );
      } else if (apollo.details) {
        notes.push(`Apollo: ${apollo.details.slice(0, 200)}`);
      } else {
        notes.push("Apollo returned no matching people.");
      }
      continue;
    }

    if (provider === "hunter" && args.hunterKey) {
      const hunter = await fetchRecruitersFromHunter({
        company: args.company,
        domain: args.domain,
        apiKey: args.hunterKey,
      });
      if (hunter.people.length > 0) {
        return {
          people: hunter.people,
          source: "hunter",
          httpStatus: hunter.rawStatus,
          message: hunter.message,
        };
      }
      if (hunter.details) {
        notes.push(`Hunter.io: ${hunter.details.slice(0, 200)}`);
      } else {
        notes.push(
          `Hunter.io returned no emails for domain (HTTP ${hunter.rawStatus}).`
        );
      }
      continue;
    }

    if (provider === "happenstance" && args.happenstanceKey) {
      const hs = await fetchRecruitersFromHappenstance({
        company: args.company,
        domain: args.domain,
        apiKey: args.happenstanceKey,
      });
      if (hs.people.length > 0) {
        return {
          people: hs.people,
          source: "happenstance",
          httpStatus: hs.rawStatus,
          message: hs.message,
        };
      }
      if (hs.details) {
        notes.push(`Happenstance: ${hs.details.slice(0, 200)}`);
      } else if (hs.message) {
        notes.push(hs.message);
      } else {
        notes.push("Happenstance returned no matching people in your network.");
      }
      continue;
    }
  }

  return {
    people: [],
    source: "none",
    message:
      notes.length > 0
        ? notes.join(" ")
        : "No Reach Out provider returned data.",
  };
}

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");
  const domain = searchParams.get("domain");

  if (!company?.trim()) {
    return NextResponse.json(
      { error: "Missing company parameter" },
      { status: 400 }
    );
  }

  const resolvedDomain = domain?.trim() || companyNameToDomain(company);
  if (!resolvedDomain) {
    return NextResponse.json(
      { error: "Could not resolve company domain" },
      { status: 400 }
    );
  }

  try {
    const companyTrimmed = company.trim();
    const localPeople = await getLocalRecruiterPeople({
      userId: user.userId,
      company: companyTrimmed,
    });

    const webhookUrl =
      process.env.CLAY_WEBHOOK_URL?.trim() ||
      process.env.CLAY_TABLE_WEBHOOK_URL?.trim();
    const clayBearer = process.env.CLAY_API_KEY?.trim();
    const apolloKey = process.env.APOLLO_API_KEY?.trim();
    const hunterKey = process.env.HUNTER_API_KEY?.trim();
    const happenstanceKey = process.env.HAPPENSTANCE_API_KEY?.trim();

    const hasRemote =
      !!webhookUrl || !!apolloKey || !!hunterKey || !!happenstanceKey;

    const cap = recruiterResultCap();

    if (!hasRemote) {
      if (localPeople.length > 0) {
        const locals = localPeople.slice(0, cap);
        return NextResponse.json({
          people: locals,
          total: locals.length,
          domain: resolvedDomain,
          source: "local_events",
        });
      }
      return NextResponse.json(
        {
          error:
            "Recruiter search is not configured. Add one of: HUNTER_API_KEY, HAPPENSTANCE_API_KEY, APOLLO_API_KEY, or CLAY_WEBHOOK_URL. See .env.example and ENVIRONMENT.md.",
        },
        { status: 503 }
      );
    }

    const remote = await fetchFromConfiguredProviders({
      company: companyTrimmed,
      domain: resolvedDomain,
      webhookUrl,
      clayBearer,
      apolloKey,
      hunterKey,
      happenstanceKey,
    });

    const merged = mergeRecruiterPeople(remote.people, localPeople, cap);

    if (merged.length === 0) {
      return NextResponse.json({
        people: [],
        total: 0,
        domain: resolvedDomain,
        source: remote.source,
        httpStatus: remote.httpStatus,
        message:
          remote.message ??
          "No recruiters found. Check API keys, domain guess, and provider quotas.",
      });
    }

    const source =
      remote.people.length > 0
        ? localPeople.length > 0
          ? `${remote.source}_merged`
          : remote.source
        : "local_events";

    const extraMessages: string[] = [];
    if (remote.message) extraMessages.push(remote.message);
    if (remote.people.length === 0 && localPeople.length > 0) {
      extraMessages.push(
        "Live lookup returned no rows; showing recruiters from your synced emails."
      );
    }

    return NextResponse.json({
      people: merged,
      total: merged.length,
      domain: resolvedDomain,
      source,
      httpStatus: remote.httpStatus,
      ...(extraMessages.length > 0 && { message: extraMessages.join(" ") }),
    });
  } catch (err) {
    console.error("Recruiters API error:", err);
    const msg =
      err instanceof Error && err.name === "AbortError"
        ? `Clay webhook timed out after ${CLAY_TIMEOUT_MS / 1000}s.`
        : "Failed to fetch recruiters.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
