export const DEFAULT_DAILY_TARGET = 3;
export const DEFAULT_WEEKLY_TARGET = 7;

const KEY_PERIOD = "rethinkjobs_goal_period";
const KEY_DAILY = "rethinkjobs_goal_daily_target";
const KEY_WEEKLY = "rethinkjobs_goal_weekly_target";

export type GoalPeriod = "daily" | "weekly";

export function clampDailyTarget(n: number): number {
  const x = Math.floor(Number(n));
  if (!Number.isFinite(x)) return DEFAULT_DAILY_TARGET;
  return Math.min(50, Math.max(1, x));
}

export function clampWeeklyTarget(n: number): number {
  const x = Math.floor(Number(n));
  if (!Number.isFinite(x)) return DEFAULT_WEEKLY_TARGET;
  return Math.min(100, Math.max(1, x));
}

export function readGoalPeriod(): GoalPeriod {
  if (typeof window === "undefined") return "weekly";
  try {
    const v = localStorage.getItem(KEY_PERIOD);
    if (v === "daily" || v === "weekly") return v;
  } catch {
    /* ignore */
  }
  return "weekly";
}

export function writeGoalPeriod(next: GoalPeriod): void {
  try {
    localStorage.setItem(KEY_PERIOD, next);
  } catch {
    /* ignore */
  }
}

export function readDailyTarget(): number {
  if (typeof window === "undefined") return DEFAULT_DAILY_TARGET;
  try {
    const v = localStorage.getItem(KEY_DAILY);
    if (v == null || v === "") return DEFAULT_DAILY_TARGET;
    return clampDailyTarget(parseInt(v, 10));
  } catch {
    return DEFAULT_DAILY_TARGET;
  }
}

export function readWeeklyTarget(): number {
  if (typeof window === "undefined") return DEFAULT_WEEKLY_TARGET;
  try {
    const v = localStorage.getItem(KEY_WEEKLY);
    if (v == null || v === "") return DEFAULT_WEEKLY_TARGET;
    return clampWeeklyTarget(parseInt(v, 10));
  } catch {
    return DEFAULT_WEEKLY_TARGET;
  }
}

export function writeGoalTargets(daily: number, weekly: number): void {
  try {
    localStorage.setItem(KEY_DAILY, String(clampDailyTarget(daily)));
    localStorage.setItem(KEY_WEEKLY, String(clampWeeklyTarget(weekly)));
  } catch {
    /* ignore */
  }
}

export function resetGoalTargetsToDefaults(): void {
  try {
    localStorage.removeItem(KEY_DAILY);
    localStorage.removeItem(KEY_WEEKLY);
  } catch {
    /* ignore */
  }
}
