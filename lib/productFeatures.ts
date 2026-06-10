export type ProductFeature = {
  id: string;
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: "search" | "track" | "interview" | "mentors" | "resources";
};

/** Core product areas shown in the main nav pill. */
export const PRODUCT_FEATURES: ProductFeature[] = [
  {
    id: "find-jobs",
    href: "/find-jobs",
    label: "Find Internships",
    shortLabel: "Internships",
    description: "US internships pulled straight from company career pages.",
    icon: "search",
  },
  {
    id: "track-jobs",
    href: "/",
    label: "Track Applications",
    shortLabel: "Tracker",
    description: "Sync Gmail and watch every application move from applied to offer.",
    icon: "track",
  },
  {
    id: "interview-prep",
    href: "/practice-interviews",
    label: "Interview Prep",
    shortLabel: "Interviews",
    description: "AI mock interviews tailored to the company and role you want.",
    icon: "interview",
  },
  {
    id: "find-mentors",
    href: "/find-mentors",
    label: "Find Mentors",
    shortLabel: "Mentors",
    description: "Find mentors, recruiters, and hiring contacts at any company.",
    icon: "mentors",
  },
  {
    id: "resources",
    href: "/resources",
    label: "Student Resources",
    shortLabel: "Resources",
    description: "Free tools, student discounts, and job-search perks.",
    icon: "resources",
  },
];

export const PRODUCT_NAV_LINKS = PRODUCT_FEATURES.map((f) => ({
  href: f.href,
  label: f.shortLabel,
}));
