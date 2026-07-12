import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq <= 0) continue;
  const k = t.slice(0, eq).trim();
  let v = t.slice(eq + 1).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  if (!process.env[k]) process.env[k] = v;
}

const { createClient } = await import("@supabase/supabase-js");
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("missing supabase env");
  process.exit(1);
}
const sb = createClient(url, key);

const { data: recent, error } = await sb
  .from("job_listings")
  .select("company,title,updated_at,posted_at,tags,country")
  .eq("is_active", true)
  .eq("country", "US")
  .eq("employment_type", "Internship")
  .order("updated_at", { ascending: false })
  .limit(20);

if (error) {
  console.error(error);
  process.exit(1);
}

console.log("TOP BY updated_at:");
for (const r of recent || []) {
  const fj = Array.isArray(r.tags) && r.tags.includes("Fantastic.jobs") ? "FJ" : "";
  console.log(
    `${String(r.updated_at).slice(0, 19)} | ${r.company} | ${String(r.title).slice(0, 55)} | ${fj}`
  );
}

const since = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
const { count } = await sb
  .from("job_listings")
  .select("*", { count: "exact", head: true })
  .eq("is_active", true)
  .eq("country", "US")
  .eq("employment_type", "Internship")
  .gte("updated_at", since);

console.log("Active US internships updated in last 6h:", count);

const { data: src } = await sb
  .from("job_sources")
  .select("company,ats,last_synced_at")
  .eq("ats", "fantastic")
  .maybeSingle();
console.log("Fantastic source:", src);
