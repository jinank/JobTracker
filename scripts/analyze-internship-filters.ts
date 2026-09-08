/**
 * Shows why internships are filtered out during sync.
 * Usage: npx tsx scripts/analyze-internship-filters.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();
process.chdir(path.join(__dirname, ".."));

async function main() {
const { createClient } = await import("@supabase/supabase-js");
const { fetchGreenhouseJobs } = await import("../lib/jobs/fetchers/greenhouse");
const { fetchLeverPostings } = await import("../lib/jobs/fetchers/lever");
const { isInternshipTitle, isUsInternship, parseUsLocation } = await import(
  "../lib/jobs/isUsInternship"
);
const { resolveGreenhouseLocation } = await import(
  "../lib/jobs/resolveGreenhouseLocation"
);

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url!, key!);

const { data: sources } = await sb
  .from("job_sources")
  .select("*")
  .eq("enabled", true);

let internNotUs: { company: string; title: string; loc: string }[] = [];
let notInternUsLooking: { company: string; title: string; loc: string }[] = [];
let kept = 0;
let fetched = 0;
let internTotal = 0;

for (const source of sources ?? []) {
  if (source.ats === "greenhouse") {
    const jobs = await fetchGreenhouseJobs(source.board_token);
    fetched += jobs.length;
    for (const job of jobs) {
      const title = job.title;
      const loc = resolveGreenhouseLocation(job);
      if (!isInternshipTitle(title, source.force_internship)) {
        if (/intern|co-?op|summer.*20\d{2}/i.test(title) && notInternUsLooking.length < 15) {
          notInternUsLooking.push({ company: source.company, title, loc });
        }
        continue;
      }
      internTotal++;
      if (!isUsInternship(title, loc, { forceInternship: source.force_internship })) {
        if (internNotUs.length < 25) {
          internNotUs.push({ company: source.company, title, loc });
        }
        continue;
      }
      kept++;
    }
  } else {
    const postings = await fetchLeverPostings(source.board_token);
    fetched += postings.length;
    for (const posting of postings) {
      const title = posting.text;
      const loc = posting.categories?.location?.trim() || "";
      if (!isInternshipTitle(title, source.force_internship)) continue;
      internTotal++;
      if (!isUsInternship(title, loc || "United States", { forceInternship: source.force_internship })) {
        if (internNotUs.length < 25) {
          internNotUs.push({ company: source.company, title, loc: loc || "(empty)" });
        }
        continue;
      }
      kept++;
    }
  }
}

console.log(`Sampled ${sources?.length} sources: fetched=${fetched}, intern titles=${internTotal}, US kept=${kept}`);
console.log("\n--- Internships rejected for location (sample) ---");
for (const r of internNotUs) {
  console.log(`  [${r.company}] ${r.title}`);
  console.log(`    loc: "${r.loc}" -> parse:`, parseUsLocation(r.loc));
}
console.log("\n--- Maybe intern but title filter missed (sample) ---");
for (const r of notInternUsLooking) {
  console.log(`  [${r.company}] ${r.title} | ${r.loc}`);
}
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
