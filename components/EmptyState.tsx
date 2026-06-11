"use client";

export function EmptyState({
  onSync,
  onRetry,
  loading = false,
}: {
  onSync: () => void;
  onRetry?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-scale-lavender to-scale-mist flex items-center justify-center mx-auto mb-6 border border-scale-purple/10">
        <svg
          className="w-10 h-10 text-scale-purple"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {loading ? "Loading your applications…" : "Let\u2019s find your applications"}
      </h3>
      <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
        {loading
          ? "One moment while we fetch your tracker."
          : "Sync your Gmail once and we\u2019ll automatically pull in every application, interview invite, and offer — no manual entry needed."}
      </p>
      <div className="flex flex-col gap-3 items-center justify-center">
        <button
          onClick={onSync}
          disabled={loading}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-scale-purple to-violet-600 text-white text-sm font-semibold hover:from-scale-purple-dark hover:to-violet-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
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
          Sync Gmail Now
        </button>
        {onRetry ? (
          <button
            onClick={onRetry}
            disabled={loading}
            className="inline-flex items-center justify-center px-5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Retry loading applications
          </button>
        ) : null}
      </div>
    </div>
  );
}
