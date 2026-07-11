import { YC_COMPANY_MATCHERS } from "@/lib/jobs/ycCompanies";

export type InternshipTopicPage = {
  slug: string;
  path: string;
  title: string;
  heading: string;
  description: string;
  intro: string;
  keywords: string[];
  footerLabel?: string;
  /** Substrings matched against company name / companySlug. */
  companyMatchers: string[];
  /** Eyebrow above the H1. */
  badgeLabel?: string;
  /** Optional phrase after the listing count, e.g. "at YC companies". */
  countPhrase: string;
  relatedLinks: { href: string; label: string }[];
};

export const YC_SUMMER_2027_INTERNSHIPS_PATH =
  "/y-combinator-summer-2027-internships";

export const YC_SUMMER_2027_INTERNSHIPS_PAGE: InternshipTopicPage = {
  slug: "y-combinator-summer-2027-internships",
  path: YC_SUMMER_2027_INTERNSHIPS_PATH,
  title: "Y Combinator Summer 2027 Internships",
  heading: "Internships at Y Combinator Companies, Summer 2027",
  description:
    "Looking for a summer 2027 internship at a Y Combinator company? Browse roles at YC startups like Stripe, Airbnb, DoorDash, and Ramp, synced from company career pages.",
  intro:
    "Browse summer 2027 internships at Y Combinator companies and alumni startups. Listings are synced from company career pages, not crowded job boards. Apply directly and track every application in SuperInterns.",
  keywords: [
    "y combinator summer 2027 internships",
    "yc summer 2027 internships",
    "internships at y combinator companies",
    "yc startup internships",
    "y combinator internships",
    "startup internships summer 2027",
    "stripe airbnb doordash internships",
    "student internships",
  ],
  footerLabel: "Y Combinator",
  badgeLabel: "Summer 2027 · Y Combinator companies",
  companyMatchers: YC_COMPANY_MATCHERS,
  countPhrase: "at YC companies",
  relatedLinks: [
    { href: "/find-internships", label: "All Summer 2027 internships" },
    {
      href: "/san-francisco-summer-2027-internships",
      label: "San Francisco Summer 2027 internships",
    },
    {
      href: "/california-summer-2027-internships",
      label: "California Summer 2027 internships",
    },
    {
      href: "/new-york-summer-2027-internships",
      label: "New York Summer 2027 internships",
    },
    {
      href: "/blog/summer-2027-internships",
      label: "Summer 2027 internship timeline",
    },
  ],
};

export const INTERNSHIP_TOPIC_PAGES: InternshipTopicPage[] = [
  YC_SUMMER_2027_INTERNSHIPS_PAGE,
];

export function getInternshipTopicPage(slug: string): InternshipTopicPage | undefined {
  return INTERNSHIP_TOPIC_PAGES.find((page) => page.slug === slug);
}
