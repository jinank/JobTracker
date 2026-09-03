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

async function main() {
  const { supabase } = await import("../lib/supabase");
  const { data, error } = await supabase
    .from("job_listings")
    .select("company, title, is_active, country, employment_type")
    .eq("country", "US")
    .eq("employment_type", "Internship")
    .eq("is_active", true)
    .order("posted_at", { ascending: false, nullsFirst: false });

  console.log("error", error?.message);
  console.log("filtered active rows", data?.length ?? 0);

  for (const name of ["Amazon", "Goldman Sachs", "Google", "JPMorgan Chase"]) {
    const count = data?.filter((r) => r.company === name).length ?? 0;
    console.log(`${name}: ${count}`);
  }

  const { data: sources } = await supabase.from("job_sources").select("id, company, board_token");
  console.log("sources", sources?.length);

  const { queryInternships } = await import("../lib/jobs/queryInternships");
  const result = await queryInternships({
    search: "",
    roleCategory: "All roles",
    workType: "all",
    experienceLevel: "all",
    postedPreset: "all",
    locationQuery: "",
    sortField: "posted",
    sortDir: "asc",
    pageSize: 200,
  });
  console.log("queryInternships stats", result.stats.totalActive, "total", result.total);
  console.log("amazon via query", result.jobs.filter((j) => j.company === "Amazon").length);
}

main();
