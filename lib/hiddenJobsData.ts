/**
 * @deprecated Runtime job catalog moved to Supabase `job_listings` via /api/internships.
 * This module keeps shared filter constants and legacy types for backward compatibility.
 */
import {
  ROLE_CATEGORIES,
  WORK_TYPES,
} from "@/lib/jobs/constants";

export type HiddenJob = {
  id: string;
  company: string;
  companySlug: string;
  title: string;
  location: string;
  roleCategory: string;
  postedDaysAgo: number;
  workType: "Remote" | "Hybrid" | "On-site";
  applyUrl: string;
  description: string;
  employmentType: "Full-time" | "Internship" | "Contract";
  experienceLevel: "Intern" | "Entry" | "Mid" | "Senior";
  salaryRange?: string;
  tags: string[];
};

export { ROLE_CATEGORIES, WORK_TYPES };

export const EMPLOYMENT_TYPES = ["Full-time", "Internship", "Contract"] as const;
export const EXPERIENCE_LEVELS = ["Intern", "Entry", "Mid", "Senior"] as const;

/** @deprecated Use /api/internships — returns empty array */
export const HIDDEN_JOBS_PREVIEW: HiddenJob[] = [];

/** @deprecated Stats come from /api/internships `stats` */
export const HIDDEN_JOBS_STATS = {
  searchersLabel: "Students",
  jobsLabel: "0",
  jobsSubtext: "US internships on company career pages",
};

/** @deprecated */
export const HIDDEN_JOBS_ROLE_COUNTS = ROLE_CATEGORIES.slice(1).map((role) => ({
  role,
  count: 0,
}));
