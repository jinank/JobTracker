export type InternshipLocationPage = {
  slug: string;
  path: string;
  title: string;
  heading: string;
  description: string;
  intro: string;
  keywords: string[];
  /** Substrings matched against listing location (any match counts). */
  locationMatchers: string[];
  relatedLinks: { href: string; label: string }[];
};

export const INTERNSHIP_LOCATION_PAGES: InternshipLocationPage[] = [
  {
    slug: "new-york-summer-2027-internships",
    path: "/new-york-summer-2027-internships",
    title: "New York Summer 2027 Internships",
    heading: "New York Summer 2027 Internships",
    description:
      "Looking for a New York summer 2027 internship? Browse current US opportunities in NYC and New York State from company career pages. Find your perfect internship.",
    intro:
      "Browse summer 2027 internships in New York City and across New York State — synced from company career pages, not crowded job boards. Apply directly and track every application in SuperInterns.",
    keywords: [
      "new york summer 2027 internships",
      "nyc summer 2027 internships",
      "summer 2027 internships new york",
      "2027 summer internships",
      "New York internships",
      "NYC internships",
      "student internships",
    ],
    locationMatchers: [
      "new york",
      ", ny",
      "manhattan",
      "brooklyn",
      "queens",
      "bronx",
      "staten island",
    ],
    relatedLinks: [
      { href: "/find-internships", label: "All Summer 2027 internships" },
      { href: "/blog/summer-2027-internships", label: "Summer 2027 internship timeline" },
      { href: "/blog/2027-summer-internships-practical-guide", label: "2027 summer internships guide" },
    ],
  },
];

export function getInternshipLocationPage(slug: string): InternshipLocationPage | undefined {
  return INTERNSHIP_LOCATION_PAGES.find((page) => page.slug === slug);
}

export function matchesInternshipLocation(
  locationRaw: string,
  matchers: string[]
): boolean {
  const loc = locationRaw.toLowerCase();
  return matchers.some((matcher) => loc.includes(matcher.toLowerCase()));
}
