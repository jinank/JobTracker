import type { ChainStatus } from "@/types/chain";
import { STATUS_ORDER } from "@/types/chain";
import { levenshtein, normalizeDomain, domainToCompanyName } from "@/lib/utils";

export interface ChainRow {
  chain_id: string;
  canonical_company: string;
  role_title: string;
  status: ChainStatus;
  last_event_at: number;
  confidence: number;
}

export function eventTypeToStatus(eventType: string): ChainStatus {
  const map: Record<string, ChainStatus> = {
    APPLICATION_RECEIVED: "APPLIED",
    FOLLOW_UP: "APPLIED",
    ASSESSMENT_INVITE: "ASSESSMENT",
    INTERVIEW_INVITE: "INTERVIEWING",
    OFFER: "OFFER",
    REJECTION: "REJECTED",
    DEADLINE: "APPLIED",
    OTHER: "APPLIED",
  };
  return map[eventType] ?? "APPLIED";
}

export function advanceStatus(
  current: ChainStatus,
  next: ChainStatus
): ChainStatus {
  if (current === "REJECTED" || current === "WITHDRAWN") return current;
  const currentIdx = STATUS_ORDER.indexOf(current);
  const nextIdx = STATUS_ORDER.indexOf(next);
  return nextIdx > currentIdx ? next : current;
}

export function normalizeCompanyName(name: string): string {
  return name
    .replace(/\b(inc\.?|llc\.?|ltd\.?|corp\.?|co\.?)\b/gi, "")
    .replace(/[.,]$/g, "")
    .trim();
}

export function normalizeRoleTitle(role: string): string {
  return role
    .replace(
      /\b(senior|sr\.?|junior|jr\.?|lead|principal|staff)\b/gi,
      (m) => m.trim()
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveCompanyName(
  companyRaw: string | undefined,
  fromDomain: string
): string {
  return normalizeCompanyName(
    companyRaw ?? domainToCompanyName(normalizeDomain(fromDomain))
  );
}

export function findBestMatch(
  chains: ChainRow[],
  company: string,
  role: string
): ChainRow | null {
  if (!company) return null;
  const companyNorm = company.toLowerCase();
  const roleNorm = role.toLowerCase();

  for (const chain of chains) {
    const chainCompany = chain.canonical_company.toLowerCase();
    const chainRole = chain.role_title.toLowerCase();

    const companyDist = levenshtein(companyNorm, chainCompany);
    const companyThreshold = Math.max(2, Math.floor(companyNorm.length * 0.2));
    if (companyDist > companyThreshold) continue;

    if (role && chainRole) {
      const roleDist = levenshtein(roleNorm, chainRole);
      const roleThreshold = Math.max(3, Math.floor(roleNorm.length * 0.3));
      if (roleDist > roleThreshold) continue;
    }

    return chain;
  }

  return null;
}
