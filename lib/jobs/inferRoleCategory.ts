import type { JobListing } from "@/types/jobListing";
import { shouldExcludeInternshipTitle } from "@/lib/jobs/internshipTitleQuality";

export function inferRoleCategory(title: string): JobListing["roleCategory"] {
  const t = title.toLowerCase();

  if (shouldExcludeInternshipTitle(title)) return "Other";

  if (/\b(design|ux|ui)\b|product designer|graphic design/i.test(t)) return "Design";
  if (/product manager|product management|\bpm\b|apm\b|product intern/i.test(t)) return "Product";
  if (
    /data sci|machine learning|\bml\b|analytics engineer|data engineer|data analyst/i.test(
      t
    )
  ) {
    return "Data & Analytics";
  }
  if (/marketing|growth|brand|content|communications intern|social media/i.test(t)) {
    return "Marketing";
  }
  if (
    /operations|bizops|strategy|finance|accounting|investment banking|capital markets|audit\b|assurance\b|commercial real estate|tax intern|people team|hr operations|public policy|network strategy|sales project/i.test(
      t
    )
  ) {
    return "Operations";
  }
  if (
    /engineer|software|developer|programmer|devops|\bsre\b|frontend|backend|full.?stack|automation|qa engineer|test engineer|computer vision|applied science/i.test(
      t
    )
  ) {
    return "Software Engineering";
  }
  if (/\banalyst\b/i.test(t)) return "Data & Analytics";

  return "Other";
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
