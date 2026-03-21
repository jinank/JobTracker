/**
 * Guess company domain from company name for use with Apollo.io and similar APIs.
 * This is a heuristic - results may need manual verification.
 */
export function companyNameToDomain(companyName: string): string {
  const cleaned = companyName
    .toLowerCase()
    .replace(/\s*(inc\.?|llc\.?|ltd\.?|corp\.?|co\.?|&|and)\s*/gi, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "")
    .trim();
  if (!cleaned) return "";
  return `${cleaned}.com`;
}
