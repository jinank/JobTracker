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

export const WORK_TYPES = ["Remote", "Hybrid", "On-site"] as const;

export const EMPLOYMENT_TYPES = ["Full-time", "Internship", "Contract"] as const;

export const EXPERIENCE_LEVELS = ["Intern", "Entry", "Mid", "Senior"] as const;

export const ROLE_CATEGORIES = [
  "All roles",
  "Software Engineering",
  "Data & Analytics",
  "Product",
  "Design",
  "Marketing",
  "Operations",
] as const;

function inferEmployment(title: string): HiddenJob["employmentType"] {
  if (/intern/i.test(title)) return "Internship";
  if (/contract|contractor/i.test(title)) return "Contract";
  return "Full-time";
}

function inferLevel(title: string): HiddenJob["experienceLevel"] {
  if (/intern/i.test(title)) return "Intern";
  if (/associate|analyst|junior|entry/i.test(title)) return "Entry";
  if (/senior|staff|principal|lead|manager|director/i.test(title)) return "Senior";
  return "Mid";
}

function inferSalary(
  roleCategory: string,
  level: HiddenJob["experienceLevel"]
): string | undefined {
  if (level === "Intern") return "$25–45/hr est.";
  if (roleCategory === "Software Engineering" && level === "Senior") {
    return "$180k–$260k + equity est.";
  }
  if (roleCategory === "Software Engineering") return "$120k–$190k + equity est.";
  if (roleCategory === "Product") return "$110k–$165k est.";
  if (roleCategory === "Design") return "$95k–$150k est.";
  if (roleCategory === "Data & Analytics") return "$100k–$155k est.";
  if (roleCategory === "Marketing") return "$75k–$120k est.";
  if (roleCategory === "Operations") return "$70k–$110k est.";
  return undefined;
}

function buildDescription(job: {
  company: string;
  title: string;
  location: string;
  workType: HiddenJob["workType"];
  roleCategory: string;
}): string {
  return `${job.company} is hiring a ${job.title} (${job.roleCategory}) based in ${job.location}. This listing is sourced from the company career page, not a job board, so you apply directly to the employer. Work arrangement: ${job.workType}.`;
}

function enrich(
  job: Omit<
    HiddenJob,
    "description" | "employmentType" | "experienceLevel" | "salaryRange" | "tags"
  >
): HiddenJob {
  const employmentType = inferEmployment(job.title);
  const experienceLevel = inferLevel(job.title);
  const tags = [
    job.roleCategory,
    job.workType,
    employmentType,
    experienceLevel,
    "Company site",
  ];
  return {
    ...job,
    description: buildDescription(job),
    employmentType,
    experienceLevel,
    salaryRange: inferSalary(job.roleCategory, experienceLevel),
    tags,
  };
}

const HIDDEN_JOBS_RAW: Omit<
  HiddenJob,
  "description" | "employmentType" | "experienceLevel" | "salaryRange" | "tags"
