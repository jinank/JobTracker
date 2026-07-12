import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
for (const line of fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq <= 0) continue;
  const k = t.slice(0, eq).trim();
  let v = t.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  if (!process.env[k]) process.env[k] = v;
}

process.chdir(path.join(__dirname, ".."));

const { createClient } = await import("@supabase/supabase-js");
const sb = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: fj } = await sb
  .from("job_listings")
  .select("company,title,country,employment_type,is_active,updated_at,posted_at,tags")
  .contains("tags", ["Fantastic.jobs"])
  .order("updated_at", { ascending: false })
  .limit(3);

console.log("Sample Fantastic rows:");
console.log(JSON.stringify(fj, null, 2));

const { data, error } = await sb
  .from("job_listings")
  .select("company,title,updated_at,country,employment_type,is_active")
  .eq("country", "US")
  .eq("employment_type", "Internship")
  .eq("is_active", true)
  .order("updated_at", { ascending: false, nullsFirst: false })
  .range(0, 9);

console.log("\nSame filters as queryInternships top 10:");
if (error) console.error(error);
for (const r of data || []) {
  console.log(String(r.updated_at).slice(0, 19), r.company, String(r.title).slice(0, 40));
}

const { queryInternships } = await import(
  pathToFileURL(path.join(__dirname, "..", "lib/jobs/queryInternships.ts")).href
);

const r = await queryInternships({
  search: "",
  roleCategory: "All roles",
  workType: "all",
  experienceLevel: "all",
  postedPreset: "all",
  locationQuery: "",
  sortField: "updated",
  sortDir: "asc",
  limit: 10,
});

console.log("\nqueryInternships result:");
console.log("lastSynced", r.stats.lastSyncedAt, "total", r.total, "active", r.stats.totalActive);
for (const j of r.jobs) {
  console.log(`${j.updatedDaysAgo}d | ${j.company} | ${j.title.slice(0, 45)}`);
}
