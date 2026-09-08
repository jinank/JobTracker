import { fetchGreenhouseJobs } from "../lib/jobs/fetchers/greenhouse";
import { fetchLeverPostings } from "../lib/jobs/fetchers/lever";
import { isInternshipTitle, isUsInternship } from "../lib/jobs/isUsInternship";
import { resolveGreenhouseLocation } from "../lib/jobs/resolveGreenhouseLocation";
import { INTERNSHIP_SOURCE_SEED } from "../lib/jobs/seedSources";

const EXISTING = new Set(
  INTERNSHIP_SOURCE_SEED.map((s) => `${s.ats}:${s.board_token}`)
);

const GH_CANDIDATES = [
  "openai", "ramp", "rippling", "notion", "linear", "retool", "snowflake",
  "nvidia", "cruise", "waymo", "toast", "sofi", "mercury", "checkr", "grammarly",
  "hashicorp", "zapier", "amplitude", "launchdarkly", "segment", "miro", "deel",
  "lattice", "sentinelone", "wiz", "snyk", "gitlab", "confluent", "elastic",
  "cockroachlabs", "github", "circleci", "cohere", "huggingface", "tesla", "rivian",
  "nuro", "aurora", "appliedintuition", "newrelic", "crowdstrike", "fastly",
  "digitalocean", "twosigma", "citadel", "hudsonrivertrading", "jumptrading",
  "optiver", "capitalone", "shopify", "atlassian", "box", "amd", "qualcomm",
  "paloaltonetworks", "akamai", "splunk", "redis", "planetscale", "supabase",
  "netlify", "squarespace", "contentful", "canva", "oscar", "riotgames", "snap",
  "anduril", "andurilindustries", "weightsandbiases", "character", "xai",
  "mistral", "perplexity", "runway", "stabilityai", "harvey", "glean", "anyscale",
  "intel", "cisco", "salesforce", "adobe", "servicenow", "autodesk", "micron",
  "broadcom", "oracle", "ibm", "benchling", "tempus", "guardant", "illumina",
  "10xgenomics", "ginkgo", "modernatx", "regeneron", "vertex", "biogen", "amgen",
  "genentech", "fortinet", "1password", "bitwarden", "auth0", "dynatrace",
  "sumologic", "honeycomb", "neon", "flyio", "render", "railway", "jfrog",
  "veracode", "checkmarx", "synopsys", "cadence", "ansys", "mathworks", "mapbox",
  "zoox", "motional", "argo", "mobileye", "lucid", "blueorigin", "rocketlab",
  "relativity", "shieldai", "skydio", "snorkel", "deepmind", "take2", "valve",
  "blizzard", "activision", "ubisoft", "tiktok", "bytedance", "sourcegraph",
  "replit", "framer", "bigcommerce", "sendgrid", "bandwidth", "ringcentral",
  "zoom", "monday", "clickup", "smartsheet", "coda", "headway", "carta",
  "justworks", "betterment", "carta", "anchorage", "fireblocks", "chainalysis",
  "circle", "gemini", "kraken", "dydx", "benchling", "tempus", "flatironhealth",
  "warbyparker", "oscarhealth", "devoted", "clover", "hims", "ro", "nurx",
  "doordash", "uber", "grubhub", "square", "toasttab", "squareup", "blockxyz",
  "coinbasecareers", "lyftcareers", "stripejobs", "figmacareers",
];

const LV_CANDIDATES = [
  "ramp", "rippling", "notion", "linear", "openai", "deel", "remote", "gitlab",
  "hashicorp", "confluent", "elastic", "vercel", "supabase", "github", "circleci",
  "miro", "canva", "amplitude", "segment", "launchdarkly", "contentful", "snyk",
  "wiz", "sentinelone", "crowdstrike", "fastly", "akamai", "digitalocean",
  "planetscale", "redis", "couchbase", "jfrog", "handshake", "tesla", "rivian",
  "waymo", "cruise", "anduril", "openai", "anthropic", "cohere", "huggingface",
  "scaleai", "labelbox", "grammarly", "duolingo", "coursera", "khanacademy",
  "chegg", "lyft", "uber", "flexport", "affirm", "chime", "brex", "coinbase",
  "robinhood", "square", "stripe", "figma",
];

async function probeGh(token: string) {
  const jobs = await fetchGreenhouseJobs(token);
  let us = 0;
  let intern = 0;
  const samples: string[] = [];
  for (const job of jobs) {
    const loc = resolveGreenhouseLocation(job);
    if (!isInternshipTitle(job.title)) continue;
    intern++;
    if (isUsInternship(job.title, loc)) {
      us++;
      if (samples.length < 2) samples.push(job.title);
    }
  }
  return { us, intern, total: jobs.length, samples };
}

async function probeLv(token: string) {
  const jobs = await fetchLeverPostings(token);
  let us = 0;
  let intern = 0;
  const samples: string[] = [];
  for (const job of jobs) {
    const loc = job.categories?.location?.trim() || "";
    if (!isInternshipTitle(job.text)) continue;
    intern++;
    if (isUsInternship(job.text, loc || "United States")) {
      us++;
      if (samples.length < 2) samples.push(job.text);
    }
  }
  return { us, intern, total: jobs.length, samples };
}

async function main() {
  const hits: Array<{
    ats: string;
    token: string;
    us: number;
    intern: number;
    total: number;
    samples: string[];
  }> = [];

  for (const token of GH_CANDIDATES) {
    const key = `greenhouse:${token}`;
    if (EXISTING.has(key)) continue;
    try {
      const r = await probeGh(token);
      if (r.us > 0) hits.push({ ats: "greenhouse", token, ...r });
    } catch {
      /* board missing */
    }
  }

  for (const token of LV_CANDIDATES) {
    const key = `lever:${token}`;
    if (EXISTING.has(key)) continue;
    try {
      const r = await probeLv(token);
      if (r.us > 0) hits.push({ ats: "lever", token, ...r });
    } catch {
      /* board missing */
    }
  }

  hits.sort((a, b) => b.us - a.us);
  console.log("New boards with US internships (not in seed):");
  for (const h of hits) {
    console.log(
      `  ${h.ats}:${h.token} -> ${h.us} US / ${h.intern} intern / ${h.total} total  [${h.samples.join("; ")}]`
    );
  }
  console.log(`\nTotal new boards: ${hits.length}`);
}

main();
