"use client";

import { formatLastSyncLabel } from "@/lib/utils";

interface SyncButtonProps {
  syncing: boolean;
  progress: string;
  onSync: () => void;
  lastSyncAt: number | null;
}

export function SyncButton({
  syncing,
  progress,
  onSync,
  lastSyncAt,
}: SyncButtonProps) {
  const statusLine =
    syncing && progress
      ? progress
      : lastSyncAt != null
        ? `Last synced ${formatLastSyncLabel(lastSyncAt)}`
        : "";

  const statusTitle =
    syncing && progress
      ? progress
      : lastSyncAt != null
        ? new Date(lastSyncAt).toLocaleString()
        : undefined;

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onSync}
        disabled={syncing}
        className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {syncing ? (
          <>
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Syncing...
          </>
        ) : (
          <>
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Sync Gmail
          </>
        )}
      </button>
      <p
        className={`pointer-events-none absolute inset-x-0 top-full mt-0.5 h-4 truncate text-center text-[10px] leading-4 ${
          syncing ? "animate-pulse text-slate-500" : "text-slate-400"
        }`}
        title={statusTitle}
      >
        {statusLine || "\u00a0"}
      </p>
    </div>
  );
}
