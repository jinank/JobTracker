import type { Chain } from "@/types/chain";

/** True when chain list content is unchanged (order-independent). */
export function chainsDataEqual(a: Chain[], b: Chain[]): boolean {
  if (a.length !== b.length) return false;
  const byId = new Map(b.map((c) => [c.chain_id, c]));
  for (const x of a) {
    const y = byId.get(x.chain_id);
    if (!y) return false;
    if (
      x.status !== y.status ||
      x.last_event_at !== y.last_event_at ||
      x.canonical_company !== y.canonical_company ||
      x.role_title !== y.role_title ||
      x.confidence !== y.confidence
    ) {
      return false;
    }
  }
  return true;
}
