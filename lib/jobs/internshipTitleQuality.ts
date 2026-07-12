/** Titles we do not want in the student tech/business internship feed. */
const EXCLUDED_TITLE_RE =
  /\b(pharmacy|pharmacist|clinical student|speech language|\bslp\b|pathologist|nursing|nurse|medical assistant|dental|physician|therapist|occupational therapy|physical therapy|social work|counseling|teacher|teaching|call center|gateway|veterinary|dietitian|radiology|ultrasound|phlebotom|hospitalist|caregiver|home health|behavioral health|mental health counselor)\b/i;

/** Companies / talent-pool spam that should not surface on the homepage feed. */
const EXCLUDED_COMPANY_RE =
  /^(unknown company|join our talent community)$/i;

export function isGenericInternTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  if (/^intern$/i.test(t)) return true;
  if (/^intern,?\s*$/i.test(t)) return true;
  return false;
}

export function shouldExcludeInternshipTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  if (isGenericInternTitle(t)) return true;
  return EXCLUDED_TITLE_RE.test(t);
}

export function shouldExcludeInternshipListing(company: string, title: string): boolean {
  if (EXCLUDED_COMPANY_RE.test(company.trim())) return true;
  return shouldExcludeInternshipTitle(title);
}
