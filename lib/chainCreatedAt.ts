import type { Chain } from "@/types/chain";

/** Supabase may return created_at as ms number or ISO string; normalize for comparisons. */
export function chainCreatedMs(c: Chain): number {
  const raw = c.created_at as unknown;
  if (typeof raw === "number" && raw > 0) return raw;
  if (typeof raw === "string") {
    const n = Number(raw);
    if (!Number.isNaN(n) && n > 1e11) return n;
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return c.last_event_at;
}
