"use client";

interface SyncButtonProps {
  syncing: boolean;
  progress: string;
  onSync: () => void;
}

export function SyncButton({ syncing, progress, onSync }: SyncButtonProps) {
  return (
    <div className="flex items-center gap-3">
      {syncing && progress && (
        <span className="text-xs text-slate-500 animate-pulse">{progress}</span>
      )}
      <button
        onClick={onSync}
        disabled={syncing}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {syncing ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5"
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
    </div>
  );
}
