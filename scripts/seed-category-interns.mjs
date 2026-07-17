/**
 * Seed ~10–20 live US internships in Product / Design / Marketing / Operations / Data.
 * Pulls from Greenhouse boards in INTERNSHIP_SOURCE_SEED (no Fantastic quota needed).
 * Usage: npm run seed:category-interns
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
process.chdir(path.join(__dirname, ".."));

const TARGET_CATEGORIES = [
  "Design",
  "Product",
  "Marketing",
  "Operations",
  "Data & Analytics",
];

function isInternTitle(title) {
  return /\b(intern|internship|co-?op)\b/i.test(title);
}

function categorize(title) {
  const t = title.toLowerCase();
  if (/\b(ux|ui)\b|product designer|graphic design|design intern|designer intern/.test(t))
    return "Design";
  if (/product manager|product management|\bpm\b|apm\b|product intern/.test(t))
    return "Product";
  if (/marketing|growth|brand|content|communications|social media|campaign/.test(t))
    return "Marketing";
  if (
    /operations|strategy|finance|bizops|business ops|supply chain|accounting|people team|hr operations|public policy|sales project|network strategy/.test(
      t
    )
  ) {
    return "Operations";
  }
  if (/data sci|data analyst|analytics|data engineer|machine learning|\bml\b/.test(t))
    return "Data & Analytics";
  return null;
}

function isUsEnough(location, company) {
  const loc = (location || "").toLowerCase();
  if (!loc || loc === "in-office" || loc.includes("hybrid") || loc === "remote") return true;
  if (
    /italy|milan|london|sydney|singapore|dublin|brazil|são paulo|sao paulo|india|europe|uk\b|united kingdom|canada\b|mexico|germany|france|japan|china/i.test(
      loc
    ) &&
    !/united states|\busa\b|, [a-z]{2}, us|\bus\b/.test(loc)
  ) {
    return false;
  }
  return true;
}

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const { INTERNSHIP_SOURCE_SEED } = await import(
    pathToFileURL(path.join(process.cwd(), "lib/jobs/seedSources.ts")).href
  );
  const { CURATED_SOURCE } = await import(
    pathToFileURL(path.join(process.cwd(), "lib/jobs/curatedListings2027.ts")).href
  );

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const sb = createClient(url, key);

  const { data: sourceRow, error: sourceErr } = await sb
    .from("job_sources")
    .upsert(
      {
        company: CURATED_SOURCE.company,
        company_slug: CURATED_SOURCE.company_slug,
        ats: CURATED_SOURCE.ats,
        board_token: CURATED_SOURCE.board_token,
        careers_url: CURATED_SOURCE.careers_url,
        enabled: false,
        force_internship: true,
      },
      { onConflict: "ats,board_token" }
    )
    .select("id")
    .single();

  if (sourceErr || !sourceRow?.id) {
    console.error(sourceErr?.message || "No curated source");
    process.exit(1);
  }

  const greenhouse = INTERNSHIP_SOURCE_SEED.filter((s) => s.ats === "greenhouse");
  const candidates = [];
  const seenUrls = new Set();

  for (const board of greenhouse) {
    try {
      const res = await fetch(
        `https://boards-api.greenhouse.io/v1/boards/${board.board_token}/jobs?content=true`
      );
      if (!res.ok) continue;
      const payload = await res.json();
      for (const job of payload.jobs || []) {
        if (!isInternTitle(job.title)) continue;
        const category = categorize(job.title);
        if (!category) continue;
        const location = job.location?.name || "United States";
        if (!isUsEnough(location, board.company)) continue;
        const applyUrl = job.absolute_url;
        if (!applyUrl || seenUrls.has(applyUrl)) continue;
        seenUrls.add(applyUrl);
        candidates.push({
          company: board.company,
          title: job.title,
          applyUrl,
          location,
          externalId: `cat-gh-${board.board_token}-${job.id}`,
          category,
          postedAt: (job.updated_at || job.first_published || new Date().toISOString()).slice(
            0,
            10
          ),
          description:
            typeof job.content === "string"
              ? job.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1500)
              : `${board.company} is hiring a ${job.title}. Apply on the company career page.`,
        });
      }
    } catch {
      /* skip */
    }
  }

  // Also Lever
  for (const board of INTERNSHIP_SOURCE_SEED.filter((s) => s.ats === "lever")) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${board.board_token}?mode=json`);
      if (!res.ok) continue;
      const jobs = await res.json();
      for (const job of jobs || []) {
        const title = job.text || "";
        if (!isInternTitle(title)) continue;
        const category = categorize(title);
        if (!category) continue;
        const location = job.categories?.location || "United States";
        if (!isUsEnough(location, board.company)) continue;
        const applyUrl = job.hostedUrl || job.applyUrl;
        if (!applyUrl || seenUrls.has(applyUrl)) continue;
        seenUrls.add(applyUrl);
        candidates.push({
          company: board.company,
          title,
          applyUrl,
          location,
          externalId: `cat-lever-${board.board_token}-${job.id}`,
          category,
          postedAt: job.createdAt
            ? new Date(job.createdAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          description: (job.descriptionPlain || "").slice(0, 1500),
        });
      }
    } catch {
      /* skip */
    }
  }

  const byCat = new Map();
  const ranked = [...candidates].sort((a, b) => {
    const score = (x) =>
      (/2027/.test(x.title) ? 4 : 0) +
      (/2026/.test(x.title) ? 2 : 0) +
      (/summer|fall|spring|winter/i.test(x.title) ? 1 : 0);
    return score(b) - score(a);
  });

  const selected = [];
  for (const c of ranked) {
    const n = byCat.get(c.category) || 0;
    if (n >= 5) continue;
    byCat.set(c.category, n + 1);
    selected.push(c);
    if (selected.length >= 20) break;
  }

  console.log("Candidates", candidates.length, "selected", selected.length);
  for (const s of selected) {
    console.log(`${s.category} | ${s.company} | ${s.title}`);
  }

  const now = new Date().toISOString();
  let upserted = 0;
  const errors = [];

  for (const listing of selected) {
    const companySlug = listing.company
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const { error } = await sb.from("job_listings").upsert(
      {
        source_id: sourceRow.id,
        external_id: listing.externalId,
        company: listing.company,
        company_slug: companySlug,
        title: listing.title,
        location_raw: listing.location,
        city: null,
        state: null,
        country: "US",
        work_type: /remote/i.test(listing.location) ? "Remote" : "Hybrid",
        role_category: listing.category,
        employment_type: "Internship",
        experience_level: "Intern",
        apply_url: listing.applyUrl,
        description:
          listing.description ||
          `${listing.company} internship — apply on the company career site.`,
        posted_at: `${listing.postedAt}T12:00:00.000Z`,
        tags: [listing.category, "Internship", "category-topup"],
        is_active: true,
        updated_at: now,
      },
      { onConflict: "source_id,external_id" }
    );
    if (error) errors.push(`${listing.company}: ${error.message}`);
    else upserted++;
  }

  console.log(
    JSON.stringify({ upserted, errors, byCategory: Object.fromEntries(byCat) }, null, 2)
  );
  if (errors.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