>[] = [
  {
    id: "stripe-swe-intern",
    company: "Stripe",
    companySlug: "stripe",
    title: "Software Engineer Intern",
    location: "San Francisco, CA",
    roleCategory: "Software Engineering",
    postedDaysAgo: 1,
    workType: "Hybrid",
    applyUrl: "https://stripe.com/jobs",
  },
  {
    id: "notion-pm",
    company: "Notion",
    companySlug: "notion",
    title: "Associate Product Manager",
    location: "New York, NY",
    roleCategory: "Product",
    postedDaysAgo: 2,
    workType: "Hybrid",
    applyUrl: "https://www.notion.so/careers",
  },
  {
    id: "figma-design",
    company: "Figma",
    companySlug: "figma",
    title: "Product Designer, Growth",
    location: "Remote (US)",
    roleCategory: "Design",
    postedDaysAgo: 3,
    workType: "Remote",
    applyUrl: "https://www.figma.com/careers",
  },
  {
    id: "datadog-swe",
    company: "Datadog",
    companySlug: "datadog",
    title: "Software Engineer, Platform",
    location: "Boston, MA",
    roleCategory: "Software Engineering",
    postedDaysAgo: 1,
    workType: "Hybrid",
    applyUrl: "https://www.datadoghq.com/careers",
  },
  {
    id: "shopify-data",
    company: "Shopify",
    companySlug: "shopify",
    title: "Data Analyst, Merchant Success",
    location: "Remote (Canada)",
    roleCategory: "Data & Analytics",
    postedDaysAgo: 4,
    workType: "Remote",
    applyUrl: "https://www.shopify.com/careers",
  },
  {
    id: "airbnb-swe",
    company: "Airbnb",
    companySlug: "airbnb",
    title: "Frontend Engineer, Host",
    location: "San Francisco, CA",
    roleCategory: "Software Engineering",
    postedDaysAgo: 5,
    workType: "Hybrid",
    applyUrl: "https://careers.airbnb.com",
  },
  {
    id: "hubspot-marketing",
    company: "HubSpot",
    companySlug: "hubspot",
    title: "Growth Marketing Associate",
    location: "Cambridge, MA",
    roleCategory: "Marketing",
    postedDaysAgo: 2,
    workType: "Hybrid",
    applyUrl: "https://www.hubspot.com/careers",
  },
  {
    id: "coinbase-swe",
    company: "Coinbase",
    companySlug: "coinbase",
    title: "Backend Engineer, Institutional",
    location: "Remote (US)",
    roleCategory: "Software Engineering",
    postedDaysAgo: 1,
    workType: "Remote",
    applyUrl: "https://www.coinbase.com/careers",
  },
  {
    id: "spotify-pm",
    company: "Spotify",
    companySlug: "spotify",
    title: "Product Manager, Personalization",
    location: "New York, NY",
    roleCategory: "Product",
    postedDaysAgo: 6,
    workType: "Hybrid",
    applyUrl: "https://www.lifeatspotify.com",
  },
  {
    id: "snowflake-da",
    company: "Snowflake",
    companySlug: "snowflake",
    title: "Data Analyst, GTM",
    location: "Remote (US)",
    roleCategory: "Data & Analytics",
    postedDaysAgo: 3,
    workType: "Remote",
    applyUrl: "https://careers.snowflake.com",
  },
  {
    id: "canva-design",
    company: "Canva",
    companySlug: "canva",
    title: "Product Designer",
    location: "Sydney / Remote",
    roleCategory: "Design",
    postedDaysAgo: 4,
    workType: "Remote",
    applyUrl: "https://www.canva.com/careers",
  },
  {
    id: "vercel-swe",
    company: "Vercel",
    companySlug: "vercel",
    title: "Software Engineer, Developer Experience",
    location: "Remote (US)",
    roleCategory: "Software Engineering",
    postedDaysAgo: 2,
    workType: "Remote",
    applyUrl: "https://vercel.com/careers",
  },
  {
    id: "linear-swe",
    company: "Linear",
    companySlug: "linear",
    title: "Full Stack Engineer",
    location: "Remote (EU/US)",
    roleCategory: "Software Engineering",
    postedDaysAgo: 1,
    workType: "Remote",
    applyUrl: "https://linear.app/careers",
  },
  {
    id: "ramp-ops",
    company: "Ramp",
    companySlug: "ramp",
    title: "Business Operations Associate",
    location: "New York, NY",
    roleCategory: "Operations",
    postedDaysAgo: 5,
    workType: "On-site",
    applyUrl: "https://ramp.com/careers",
  },
  {
    id: "anthropic-swe",
    company: "Anthropic",
    companySlug: "anthropic",
    title: "Research Engineer, Safety",
    location: "San Francisco, CA",
    roleCategory: "Software Engineering",
    postedDaysAgo: 2,
    workType: "Hybrid",
    applyUrl: "https://www.anthropic.com/careers",
  },
  {
    id: "plaid-da",
    company: "Plaid",
    companySlug: "plaid",
    title: "Data Scientist, Risk",
    location: "San Francisco, CA",
    roleCategory: "Data & Analytics",
    postedDaysAgo: 7,
    workType: "Hybrid",
    applyUrl: "https://plaid.com/careers",
  },
  {
    id: "discord-pm",
    company: "Discord",
    companySlug: "discord",
    title: "Product Manager, Communities",
    location: "San Francisco, CA",
    roleCategory: "Product",
    postedDaysAgo: 3,
    workType: "Remote",
    applyUrl: "https://discord.com/careers",
  },
  {
    id: "brex-marketing",
    company: "Brex",
    companySlug: "brex",
    title: "Product Marketing Manager",
    location: "Remote (US)",
    roleCategory: "Marketing",
    postedDaysAgo: 4,
    workType: "Remote",
    applyUrl: "https://www.brex.com/careers",
  },
];

export const HIDDEN_JOBS_PREVIEW: HiddenJob[] = HIDDEN_JOBS_RAW.map(enrich);

export const HIDDEN_JOBS_STATS = {
  searchersLabel: "3,800+",
  jobsLabel: "12,000+",
  jobsSubtext: "roles found on company career pages",
};

export const HIDDEN_JOBS_ROLE_COUNTS = ROLE_CATEGORIES.slice(1).map((role) => ({
  role,
  count: HIDDEN_JOBS_PREVIEW.filter((j) => j.roleCategory === role).length,
}));
