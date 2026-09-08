import type { GreenhouseJob } from "@/lib/jobs/fetchers/greenhouse";

const VAGUE_LOCATION_RE =
  /^(in-?office|hybrid|remote|onsite|on-site|office|multiple locations?)$/i;

/** Prefer office / metadata when Greenhouse only returns "Hybrid" or "In-Office". */
export function resolveGreenhouseLocation(job: GreenhouseJob): string {
  const name = job.location?.name?.trim() || "";

  if (name && !VAGUE_LOCATION_RE.test(name)) {
    return name;
  }

  const officeParts = (job.offices ?? [])
    .map((o) => o.location?.trim() || o.name?.trim())
    .filter(Boolean);
  if (officeParts.length) {
    return officeParts.join("; ");
  }

  for (const m of job.metadata ?? []) {
    if (!/job posting location|office location/i.test(m.name ?? "")) continue;
    const val = m.value;
    if (Array.isArray(val) && val.length) {
      return val.map(String).join("; ");
    }
    if (typeof val === "string" && val.trim()) {
      return val.trim();
    }
  }

  return name || "United States";
}
