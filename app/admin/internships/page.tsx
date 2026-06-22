"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SyncInternshipsResult } from "@/lib/jobs/syncInternships";

type InternshipStats = {
  activeListings: number;
  companies: number;
  enabledSources: number;
  lastSyncedAt: string | null;
};

type SyncRun = {
  id: string;
  started_at: string;
  finished_at: string | null;
  sources_processed: number;
  fetched: number;
  us_kept: number;
  upserted: number;
  deactivated: number;
  errors: string[] | unknown;
};

function formatWhen(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString();
}

export default function AdminInternshipsPage() {
  const [stats, setStats] = useState<InternshipStats | null>(null);
  const [lastRun, setLastRun] = useState<SyncRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");
  const [syncResult, setSyncResult] = useState<SyncInternshipsResult | null>(null);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/internships");
      if (res.status === 403) throw new Error("Access denied");
      const data = await res.json();
      if (data.error) {
        throw new Error(data.hint ? `${data.error} ${data.hint}` : data.error);
      }
      setStats(data.stats);
      setLastRun(data.lastRun ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleSync() {
    setSyncing(true);
    setError("");
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/internships/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        const msg = [data.error, data.hint].filter(Boolean).join(" ");
        throw new Error(msg || "Sync failed");
      }
      if (
        data.errors?.length > 0 &&
        data.upserted === 0 &&
        data.usKept === 0
      ) {
        throw new Error(data.errors.join("; "));
      }
      setSyncResult(data as SyncInternshipsResult);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/internships/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Seed failed");
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Internship sync</h1>
          <p className="mt-2 text-sm text-slate-600">
            Pull live US internships from company career boards into Supabase. Students see
            updates on Find Internships as soon as the sync finishes (no deploy needed).
          </p>
        </div>
        <Link
          href="/find-internships"
          className="shrink-0 text-sm font-semibold text-scale-purple hover:underline"
        >
          View student page →
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Live listings
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats?.activeListings ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Companies
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats?.companies ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sources enabled
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats?.enabledSources ?? 0}
              </p>
            </div>
          </div>

          <p className="mb-6 text-sm text-slate-500">
            Last synced:{" "}
            <span className="font-medium text-slate-700">
              {formatWhen(stats?.lastSyncedAt ?? null)}
            </span>
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Fetch internships now</h2>
            <p className="mt-2 text-sm text-slate-600">
              Scans all enabled Greenhouse and Lever boards, filters to US internships, and
              upserts into the database. Usually takes 30–60 seconds. Listing count depends on
              how many companies currently have open US intern roles on their career pages.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleSync()}
                disabled={syncing || seeding}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {syncing ? "Fetching…" : "Fetch internships now"}
              </button>
              <button
                type="button"
                onClick={() => void handleSeed()}
                disabled={syncing || seeding}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {seeding ? "Updating…" : "Refresh company sources"}
              </button>
            </div>
          </div>

          {syncResult && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-5">
              <p className="text-sm font-semibold text-emerald-900">Sync complete</p>
              <ul className="mt-3 space-y-1 text-sm text-emerald-900/90">
                <li>Sources processed: {syncResult.sourcesProcessed}</li>
                <li>Jobs fetched: {syncResult.fetched}</li>
                <li>US internships kept: {syncResult.usKept}</li>
                <li>Upserted: {syncResult.upserted}</li>
                <li>Deactivated: {syncResult.deactivated}</li>
              </ul>
              {syncResult.errors.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  <p className="font-semibold">Warnings</p>
                  <ul className="mt-1 list-disc pl-4">
                    {syncResult.errors.slice(0, 8).map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-4 text-xs text-emerald-800">
                Students will see these listings on their next page load or refresh.
              </p>
            </div>
          )}

          {lastRun && !syncResult && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Previous sync run
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {formatWhen(lastRun.finished_at ?? lastRun.started_at)} ·{" "}
                {lastRun.upserted} upserted · {lastRun.us_kept} US internships
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
