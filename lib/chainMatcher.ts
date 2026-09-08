import type { ChainStatus } from "@/types/chain";
import { STATUS_ORDER } from "@/types/chain";
import { levenshtein, normalizeDomain, domainToCompanyName } from "@/lib/utils";
import { isGenericRole } from "@/lib/uniqueApplications";

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

/**
 * Max allowed Levenshtein distance for company names to count as "same company".
 * Short names (≤5 chars) use threshold 1 so "Tubi" and "Turo" are not merged (dist 2),
 * while normal typos like "Googel" vs "Google" still match on longer names.
 */
function companyLevenshteinThreshold(lenA: number, lenB: number): number {
  const short = Math.min(lenA, lenB);
  if (short <= 5) return 1;
  return Math.max(2, Math.floor(short * 0.2));
}

function pickBestCompanyMatch(chains: ChainRow[]): ChainRow {
  return [...chains].sort((a, b) => {
    const aGeneric = isGenericRole(a.role_title) ? 1 : 0;
    const bGeneric = isGenericRole(b.role_title) ? 1 : 0;
    if (aGeneric !== bGeneric) return aGeneric - bGeneric;
    return b.last_event_at - a.last_event_at;
  })[0];
}

export function findBestMatch(
  chains: ChainRow[],
  company: string,
  role: string
): ChainRow | null {
  if (!company) return null;
  const companyNorm = company.toLowerCase();
  const roleNorm = role.toLowerCase();
  const roleIsGeneric = isGenericRole(role);

  const companyMatches: ChainRow[] = [];

  for (const chain of chains) {
    const chainCompany = chain.canonical_company.toLowerCase();
    const companyDist = levenshtein(companyNorm, chainCompany);
    const companyThreshold = companyLevenshteinThreshold(
      companyNorm.length,
      chainCompany.length
    );
    if (companyDist <= companyThreshold) {
      companyMatches.push(chain);
    }
  }

  if (companyMatches.length === 0) return null;

  // Generic / empty incoming role → attach to best company chain (often EOI).
  if (roleIsGeneric || !role) {
    return pickBestCompanyMatch(companyMatches);
  }

  // Specific role → only match a similar specific role. Do NOT collapse a new
  // titled application into an existing "Expression of interest" chain.
  for (const chain of companyMatches) {
    const chainRole = (chain.role_title || "").toLowerCase();
    if (isGenericRole(chain.role_title) || !chainRole) continue;

    const roleDist = levenshtein(roleNorm, chainRole);
    const roleThreshold = Math.max(3, Math.floor(roleNorm.length * 0.3));
    if (roleDist <= roleThreshold) {
      return chain;
    }
  }

  return null;
}
