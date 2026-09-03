/**
 * Top-up US Summer 2027 internships across underrepresented role categories
 * (Product, Design, Marketing, Operations, Data) via Fantastic.jobs.
 * Usage: npm run sync:fantastic-categories
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

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

const root = path.join(__dirname, "..");
process.chdir(root);

/** Category-focused title queries (Fantastic title search + 2027). */
const CATEGORY_QUERIES = [
  {
    label: "Product",
    titleQuery:
      '2027 (product intern OR "product management" intern OR "product manager" intern OR "product design" intern)',
    maxUpsert: 4,
  },
  {
    label: "Design",
    titleQuery:
      '2027 (design intern OR "ux intern" OR "ui intern" OR "ux/ui" intern OR "graphic design" intern OR "product designer" intern)',
    maxUpsert: 4,
  },
  {
    label: "Marketing",
    titleQuery:
      '2027 (marketing intern OR "brand intern" OR "growth intern" OR "content marketing" intern OR "digital marketing" intern)',
    maxUpsert: 4,
  },
  {
    label: "Operations",
    titleQuery:
      '2027 (operations intern OR "business operations" intern OR "strategy intern" OR "program manager" intern OR "supply chain" intern)',
    maxUpsert: 4,
  },
  {
    label: "Data & Analytics",
    titleQuery:
      '2027 (data intern OR "data analyst" intern OR "data science" intern OR analytics intern OR "business analyst" intern)',
    maxUpsert: 4,
  },
];

async function main() {
  const { syncFantasticInternships } = await import(
    pathToFileURL(path.join(root, "lib/jobs/syncFantasticJobs.ts")).href
  );

  if (!process.env.FANTASTIC_JOBS_API_KEY?.trim()) {
    console.error("FANTASTIC_JOBS_API_KEY is not set in .env.local");
    process.exitCode = 1;
    return;
  }

  const now = new Date().toISOString();
  const totals = {
    fetched: 0,
    upserted: 0,
    errors: [],
  };

  for (const category of CATEGORY_QUERIES) {
    console.log(`\n=== ${category.label} ===`);
    const result = await syncFantasticInternships(now, {
      timeFrame: "7d",
      maxPages: 1,
      limit: 20,
      maxUpsert: category.maxUpsert,
      titleQuery: category.titleQuery,
    });

    console.log(JSON.stringify(result, null, 2));
    totals.fetched += result.fetched;
    totals.upserted += result.upserted;
    totals.errors.push(...result.errors);

    // Brief pause to avoid Fantastic rate limits between category pulls.
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log("\n=== TOTALS ===");
  console.log(JSON.stringify(totals, null, 2));

  if (totals.errors.length) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
