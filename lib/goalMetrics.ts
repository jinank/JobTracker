import type { Chain } from "@/types/chain";
import { chainCreatedMs } from "@/lib/chainCreatedAt";
import { startOfCalendarWeekMs } from "@/lib/utils";

function endOfLocalDayMs(d: Date): number {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    23,
    59,
    59,
    999
  ).getTime();
}

export function localDateKey(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function countChainsCreatedInRange(
  chains: Chain[],
  fromMs: number,
  toMs: number
): number {
  return chains.filter((c) => {
    const t = chainCreatedMs(c);
    return t >= fromMs && t <= toMs;
  }).length;
}

export function weeklyApplicationCount(
  chains: Chain[],
  ref: Date = new Date()
): number {
  const list = Array.isArray(chains) ? chains : [];
  const from = startOfCalendarWeekMs(ref);
  const to = endOfLocalDayMs(ref);
  return countChainsCreatedInRange(list, from, to);
}

export function dailyApplicationCount(
  chains: Chain[],
  ref: Date = new Date()
): number {
  const list = Array.isArray(chains) ? chains : [];
  const d = new Date(ref);
  const from = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const to = endOfLocalDayMs(d);
  return countChainsCreatedInRange(list, from, to);
}

/**
 * Consecutive local days with ≥1 new application (by created_at).
 * If today has none yet, we skip today without breaking the streak from prior days.
 */
export function applicationDayStreak(
  chains: Chain[],
  ref: Date = new Date()
): number {
  const list = Array.isArray(chains) ? chains : [];
  const daysWithNewApp = new Set<string>();
  for (const c of list) {
    daysWithNewApp.add(localDateKey(chainCreatedMs(c)));
  }
  let streak = 0;
  const check = new Date(ref);
  check.setHours(12, 0, 0, 0);
  for (let i = 0; i < 366; i++) {
    const key = localDateKey(check.getTime());
    if (daysWithNewApp.has(key)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      if (i === 0) {
        check.setDate(check.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}
