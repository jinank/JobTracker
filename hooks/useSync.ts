"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

const LEGACY_LAST_SYNC_KEY = "rethinkjobs_last_sync_at_ms";

function lastSyncStorageKey(accountEmail?: string | null): string {
  const e = (accountEmail ?? "").trim().toLowerCase();
  if (!e) return LEGACY_LAST_SYNC_KEY;
  return `rethinkjobs_last_sync_at_ms::${e}`;
}

function readStoredLastSyncAt(key: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    let raw = localStorage.getItem(key);
    if (!raw && key !== LEGACY_LAST_SYNC_KEY) {
      raw = localStorage.getItem(LEGACY_LAST_SYNC_KEY);
    }
    if (!raw) return null;
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  } catch {
    return null;
  }
}

function writeStoredLastSyncAt(key: string, ts: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(ts));
    if (key !== LEGACY_LAST_SYNC_KEY) {
      localStorage.removeItem(LEGACY_LAST_SYNC_KEY);
    }
  } catch {
    /* quota / private mode */
  }
}

interface SyncState {
  syncing: boolean;
  progress: string;
  lastSyncAt: number | null;
  error: string | null;
  newCount: number;
  paymentRequired: boolean;
  /** True when the server capped this sync; run Sync again to pull more mail. */
  syncHasMore: boolean;
}

export function useSync(
  onComplete: () => void,
  accountEmail?: string | null
) {
  const syncStorageKey = useMemo(
    () => lastSyncStorageKey(accountEmail),
    [accountEmail]
  );

  const [state, setState] = useState<SyncState>({
    syncing: false,
    progress: "",
    lastSyncAt: null,
    error: null,
    newCount: 0,
    paymentRequired: false,
    syncHasMore: false,
  });

  useEffect(() => {
    const stored = readStoredLastSyncAt(syncStorageKey);
    setState((s) => ({ ...s, lastSyncAt: stored }));
  }, [syncStorageKey]);

  const sync = useCallback(async () => {
    setState((s) => ({
      ...s,
      syncing: true,
      error: null,
      progress: "Syncing emails and classifying with AI...",
      newCount: 0,
      paymentRequired: false,
      syncHasMore: false,
    }));

    try {
      const res = await fetch("/api/gmail/sync", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        code?: string;
        error?: string;
        newCount?: number;
        total?: number;
        hasMore?: boolean;
      };

      if (!res.ok) {
        if (
          res.status === 403 &&
          (data.code === "UPGRADE_REQUIRED" || data.code === "PAYMENT_REQUIRED")
        ) {
          setState((s) => ({
            ...s,
            syncing: false,
            progress: "",
            paymentRequired: true,
            syncHasMore: false,
          }));
          onComplete();
          return;
        }
        if (res.status === 403 && data.code === "GMAIL_SCOPE_INSUFFICIENT") {
          setState((s) => ({
            ...s,
            syncing: false,
            progress: "",
            error:
              typeof data.error === "string"
                ? data.error
                : "Gmail access missing — sign out and sign in with Google again.",
            syncHasMore: false,
          }));
          onComplete();
          return;
        }
        throw new Error(
          typeof data.error === "string" ? data.error : "Sync failed"
        );
      }

      const now = Date.now();
      writeStoredLastSyncAt(syncStorageKey, now);
      setState({
        syncing: false,
        progress: "",
        lastSyncAt: now,
        error: null,
        newCount: data.newCount ?? 0,
        paymentRequired: false,
        syncHasMore: data.hasMore === true,
      });
      onComplete();
    } catch (error) {
      setState((s) => ({
        ...s,
        syncing: false,
        progress: "",
        error: error instanceof Error ? error.message : "Sync failed",
        syncHasMore: false,
      }));
    }
  }, [onComplete, syncStorageKey]);

  return { ...state, sync };
}
