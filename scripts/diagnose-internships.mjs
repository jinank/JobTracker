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

const { createClient } = await import("@supabase/supabase-js");
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, key);

const { count, error: countErr } = await sb
  .from("job_listings")
  .select("*", { count: "exact", head: true })
  .eq("is_active", true)
  .eq("country", "US");

if (countErr) {
  console.error("DB error:", countErr.message);
  process.exit(1);
}

console.log("Active US listings in DB:", count);

const { data: lastRun } = await sb
  .from("job_sync_runs")
  .select("*")
  .order("started_at", { ascending: false })
  .limit(1)
  .maybeSingle();

console.log("Last sync run:", lastRun ? {
  finished_at: lastRun.finished_at,
  upserted: lastRun.upserted,
  us_kept: lastRun.us_kept,
  errors: lastRun.errors,
} : "none");
