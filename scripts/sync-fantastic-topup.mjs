/**
 * Small Fantastic.jobs top-up: ~20–30 US Summer 2027 internships.
 * Usage: npm run sync:fantastic-topup
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

const TITLE_2027 =
  '2027 intern OR 2027 internship OR "summer 2027" intern OR "summer 2027" internship';

async function main() {
  const { syncFantasticInternships } = await import(
    pathToFileURL(path.join(root, "lib/jobs/syncFantasticJobs.ts")).href
  );

  console.log(
    "Fetching ~30 US 2027 internships from Fantastic.jobs (7d window, capped)..."
  );
  const now = new Date().toISOString();
  const result = await syncFantasticInternships(now, {
    timeFrame: "7d",
    maxPages: 1,
    limit: 25,
    maxUpsert: 30,
    titleQuery: TITLE_2027,
  });

  console.log(JSON.stringify(result, null, 2));

  if (!process.env.FANTASTIC_JOBS_API_KEY?.trim()) {
    console.error("FANTASTIC_JOBS_API_KEY is not set in .env.local");
    process.exitCode = 1;
    return;
  }

  if (result.errors.length) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
