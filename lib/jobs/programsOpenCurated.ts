import {
  SUMMER_2027_PROGRAMS_OPEN,
  type ProgramCompanySection,
} from "@/lib/blog/summer2027ProgramsOpen";
import type { CuratedListingSeed } from "@/lib/jobs/curatedListings2027";
import { inferWorkType } from "@/lib/jobs/inferRoleCategory";

const BLOG_PUBLISHED = "2026-06-20";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function stableExternalId(applyUrl: string, title: string): string {
  try {
    const pathname = new URL(applyUrl).pathname;
    const segments = pathname.split("/").filter(Boolean);
    const idSegment = segments.find(
      (part) =>
        /^\d{5,}$/.test(part) ||
        /^JR\d+/i.test(part) ||
        /^r-\d+/i.test(part) ||
        /^XMLNAME-/i.test(part)
    );
    if (idSegment) return `open-${slugify(idSegment).slice(0, 56)}`;
    const tail = segments[segments.length - 1];
    if (tail) return `open-${slugify(tail).slice(0, 56)}`;
  } catch {
    /* invalid url */
  }
  return `open-${slugify(title).slice(0, 40)}`;
}

function inferLocation(title: string, company: string): string {
  const t = `${title} ${company}`;
  if (/new york city|new york,?\s*ny|\bnyc\b/i.test(t)) return "New York, NY";
  if (/san francisco|california.*san francisco/i.test(t)) return "San Francisco, CA";
  if (/washington d\.?c\.?/i.test(t)) return "Washington, DC";
  if (/atlanta/i.test(t)) return "Atlanta, GA";
  if (/phoenix|tsmc arizona/i.test(t)) return "Phoenix, AZ";
  if (/wichita/i.test(t)) return "Wichita, KS";
  if (/bala cynwyd|philadelphia/i.test(t)) return "Bala Cynwyd, PA";
  if (/chicago/i.test(t)) return "Chicago, IL";
  if (/macquarie/i.test(company)) return "United States";
  return "United States";
}

function inferWorkTypeFromTitle(title: string, location: string): CuratedListingSeed["workType"] {
  if (/\bremote\b/i.test(title)) return "Remote";
  if (/\bhybrid\b/i.test(title)) return "Hybrid";
  return inferWorkType(location);
}

function sectionToSeeds(section: ProgramCompanySection): CuratedListingSeed[] {
  return section.roles.map((role) => {
    const location = inferLocation(role.title, section.company);
    return {
      externalId: stableExternalId(role.applyUrl, role.title),
      title: role.title,
      company: section.company,
      applyUrl: role.applyUrl,
      postedAt: BLOG_PUBLISHED,
      workType: inferWorkTypeFromTitle(role.title, location),
      location,
      season: "2027-Summer",
      description: `${section.company} is hiring for ${role.title}. Apply on the company's official careers site. Programs can close without notice, confirm the posting is still open before you apply.`,
    };
  });
}

/** Blog guide listings as portal-ready curated seeds (official apply URLs). */
export const PROGRAMS_OPEN_CURATED_SEEDS: CuratedListingSeed[] =
  SUMMER_2027_PROGRAMS_OPEN.flatMap(sectionToSeeds);

function normalizeCompanyKey(company: string): string {
  return company
    .toLowerCase()
    .replace(/\s+(industries|incorporated|inc|llc|corp|corporation)\.?$/i, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(internship|intern|program|summer|2027|2026)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function roleKey(listing: CuratedListingSeed): string {
  return `${normalizeCompanyKey(listing.company)}::${normalizeTitleKey(listing.title)}`;
}

export function mergeCuratedSeeds(
  primary: CuratedListingSeed[],
  extra: CuratedListingSeed[]
): CuratedListingSeed[] {
  const byRole = new Map<string, CuratedListingSeed>();

  for (const listing of primary) {
    byRole.set(roleKey(listing), listing);
  }
  for (const listing of extra) {
    // Official company apply links override aggregator duplicates.
    byRole.set(roleKey(listing), listing);
  }

  const seenApply = new Set<string>();
  const merged: CuratedListingSeed[] = [];
  for (const listing of byRole.values()) {
    if (seenApply.has(listing.applyUrl)) continue;
    seenApply.add(listing.applyUrl);
    merged.push(listing);
  }

  return merged;
}
