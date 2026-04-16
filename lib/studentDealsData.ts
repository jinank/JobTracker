import dealsA from "./student-deals/deals-a.json";
import dealsB from "./student-deals/deals-b.json";
import dealsC from "./student-deals/deals-c.json";

export type StudentDeal = {
  id: string;
  provider: string;
  badge: string;
  title: string;
  description: string;
  studentPrice: string;
  regularPrice?: string;
  categories: string[];
  url?: string;
};

const ORDER = [
  "Coding & Programming",
  "Building Apps & Websites",
  "Data & Analytics",
  "Writing & Research",
  "Online Courses & Learning",
  "Design & Presentations",
  "Study Tools & Exam Prep",
  "Collaboration & Teams",
  "Entertainment & Lifestyle",
] as const;

export const STUDENT_DEALS: StudentDeal[] = [
  ...(dealsA as StudentDeal[]),
  ...(dealsB as StudentDeal[]),
  ...(dealsC as StudentDeal[]),
];

export const STUDENT_DEAL_CATEGORY_OPTIONS: string[] = (() => {
  const set = new Set(STUDENT_DEALS.flatMap((d) => d.categories));
  const rest = [...set].filter((c) => !ORDER.includes(c as (typeof ORDER)[number]));
  rest.sort();
  return [...ORDER.filter((c) => set.has(c)), ...rest];
})();

export function dealExternalHref(deal: StudentDeal): string {
  if (deal.url?.startsWith("http")) return deal.url;
  const q = encodeURIComponent(`${deal.provider} ${deal.title} student discount`);
  return `https://duckduckgo.com/?q=${q}`;
}
