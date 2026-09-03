/**
 * Upsert curated internship job_sources into Supabase.
 * Usage: npm run seed:internships
 */
import fs from "fs";
import path from "path";
import { seedJobSources } from "../lib/jobs/syncInternships";

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

async function main() {
  const count = await seedJobSources();
  console.log(`Seeded ${count} job sources from lib/jobs/seedSources.ts`);
  console.log("Run: npm run sync:internships");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
