"use client";

import { useState, useCallback } from "react";

interface SyncState {
  syncing: boolean;
  progress: string;
  lastSyncAt: number | null;
  error: string | null;
  newCount: number;
  paymentRequired: boolean;
}

export function useSync(onComplete: () => void) {
  const [state, setState] = useState<SyncState>({
    syncing: false,
    progress: "",
    lastSyncAt: null,
    error: null,
    newCount: 0,
    paymentRequired: false,
  });

  const sync = useCallback(async () => {
    setState((s) => ({
      ...s,
      syncing: true,
      error: null,
      progress: "Syncing emails and classifying with AI...",
      newCount: 0,
      paymentRequired: false,
    }));

    try {
      const res = await fetch("/api/gmail/sync", { method: "POST" });

      if (res.status === 403) {
        const data = await res.json();
        if (data.code === "UPGRADE_REQUIRED" || data.code === "PAYMENT_REQUIRED") {
          setState((s) => ({
            ...s,
            syncing: false,
            progress: "",
            paymentRequired: true,
          }));
          onComplete();
          return;
        }
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Sync failed");
      }

      const { newCount, total } = await res.json();

      setState({
        syncing: false,
        progress: "",
        lastSyncAt: Date.now(),
        error: null,
        newCount,
        paymentRequired: false,
      });
      onComplete();
    } catch (error) {
      setState((s) => ({
        ...s,
        syncing: false,
        progress: "",
        error: error instanceof Error ? error.message : "Sync failed",
      }));
    }
  }, [onComplete]);

  return { ...state, sync };
}
