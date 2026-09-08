"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Chain } from "@/types/chain";
import { GoalProgressSection } from "./GoalProgressSection";
import { GitaQuoteCard } from "./GitaQuoteCard";
import type { ApplicationReport } from "@/lib/applicationReport";

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2.5 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function MiniMonthBars({ report }: { report: ApplicationReport }) {
  const items = report.byMonth;
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="mt-3">
      <p className="text-[11px] font-semibold text-slate-700">By month</p>
      <div className="mt-2 flex h-20 items-end gap-1">
        {items.map((item) => {
          const h = Math.max(item.count > 0 ? 6 : 2, Math.round((item.count / max) * 64));
          return (
            <div
              key={item.key}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
              title={`${item.label}: ${item.count}`}
            >
              <div
                className="w-full rounded-t bg-scale-purple/80"
                style={{ height: h }}
              />
              <span className="w-full truncate text-center text-[9px] text-slate-400">
                {item.label.replace(/ \d{2}$/, "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrackerStatsSidebar({ chains }: { chains: Chain[] }) {
  const [report, setReport] = useState<ApplicationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tracker/report")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Could not load stats");
        if (!cancelled) setReport(data.report as ApplicationReport);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load stats");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [chains.length]);

  return (
    <aside className="hidden xl:block w-72 shrink-0 self-start sticky top-28 space-y-4">
      <GoalProgressSection chains={chains} />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-violet-50/50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">Your stats</h2>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
            Unique applications for this account (company + role).
          </p>
        </div>
        <div className="p-3">
          {!report && !error && (
            <p className="py-2 text-xs text-slate-400">Loading stats…</p>
          )}
          {error && <p className="text-xs leading-relaxed text-slate-500">{error}</p>}
          {report && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <MiniStat label="Total" value={report.total} />
                <MiniStat label="Active" value={report.active} />
                <MiniStat label="This month" value={report.thisMonth} />
                <MiniStat label="Today" value={report.today} />
                <MiniStat label="This week" value={report.thisWeek} />
                <MiniStat label="Last 30d" value={report.last30Days} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold tabular-nums text-slate-900">
                    {report.responseRate}%
                  </p>
                  <p className="text-[10px] text-slate-500">Response</p>
                </div>
                <div>
                  <p className="text-sm font-bold tabular-nums text-slate-900">
                    {report.interviewRate}%
                  </p>
                  <p className="text-[10px] text-slate-500">Interview</p>
                </div>
                <div>
                  <p className="text-sm font-bold tabular-nums text-slate-900">
                    {report.offerRate}%
                  </p>
                  <p className="text-[10px] text-slate-500">Offer</p>
                </div>
              </div>
              <MiniMonthBars report={report} />
              <Link
                href="/tracker/report"
                className="mt-3 flex items-center justify-center rounded-xl bg-scale-purple px-3 py-2 text-xs font-semibold text-white transition hover:bg-scale-purple-dark"
              >
                Full report
              </Link>
            </>
          )}
        </div>
      </div>

      <GitaQuoteCard />
    </aside>
  );
}
