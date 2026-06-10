import type { JobListing } from "@/types/jobListing";

export function inferRoleCategory(title: string): JobListing["roleCategory"] {
  const t = title.toLowerCase();
  if (/design|ux|ui|product designer/i.test(t)) return "Design";
  if (/product manager|product management|\bpm\b/i.test(t)) return "Product";
  if (/data|analyst|analytics|science|ml|machine learning/i.test(t)) return "Data & Analytics";
  if (/marketing|growth|brand|content/i.test(t)) return "Marketing";
  if (/operations|bizops|strategy|finance|accounting/i.test(t)) return "Operations";
  return "Software Engineering";
}

export function inferWorkType(locationRaw: string): JobListing["workType"] {
  const loc = locationRaw.toLowerCase();
  if (/\bremote\b/i.test(loc) && !/\bhybrid\b/i.test(loc)) return "Remote";
  if (/\bhybrid\b/i.test(loc)) return "Hybrid";
  return "On-site";
}

export function internSalaryRange(): string {
  return "$20–45/hr est.";
}
