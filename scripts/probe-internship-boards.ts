import { fetchGreenhouseJobs } from "../lib/jobs/fetchers/greenhouse";
import { fetchLeverPostings } from "../lib/jobs/fetchers/lever";
import { isInternshipTitle, isUsInternship } from "../lib/jobs/isUsInternship";
import { resolveGreenhouseLocation } from "../lib/jobs/resolveGreenhouseLocation";

const GH = [
  "openai", "ramp", "rippling", "mercury", "checkr", "grammarly", "hashicorp",
  "zapier", "squarespace", "contentful", "amplitude", "launchdarkly", "segment",
  "miro", "canva", "deel", "lattice", "oscar", "warbyparker", "flatironhealth",
  "sentinelone", "wiz", "rubrik", "cruise", "waymo", "anduril", "spacex",
  "palantir", "notion", "linear", "retool", "verkada", "snyk", "gitlab",
  "elastic", "confluent", "mongodb", "snowflake", "nvidia", "amd", "qualcomm",
  "tesla", "rivian", "lyft", "uber", "doordash", "instacart", "grubhub",
  "toast", "square", "block", "sofi", "betterment", "n26", "monzo",
  "carta", "gusto", "justworks", "remote", "figma", "stripe", "shopify",
  "hubspot", "atlassian", "dropbox", "box", "asana", "airtable", "notion",
  "pinterest", "reddit", "snap", "snapchat", "discord", "roblox", "unity",
  "epicgames", "riotgames", "twilio", "okta", "cloudflare", "datadog",
  "newrelic", "splunk", "crowdstrike", "zscaler", "paloaltonetworks",
  "fastly", "akamai", "digitalocean", "linode", "hashicorp", "databricks",
  "cockroachlabs", "planetscale", "supabase", "vercel", "netlify", "github",
  "circleci", "jfrog", "mongodb", "couchbase", "redis", "hashicorp",
  "anthropic", "cohere", "huggingface", "scaleai", "labelbox", "weights",
  "grammarly", "duolingo", "coursera", "khanacademy", "chegg", "handshake",
  "greenhouse", "lever", "workday",
];

const LV = [
  "netflix", "spotify", "plaid", "flexport", "affirm", "chime", "brex",
  "coinbase", "robinhood", "lyft", "uber", "square", "stripe", "figma",
  "notion", "linear", "ramp", "rippling", "deel", "remote", "gitlab",
  "hashicorp", "confluent", "elastic", "mongodb", "cockroachlabs",
  "vercel", "supabase", "github", "circleci", "miro", "canva", "amplitude",
  "segment", "launchdarkly", "contentful", "snyk", "wiz", "sentinelone",
  "crowdstrike", "zscaler", "paloaltonetworks", "fastly", "akamai",
  "digitalocean", "linode", "planetscale", "redis", "couchbase", "jfrog",
  "handshake", "greenhouse", "lever", "workday", "tesla", "rivian",
  "waymo", "cruise", "anduril", "spacex", "palantir", "openai", "anthropic",
  "cohere", "huggingface", "scaleai", "labelbox", "weights", "grammarly",
  "duolingo", "coursera", "khanacademy", "chegg", "handshake",
];

async function countGh(token: string) {
  try {
    const jobs = await fetchGreenhouseJobs(token);
    let us = 0;
    let intern = 0;
    for (const job of jobs) {
      const loc = resolveGreenhouseLocation(job);
      if (!isInternshipTitle(job.title)) continue;
      intern++;
      if (isUsInternship(job.title, loc)) us++;
    }
    return { ok: true, total: jobs.length, intern, us };
  } catch (e) {
    return { ok: false, total: 0, intern: 0, us: 0 };
  }
}

async function countLv(token: string) {
  try {
    const jobs = await fetchLeverPostings(token);
    let us = 0;
    let intern = 0;
    for (const job of jobs) {
      const loc = job.categories?.location?.trim() || "";
      if (!isInternshipTitle(job.text)) continue;
      intern++;
      if (isUsInternship(job.text, loc || "United States")) us++;
    }
    return { ok: true, total: jobs.length, intern, us };
  } catch {
    return { ok: false, total: 0, intern: 0, us: 0 };
  }
}

async function main() {
  const seen = new Set<string>();
  const results: { ats: string; token: string; intern: number; us: number; total: number }[] = [];

  for (const token of GH) {
    if (seen.has(`gh:${token}`)) continue;
    seen.add(`gh:${token}`);
    const r = await countGh(token);
    if (r.ok && r.us > 0) {
      results.push({ ats: "greenhouse", token, ...r });
    }
  }

  for (const token of LV) {
    if (seen.has(`lv:${token}`)) continue;
    seen.add(`lv:${token}`);
    const r = await countLv(token);
    if (r.ok && r.us > 0) {
      results.push({ ats: "lever", token, ...r });
    }
  }

  results.sort((a, b) => b.us - a.us);
  console.log("Boards with US internships:");
  for (const r of results) {
    console.log(`  ${r.ats}:${r.token} -> ${r.us} US intern / ${r.intern} intern / ${r.total} total`);
  }
  console.log(`\nTotal boards with US interns: ${results.length}`);
}

main();
