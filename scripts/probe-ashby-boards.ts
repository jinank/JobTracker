import { isInternshipTitle, isUsInternship } from "../lib/jobs/isUsInternship";

type AshbyJob = {
  id: string;
  title: string;
  location: string;
  secondaryLocations?: Array<{ location: string }>;
  employmentType?: string;
  jobUrl: string;
  isRemote?: boolean;
};

type AshbyResponse = { jobs?: AshbyJob[] };

function resolveAshbyLocation(job: AshbyJob): string {
  const parts = [job.location];
  for (const sec of job.secondaryLocations ?? []) {
    if (sec.location) parts.push(sec.location);
  }
  return parts.filter(Boolean).join("; ");
}

async function fetchAshby(board: string): Promise<AshbyJob[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as AshbyResponse;
  return data.jobs ?? [];
}

const CANDIDATES = [
  "ramp", "openai", "notion", "linear", "retool", "rippling", "mercury",
  "checkr", "deel", "lattice", "cohere", "huggingface", "perplexity", "xai",
  "mistral", "anthropic", "scale", "scaleai", "labelbox", "runway", "harvey",
  "glean", "anyscale", "character", "snorkel", "weights", "benchling",
  "tempus", "vercel", "supabase", "planetscale", "neon", "fly", "render",
  "railway", "replit", "sourcegraph", "figma", "stripe", "coinbase", "brex",
  "chime", "affirm", "sofi", "robinhood", "plaid", "flexport", "deel",
  "remote", "gitlab", "hashicorp", "confluent", "elastic", "snyk", "wiz",
  "sentinelone", "crowdstrike", "zscaler", "paloaltonetworks", "fastly",
  "datadog", "newrelic", "snowflake", "databricks", "mongodb", "cockroachlabs",
  "github", "circleci", "miro", "canva", "amplitude", "launchdarkly",
  "segment", "contentful", "zapier", "grammarly", "duolingo", "handshake",
  "anduril", "spacex", "palantir", "scale", "nuro", "aurora", "waymo",
  "cruise", "zoox", "rivian", "tesla", "appliedintuition", "shieldai",
  "skydio", "rocketlab", "relativity", "firefly", "astra", "planet",
  "1password", "bitwarden", "auth0", "okta", "twilio", "sendgrid", "klaviyo",
  "hubspot", "shopify", "square", "block", "cashapp", "afterpay", "klarna",
  "gemini", "kraken", "circle", "anchorage", "fireblocks", "chainalysis",
  "dydx", "uniswap", "a16z", "sequoia", "ycombinator", "benchling", "tempus",
  "guardant", "illumina", "10xgenomics", "ginkgo", "modernatx", "regeneron",
  "vertex", "biogen", "amgen", "genentech", "roche", "novartis", "gsk",
  "servicenow", "workday", "splunk", "fortinet", "checkpoint", "proofpoint",
  "mimecast", "duo", "cloudflare", "akamai", "dynatrace", "appdynamics",
  "sumologic", "honeycomb", "lightstep", "turso", "heroku", "digitalocean",
  "linode", "vultr", "hetzner", "bitbucket", "travis", "jenkins", "jfrog",
  "sonatype", "veracode", "checkmarx", "synopsys", "cadence", "ansys",
  "mathworks", "mapbox", "here", "tomtom", "motional", "argo", "aptiv",
  "mobileye", "lucid", "fisker", "polestar", "nio", "xpeng", "blueorigin",
  "relativity", "firefly", "astra", "virginorbit", "maxar", "blacksky",
  "capella", "iceye", "spire", "umbra", "openai", "deepmind", "meta",
  "microsoft", "amazon", "apple", "netflix", "disney", "warner", "paramount",
  "sony", "nintendo", "ea", "epicgames", "riotgames", "valve", "blizzard",
  "activision", "take2", "ubisoft", "unity", "roblox", "discord", "snap",
  "pinterest", "reddit", "twitter", "linkedin", "tiktok", "bytedance",
  "instagram", "whatsapp", "threads", "youtube", "google", "alphabet",
  "wing", "verily", "calico", "brain", "research", "inflection", "adept",
  "magic", "poolside", "codeium", "cursor", "copilot", "tabnine", "stackblitz",
  "glitch", "sketch", "invision", "framer", "webflow", "squarespace", "wix",
  "bigcommerce", "magento", "salesforce", "marketo", "pardot", "eloqua",
  "mailchimp", "bandwidth", "plivo", "vonage", "ringcentral", "zoom",
  "teams", "slack", "monday", "clickup", "airtable", "smartsheet", "basecamp",
  "trello", "jira", "confluence", "mural", "figjam", "lucid", "whimsical",
  "coda", "roam", "obsidian", "logseq", "evernote", "onenote", "todoist",
  "headspace", "calm", "betterhelp", "talkspace", "lyra", "springhealth",
  "modernhealth", "ginger", "headway", "alma", "cerebral", "hims", "ro",
  "nurx", "keeps", "roman", "honeybee", "pillpack", "capsule", "alto",
  "goodrx", "carta", "justworks", "betterment", "gusto", "rippling",
];

async function main() {
  const seen = new Set<string>();
  const hits: Array<{ board: string; us: number; intern: number; total: number; samples: string[] }> = [];

  for (const board of CANDIDATES) {
    if (seen.has(board)) continue;
    seen.add(board);
    try {
      const jobs = await fetchAshby(board);
      let us = 0;
      let intern = 0;
      const samples: string[] = [];
      for (const job of jobs) {
        const loc = resolveAshbyLocation(job);
        const isIntern =
          isInternshipTitle(job.title) ||
          job.employmentType?.toLowerCase().includes("intern") === true;
        if (!isIntern) continue;
        intern++;
        if (isUsInternship(job.title, loc)) {
          us++;
          if (samples.length < 2) samples.push(job.title);
        }
      }
      if (us > 0) hits.push({ board, us, intern, total: jobs.length, samples });
    } catch {
      /* no board */
    }
  }

  hits.sort((a, b) => b.us - a.us);
  console.log("Ashby boards with US internships:");
  for (const h of hits) {
    console.log(
      `  ashby:${h.board} -> ${h.us} US / ${h.intern} intern / ${h.total} total  [${h.samples.join("; ")}]`
    );
  }
  console.log(`\nTotal: ${hits.length}`);
}

main();
