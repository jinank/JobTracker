"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { isGmailReauthError } from "@/lib/gmailAuthErrors";

const LEGACY_LAST_SYNC_KEY = "rethinkjobs_last_sync_at_ms";
const LAST_SYNC_KEY = "summer_internships_last_sync_at_ms";

function lastSyncStorageKey(accountEmail?: string | null): string {
  const e = (accountEmail ?? "").trim().toLowerCase();
  if (!e) return LAST_SYNC_KEY;
  return `${LAST_SYNC_KEY}::${e}`;
}

function readStoredLastSyncAt(key: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    let raw = localStorage.getItem(key);
    if (!raw && key !== LEGACY_LAST_SYNC_KEY) {
      raw =
        localStorage.getItem(LEGACY_LAST_SYNC_KEY) ??
        localStorage.getItem(`${LEGACY_LAST_SYNC_KEY}::${key.split("::")[1] ?? ""}`);
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
  /** True when Gmail OAuth expired — show Reconnect Gmail. */
  needsGmailReauth: boolean;
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
    needsGmailReauth: false,
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
      needsGmailReauth: false,
      syncHasMore: false,
    }));

    const MAX_AUTO_BATCHES = 4;
    let totalNew = 0;
    let hasMore = false;

    try {
      for (let batch = 0; batch < MAX_AUTO_BATCHES; batch++) {
        if (batch > 0) {
          setState((s) => ({
            ...s,
            progress: `Continuing sync (batch ${batch + 1})...`,
          }));
        }

        const res = await fetch("/api/gmail/sync", { method: "POST" });
        const data = (await res.json().catch(() => ({}))) as {
          code?: string;
          error?: string;
          needsReauth?: boolean;
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
              newCount: totalNew,
            }));
            onComplete();
            return;
          }

          const errText =
            typeof data.error === "string" ? data.error : "Sync failed";
          const needsReauth =
            data.needsReauth === true ||
            isGmailReauthError(errText, data.code);

          if (needsReauth) {
            setState((s) => ({
              ...s,
              syncing: false,
              progress: "",
              error: errText,
              needsGmailReauth: true,
              syncHasMore: false,
              newCount: totalNew,
            }));
            onComplete();
            return;
          }

          throw new Error(errText);
        }

        totalNew += data.newCount ?? 0;
        hasMore = data.hasMore === true;

        // Keep going while more mail is queued so recent apps aren't stuck behind batches.
        if (!hasMore) break;
      }

      const now = Date.now();
      writeStoredLastSyncAt(syncStorageKey, now);
      setState({
        syncing: false,
        progress: "",
        lastSyncAt: now,
        error: null,
        newCount: totalNew,
        paymentRequired: false,
        needsGmailReauth: false,
        syncHasMore: hasMore,
      });
      onComplete();
    } catch (error) {
      const errText = error instanceof Error ? error.message : "Sync failed";
      const needsReauth = isGmailReauthError(errText);
      setState((s) => ({
        ...s,
        syncing: false,
        progress: "",
        error: needsReauth
          ? "Your Gmail connection expired or was revoked. Reconnect Gmail to continue syncing."
          : errText,
        needsGmailReauth: needsReauth,
        syncHasMore: false,
        newCount: totalNew,
      }));
    }
  }, [onComplete, syncStorageKey]);

  return { ...state, sync };
}
