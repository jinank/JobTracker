import type { Chain, ChainStatus } from "@/types/chain";
import {
  groupChainsByApplication,
  pickRepresentativeChain,
} from "@/lib/uniqueApplications";

const TERMINAL: ChainStatus[] = ["REJECTED", "GHOSTED", "WITHDRAWN"];

export type ReportApp = {
  company: string;
  role: string;
  status: ChainStatus;
  appliedAt: number;
};

export type NamedCount = { key: string; label: string; count: number };

export type ApplicationReport = {
  total: number;
  active: number;
  closed: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  last30Days: number;
  interviewRate: number;
  offerRate: number;
  responseRate: number;
  avgPerWeek: number;
  byStatus: NamedCount[];
  byMonth: NamedCount[];
  byDay: NamedCount[];
  byWeekday: NamedCount[];
  topCompanies: NamedCount[];
};

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function startOfWeekMonday(d: Date): number {
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
  return monday.getTime();
}

function ymd(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function ym(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

function dayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_LABELS: Record<ChainStatus, string> = {
  APPLIED: "Applied",
  ASSESSMENT: "Assessment",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  WITHDRAWN: "Withdrawn",
};

export type ReportChain = Pick<
  Chain,
  "chain_id" | "canonical_company" | "role_title" | "status" | "last_event_at" | "confidence"
> & { created_at?: number };

export function uniqueAppsFromChains(
  chains: ReportChain[],
  firstEventByChain: Map<string, number>
): ReportApp[] {
  const groups = groupChainsByApplication(chains as Chain[]);
  const apps: ReportApp[] = [];

  for (const group of groups.values()) {
    const rep = pickRepresentativeChain(group);
    let appliedAt = Number.POSITIVE_INFINITY;
    for (const c of group) {
      const fromEvent = firstEventByChain.get(c.chain_id);
      const fallback = Math.min(
        Number(c.created_at) || Number.POSITIVE_INFINITY,
        Number(c.last_event_at) || Number.POSITIVE_INFINITY
      );
      const t = fromEvent ?? fallback;
      if (t < appliedAt) appliedAt = t;
    }
    if (!Number.isFinite(appliedAt)) {
      appliedAt = Number(rep.last_event_at) || Date.now();
    }
    apps.push({
      company: rep.canonical_company,
      role: rep.role_title || "Unknown role",
      status: rep.status,
      appliedAt,
    });
  }

  return apps;
}

export function buildApplicationReport(apps: ReportApp[]): ApplicationReport {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeekMonday(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const last30Start = todayStart - 29 * 24 * 60 * 60 * 1000;

  const byStatusMap = new Map<ChainStatus, number>();
  for (const s of Object.keys(STATUS_LABELS) as ChainStatus[]) {
    byStatusMap.set(s, 0);
  }

  const monthKeys: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  const monthMap = new Map(monthKeys.map((k) => [k, 0]));

  const dayKeys: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(todayStart + 12 * 60 * 60 * 1000);
    d.setDate(d.getDate() - i);
    dayKeys.push(ymd(d.getTime()));
  }
  const dayMap = new Map(dayKeys.map((k) => [k, 0]));

  const weekdayMap = new Map(WEEKDAYS.map((k) => [k, 0]));
  const companyMap = new Map<string, number>();

  let today = 0;
  let thisWeek = 0;
  let thisMonth = 0;
  let last30Days = 0;
  let interviews = 0;
  let offers = 0;
  let responses = 0;
  let active = 0;
  let closed = 0;
  let earliest = Number.POSITIVE_INFINITY;

  for (const app of apps) {
    const t = app.appliedAt;
    if (t < earliest) earliest = t;
    byStatusMap.set(app.status, (byStatusMap.get(app.status) ?? 0) + 1);

    if (TERMINAL.includes(app.status)) closed += 1;
    else active += 1;

    if (
      app.status === "INTERVIEWING" ||
      app.status === "ASSESSMENT" ||
      app.status === "OFFER"
    ) {
      interviews += 1;
    }
    if (app.status === "OFFER") offers += 1;
    if (app.status !== "APPLIED") responses += 1;

    if (t >= todayStart) today += 1;
    if (t >= weekStart) thisWeek += 1;
    if (t >= monthStart) thisMonth += 1;
    if (t >= last30Start) last30Days += 1;

    const mk = ym(t);
    if (monthMap.has(mk)) monthMap.set(mk, (monthMap.get(mk) ?? 0) + 1);

    const dk = ymd(t);
    if (dayMap.has(dk)) dayMap.set(dk, (dayMap.get(dk) ?? 0) + 1);

    const wd = new Date(t).getDay();
    const wdKey = WEEKDAYS[wd === 0 ? 6 : wd - 1];
    weekdayMap.set(wdKey, (weekdayMap.get(wdKey) ?? 0) + 1);

    const company = app.company.trim() || "Unknown";
    companyMap.set(company, (companyMap.get(company) ?? 0) + 1);
  }

  const weeksTracked = Number.isFinite(earliest)
    ? Math.max(1, (Date.now() - earliest) / (7 * 24 * 60 * 60 * 1000))
    : 1;

  const total = apps.length;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 1000) / 10);

  const topCompanies = [...companyMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ key: label, label, count }));

  return {
    total,
    active,
    closed,
    today,
    thisWeek,
    thisMonth,
    last30Days,
    interviewRate: pct(interviews),
    offerRate: pct(offers),
    responseRate: pct(responses),
    avgPerWeek: Math.round((total / weeksTracked) * 10) / 10,
    byStatus: (Object.keys(STATUS_LABELS) as ChainStatus[]).map((s) => ({
      key: s,
      label: STATUS_LABELS[s],
      count: byStatusMap.get(s) ?? 0,
    })),
    byMonth: monthKeys.map((key) => ({
      key,
      label: monthLabel(key),
      count: monthMap.get(key) ?? 0,
    })),
    byDay: dayKeys.map((key) => ({
      key,
      label: dayLabel(key),
      count: dayMap.get(key) ?? 0,
    })),
    byWeekday: WEEKDAYS.map((key) => ({
      key,
      label: key,
      count: weekdayMap.get(key) ?? 0,
    })),
    topCompanies,
  };
}
