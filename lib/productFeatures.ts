export type ProductFeature = {
  id: string;
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: "search" | "track" | "interview" | "resources";
};

/** Core product areas shown in the main nav pill. */
export const PRODUCT_FEATURES: ProductFeature[] = [
  {
    id: "find-jobs",
    href: "/find-jobs",
    label: "Hidden Job Search",
    shortLabel: "Find Jobs",
    description: "Roles posted on company sites, not buried on crowded job boards.",
    icon: "search",
  },
  {
    id: "track-jobs",
    href: "/",
    label: "Track Jobs",
    shortLabel: "Track Jobs",
    description: "Sync Gmail and build a live pipeline from applied to offer.",
    icon: "track",
  },
  {
    id: "interview-prep",
    href: "/practice-interviews",
    label: "Interview Prep",
    shortLabel: "Interview Prep",
    description: "AI mock interviews tailored to company and role.",
    icon: "interview",
  },
  {
    id: "resources",
    href: "/resources",
    label: "Resources",
    shortLabel: "Resources",
    description: "Student discounts, tools, and job-search perks.",
    icon: "resources",
  },
];

export const PRODUCT_NAV_LINKS = PRODUCT_FEATURES.map((f) => ({
  href: f.href,
  label: f.shortLabel,
}));
