"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SiteNavApp } from "@/components/SiteNav";
import { AppHeaderActions } from "@/components/AppHeaderActions";
import { ReportBarChart, ReportHBarList } from "@/components/ReportBarChart";
import type { ApplicationReport } from "@/lib/applicationReport";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function ApplicationReportApp() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [report, setReport] = useState<ApplicationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/tracker");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    setLoading(true);
    fetch("/api/tracker/report")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Could not load report");
        if (!cancelled) setReport(data.report as ApplicationReport);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load report");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === "loading" || (status === "authenticated" && loading && !report)) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteNavApp activeCount={0}>
          <AppHeaderActions email={session?.user?.email} />
        </SiteNavApp>
        <main className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-slate-500">
          Building your application report...
        </main>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNavApp activeCount={report?.active ?? 0}>
        <AppHeaderActions email={session?.user?.email} />
      </SiteNavApp>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link
              href="/tracker"
              className="text-xs font-semibold text-scale-purple hover:text-scale-purple-dark"
            >
              ← Back to tracker
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Application report
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Unique applications (same company + role counted once). Dates use the
              first application email when we have it.
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        {report && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total applications" value={report.total} hint="Unique company + role" />
              <StatCard label="Active" value={report.active} hint={`${report.closed} closed`} />
              <StatCard label="This month" value={report.thisMonth} hint={`${report.thisWeek} this week`} />
              <StatCard label="Today" value={report.today} hint={`${report.last30Days} in last 30 days`} />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Avg per week"
                value={report.avgPerWeek}
                hint="Across your tracked history"
              />
              <StatCard
                label="Response rate"
                value={`${report.responseRate}%`}
                hint="Moved past Applied"
              />
              <StatCard
                label="Interview / assessment"
                value={`${report.interviewRate}%`}
                hint="Share of unique apps"
              />
              <StatCard
                label="Offer rate"
                value={`${report.offerRate}%`}
                hint="Share of unique apps"
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <ReportBarChart title="Applications by month" items={report.byMonth} />
              <ReportBarChart
                title="Last 30 days"
                items={report.byDay}
                compact
              />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <ReportBarChart title="By weekday" items={report.byWeekday} compact />
              <ReportHBarList title="Pipeline by status" items={report.byStatus} />
            </div>

            <div className="mt-4">
              <ReportHBarList
                title="Top companies"
                items={report.topCompanies}
                emptyLabel="No companies yet. Sync Gmail from the tracker."
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
