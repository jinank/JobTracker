import type { Session } from "next-auth";
import { normalizeEmailForMatch } from "@/lib/emailMatch";

/** Product owner Gmail spellings — always admin and Premium. */
const COMPED_PREMIUM_EMAILS = [
  "jinankdthakker@gmail.com",
  "jinank.thakker@gmail.com",
].map(normalizeEmailForMatch);

function normalizeEmailList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => normalizeEmailForMatch(e))
    .filter(Boolean);
}

/** Emails that may access admin APIs and pages (merged OWNER + ADMIN lists). */
export function getAdminEmailSet(): Set<string> {
  const combined = [
    ...COMPED_PREMIUM_EMAILS,
    ...normalizeEmailList(process.env.OWNER_EMAILS),
    ...normalizeEmailList(process.env.ADMIN_EMAILS),
  ];
  return new Set(combined);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmailSet().has(normalizeEmailForMatch(email));
}

export function isAdminSession(session: Session | null): boolean {
  if (!session?.user) return false;
  if ((session as { adminCredential?: boolean }).adminCredential) return true;
  const email = session.user.email;
  return isAdminEmail(email);
}
