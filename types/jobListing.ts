export type WorkType = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Internship" | "Contract";
export type ExperienceLevel = "Intern" | "Entry" | "Mid" | "Senior";

/** API / UI shape for internship listings */
export type JobListing = {
  id: string;
  company: string;
  companySlug: string;
  title: string;
  location: string;
  roleCategory: string;
  postedDaysAgo: number;
  workType: WorkType;
  applyUrl: string;
  description: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange?: string;
  tags: string[];
};

export type JobSourceRow = {
  id: string;
  company: string;
  company_slug: string;
  ats: "greenhouse" | "lever" | "ashby" | "fantastic";
  board_token: string;
  careers_url: string;
  enabled: boolean;
  force_internship: boolean;
  last_synced_at: string | null;
};

export type JobListingRow = {
  id: string;
  source_id: string;
  external_id: string;
  company: string;
  company_slug: string;
  title: string;
  location_raw: string;
  city: string | null;
  state: string | null;
  country: string;
  work_type: WorkType;
  role_category: string;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  apply_url: string;
  description: string;
  posted_at: string | null;
  tags: string[] | null;
  is_active: boolean;
};
