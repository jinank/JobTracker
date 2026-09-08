/** Lowercase, trim, and treat Gmail dots / googlemail as the same mailbox. */
export function normalizeEmailForMatch(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) return trimmed;
  let local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.split("+")[0].replace(/\./g, "");
    return `${local}@gmail.com`;
  }
  return trimmed;
}

export function emailsMatch(a: string, b: string): boolean {
  return normalizeEmailForMatch(a) === normalizeEmailForMatch(b);
}
