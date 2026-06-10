import { US_STATE_ABBREVS } from "@/lib/jobs/constants";

const INTERNSHIP_TITLE_RE =
  /\b(intern(ship)?|co-?op|summer\s+(analyst|associate|intern)|new\s+grad\s+intern)/i;

const NON_US_MARKERS = [
  /\bcanada\b/i,
  /\buk\b/i,
  /\bunited kingdom\b/i,
  /\beu\b/i,
  /\beurope\b/i,
  /\baustralia\b/i,
  /\bsydney\b/i,
  /\blondon\b/i,
  /\bberlin\b/i,
  /\bparis\b/i,
  /\btoronto\b/i,
  /\bvancouver\b/i,
  /\bmontreal\b/i,
  /\bindia\b/i,
  /\bsingapore\b/i,
];

const US_MARKERS = [
  /\bunited states\b/i,
  /\bu\.?s\.?a?\.?\b/i,
  /\bus\b/i,
  /\bremote\s*\(\s*us\s*\)/i,
  /\bremote\s*[-–]\s*us\b/i,
  /\bnorth america\b/i,
];

export function isInternshipTitle(title: string, forceInternship = false): boolean {
  if (forceInternship) return true;
  return INTERNSHIP_TITLE_RE.test(title);
}

export function parseUsLocation(locationRaw: string): {
  country: string | null;
  city: string | null;
  state: string | null;
} {
  const loc = locationRaw.trim();
  if (!loc) return { country: null, city: null, state: null };

  for (const re of NON_US_MARKERS) {
    if (re.test(loc) && !US_MARKERS.some((u) => u.test(loc))) {
      return { country: null, city: null, state: null };
    }
  }

  if (US_MARKERS.some((u) => u.test(loc))) {
    return { country: "US", city: null, state: null };
  }

  const stateMatch = loc.match(/,\s*([A-Z]{2})\b/);
  if (stateMatch && US_STATE_ABBREVS.has(stateMatch[1])) {
    const city = loc.split(",")[0]?.trim() || null;
    return { country: "US", city, state: stateMatch[1] };
  }

  const parenState = loc.match(/\(([A-Z]{2})\)/);
  if (parenState && US_STATE_ABBREVS.has(parenState[1])) {
    return { country: "US", city: loc.split("(")[0]?.trim() || null, state: parenState[1] };
  }

  if (/\bremote\b/i.test(loc) && !NON_US_MARKERS.some((re) => re.test(loc))) {
    return { country: "US", city: null, state: null };
  }

  const usCities = [
    "San Francisco", "New York", "Seattle", "Boston", "Austin", "Chicago",
    "Los Angeles", "Denver", "Atlanta", "Miami", "Portland", "San Diego",
    "San Jose", "Palo Alto", "Mountain View", "Menlo Park", "Cambridge",
    "Washington", "Arlington", "Dallas", "Houston", "Philadelphia",
  ];
  for (const city of usCities) {
    if (loc.toLowerCase().includes(city.toLowerCase())) {
      return { country: "US", city, state: null };
    }
  }

  return { country: null, city: null, state: null };
}

export function isUsInternship(
  title: string,
  locationRaw: string,
  opts?: { forceInternship?: boolean }
): boolean {
  if (!isInternshipTitle(title, opts?.forceInternship)) return false;
  const { country } = parseUsLocation(locationRaw);
  return country === "US";
}
