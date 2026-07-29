import { isInternshipTitle } from "@/lib/jobs/isUsInternship";
import { isGenericRole } from "@/lib/uniqueApplications";

/** Clear full-time / senior titles that should not enter the internship tracker. */
const SENIOR_FT_RE =
  /\b(principal|staff|senior|sr\.?|director|manager|founding|vp\b|vice president|head of|chief)\b/i;

const INTERNSHIP_CONTEXT_RE =
  /\b(intern(ship)?|co-?op|summer\s*202[6-8]|new\s*grad)\b/i;

/**
 * Whether a classified email should create a new application chain in the
 * Summer internship tracker. Existing chains still receive updates either way.
 */
export function isInternshipTrackerApplication(input: {
  roleTitle: string;
  subject?: string;
  snippet?: string;
  evidence?: string;
}): boolean {
  const role = (input.roleTitle ?? "").trim();
  const haystack = [role, input.subject, input.snippet, input.evidence]
    .filter(Boolean)
    .join(" ");

  if (isInternshipTitle(role) || isInternshipTitle(haystack)) return true;
  if (INTERNSHIP_CONTEXT_RE.test(haystack)) return true;

  if (role && SENIOR_FT_RE.test(role) && !isInternshipTitle(role)) {
    return false;
  }

  if (!role || isGenericRole(role)) {
    return INTERNSHIP_CONTEXT_RE.test(haystack);
  }

  return false;
}
