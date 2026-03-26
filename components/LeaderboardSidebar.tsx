"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GitaQuoteCard } from "./GitaQuoteCard";
import {
  disableLeaderboard,
  leaderboardSnoozeEndsAtMs,
  readLeaderboardVisibility,
  restoreLeaderboard,
  snoozeLeaderboard,
} from "@/lib/leaderboardPreferences";

const MS_DAY = 86_400_000;
const MS_WEEK = 7 * MS_DAY;

type LeaderboardEntry = {
  rank: number;
  displayName: string;
  imageUrl: string | null;
  applicationCount: number;
  isYou: boolean;
};

type LeaderboardPayload = {
  entries: LeaderboardEntry[];
  yourRank: number | null;
  yourApplicationCount: number;
  trackersWithApplications: number | null;
};

function formatResumeTime(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "later";
  }
}

function Avatar({
  imageUrl,
  label,
}: {
  imageUrl: string | null;
  label: string;
}) {
  const initial = (label.replace(/\*/g, "").slice(0, 1) || "?").toUpperCase();
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-xs font-bold text-slate-600 ring-2 ring-white shadow-sm"
      aria-hidden
    >
      {initial}
    </div>
  );
}

function LeaderboardSettingsButton({
  onSnooze1d,
  onSnooze7d,
  onDisable,
}: {
  onSnooze1d: () => void;
  onSnooze7d: () => void;
  onDisable: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuWrapRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="relative shrink-0" ref={menuWrapRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
          menuOpen
            ? "border-blue-400 bg-white text-slate-800 shadow-sm"
            : "border-slate-200 bg-white/90 text-slate-500 hover:bg-white hover:border-slate-300 hover:text-slate-800"
        }`}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label="Leaderboard visibility settings"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-slate-200/90 bg-white py-1 shadow-lg ring-1 ring-black/5"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onSnooze1d();
              setMenuOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            1 day
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onSnooze7d();
              setMenuOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            7 days
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onDisable();
              setMenuOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
          >
            Don&apos;t show
          </button>
        </div>
      )}
    </div>
  );
}

export function LeaderboardSidebar() {
  const [lbReady, setLbReady] = useState(false);
  const [visibility, setVisibility] = useState<
    "visible" | "snoozed" | "disabled"
  >("visible");
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);

  const [data, setData] = useState<LeaderboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshLbPrefs = useCallback(() => {
    setVisibility(readLeaderboardVisibility());
    setSnoozeUntil(leaderboardSnoozeEndsAtMs());
  }, []);

  useEffect(() => {
    refreshLbPrefs();
    setLbReady(true);
  }, [refreshLbPrefs]);

  useEffect(() => {
    if (!lbReady || visibility !== "visible") {
      if (visibility !== "visible") setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const json = await res.json();
        if (!res.ok) {
          if (!cancelled) {
            setError(
              typeof json.hint === "string"
                ? json.hint
                : json.error || "Could not load leaderboard"
            );
            setData(null);
          }
          return;
        }
        if (!cancelled) {
          setData(json as LeaderboardPayload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load leaderboard");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lbReady, visibility]);

  const handleSnooze1d = () => {
    snoozeLeaderboard(MS_DAY);
    refreshLbPrefs();
  };

  const handleSnooze7d = () => {
    snoozeLeaderboard(MS_WEEK);
    refreshLbPrefs();
  };

  const handleDisable = () => {
    disableLeaderboard();
    refreshLbPrefs();
  };

  const handleRestore = () => {
    restoreLeaderboard();
    refreshLbPrefs();
  };

  return (
    <aside className="hidden xl:block w-72 shrink-0 self-start sticky top-28 space-y-4">
      {!lbReady ? (
        <div
          className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden animate-pulse"
          aria-hidden
        >
          <div className="h-10 border-b border-slate-100 bg-slate-50" />
          <div className="p-3 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-5 rounded bg-slate-100" />
                <div className="h-9 w-9 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-20 rounded bg-slate-100" />
                  <div className="h-2 w-14 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : visibility !== "visible" ? (
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-blue-50/25 shadow-card px-4 py-3 text-center">
          <p className="text-[11px] text-slate-600 leading-snug">
            {visibility === "disabled"
              ? "Leaderboard is turned off."
              : snoozeUntil
                ? `Leaderboard snoozed until ${formatResumeTime(snoozeUntil)}.`
                : "Leaderboard is snoozed."}
          </p>
          <button
            type="button"
            onClick={handleRestore}
            className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2"
          >
            Show leaderboard again
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-visible">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 px-4 py-3 flex items-start justify-between gap-2">
            <div className="min-w-0 pr-1">
              <h2 className="text-sm font-semibold text-slate-800">Leaderboard</h2>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Top trackers by applications synced. Names are shortened for privacy.
              </p>
            </div>
            <LeaderboardSettingsButton
              onSnooze1d={handleSnooze1d}
              onSnooze7d={handleSnooze7d}
              onDisable={handleDisable}
            />
          </div>

          <div className="p-3">
            {loading && (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-5 rounded bg-slate-100" />
                    <div className="h-9 w-9 rounded-full bg-slate-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-20 rounded bg-slate-100" />
                      <div className="h-2 w-14 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
            )}

            {!loading && !error && data && (
              <>
                <ul className="space-y-1">
                  {data.entries.map((e) => (
                    <li
                      key={`${e.rank}-${e.displayName}`}
                      className={`flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors ${
                        e.isYou
                          ? "bg-blue-50 ring-1 ring-blue-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`w-6 text-center text-xs font-bold tabular-nums ${
                          e.rank <= 3 ? "text-amber-600" : "text-slate-400"
                        }`}
                      >
                        {e.rank}
                      </span>
                      <Avatar imageUrl={e.imageUrl} label={e.displayName} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {e.displayName}
                          {e.isYou && (
                            <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {e.applicationCount} app
                          {e.applicationCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {data.yourRank != null && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <p>
                      <span className="font-semibold text-slate-800">
                        Your rank
                      </span>
                      : #{data.yourRank} · {data.yourApplicationCount}{" "}
                      application
                      {data.yourApplicationCount !== 1 ? "s" : ""}
                    </p>
                    {data.trackersWithApplications != null &&
                      data.trackersWithApplications > 0 && (
                        <p className="text-slate-400">
                          Among {data.trackersWithApplications} active tracker
                          {data.trackersWithApplications !== 1 ? "s" : ""}
                        </p>
                      )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <GitaQuoteCard />
    </aside>
  );
}
