import type { Session } from "next-auth";

function normalizeEmailList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Emails that may access admin APIs and pages (merged OWNER + ADMIN lists). */
export function getAdminEmailSet(): Set<string> {
  const combined = [
    ...normalizeEmailList(process.env.OWNER_EMAILS),
    ...normalizeEmailList(process.env.ADMIN_EMAILS),
  ];
  return new Set(combined);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmailSet().has(email.trim().toLowerCase());
}

export function isAdminSession(session: Session | null): boolean {
  if (!session?.user) return false;
  if ((session as { adminCredential?: boolean }).adminCredential) return true;
  const email = session.user.email;
  return isAdminEmail(email);
}
