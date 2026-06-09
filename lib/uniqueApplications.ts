import type { Chain, ChainStatus } from "@/types/chain";
import { STATUS_ORDER } from "@/types/chain";
import { normalizeRoleTitle, type ChainRow } from "@/lib/chainMatcher";

const GENERIC_ROLE_RE =
  /^(expression of interest|talent community(\s*\/\s*future opportunities)?|future opportunities|unknown role|unknown|reach out)$/i;

export function isGenericRole(role: string | undefined | null): boolean {
  const r = (role ?? "").trim();
  if (!r) return true;
  const lower = r.toLowerCase();
  return (
    GENERIC_ROLE_RE.test(r) || lower.startsWith("talent community")
  );
}

/** One application = same employer + role (generic roles collapse per company). */
export function applicationDedupeKey(chain: {
  canonical_company: string;
  role_title?: string | null;
}): string {
  const companyKey = chain.canonical_company.trim().toLowerCase();
  const role = normalizeRoleTitle(chain.role_title ?? "");
  if (isGenericRole(role)) {
    return `${companyKey}::__generic__`;
  }
  return `${companyKey}::${role.toLowerCase()}`;
}

export function groupChainsByApplication<T extends ChainRow>(
  chains: T[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const chain of chains) {
    const key = applicationDedupeKey(chain);
    const group = map.get(key);
    if (group) {
      group.push(chain);
    } else {
      map.set(key, [chain]);
    }
  }
  return map;
}

/** Pick one chain per application for metrics (most advanced status, best role label). */
export function representativeChains<T extends ChainRow>(chains: T[]): T[] {
  const groups = groupChainsByApplication(chains);
  return Array.from(groups.values()).map((group) => pickRepresentativeChain(group));
}

export function countUniqueApplications(
  chains: Array<{ canonical_company: string; role_title?: string | null }>
): number {
  return groupChainsByApplication(chains as ChainRow[]).size;
}

export function pickRepresentativeChain<T extends ChainRow>(group: T[]): T {
  return [...group].sort((a, b) => {
    const statusDiff =
      STATUS_ORDER.indexOf(b.status as ChainStatus) -
      STATUS_ORDER.indexOf(a.status as ChainStatus);
    if (statusDiff !== 0) return statusDiff;

    const aGeneric = isGenericRole(a.role_title) ? 1 : 0;
    const bGeneric = isGenericRole(b.role_title) ? 1 : 0;
    if (aGeneric !== bGeneric) return aGeneric - bGeneric;

    return b.last_event_at - a.last_event_at;
  })[0];
}
