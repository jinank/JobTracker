"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BHAGAVAD_GITA_QUOTES,
  gitaQuoteForDay,
} from "@/lib/bhagavadGitaQuotes";
import {
  disableGitaQuotes,
  readGitaQuoteVisibility,
  restoreGitaQuotes,
  snoozeEndsAtMs,
  snoozeGitaQuotes,
} from "@/lib/gitaQuotePreferences";

const MS_DAY = 86_400_000;
const MS_WEEK = 7 * MS_DAY;

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

export function GitaQuoteCard() {
  const [ready, setReady] = useState(false);
  const [visibility, setVisibility] = useState<
    "visible" | "snoozed" | "disabled"
  >("visible");
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement>(null);

  const refreshPrefs = useCallback(() => {
    setVisibility(readGitaQuoteVisibility());
    setSnoozeUntil(snoozeEndsAtMs());
  }, []);

  useEffect(() => {
    refreshPrefs();
    setReady(true);
  }, [refreshPrefs]);

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

  const quote = gitaQuoteForDay(BHAGAVAD_GITA_QUOTES);

  const handleSnooze1d = () => {
    snoozeGitaQuotes(MS_DAY);
    refreshPrefs();
    setMenuOpen(false);
  };

  const handleSnooze7d = () => {
    snoozeGitaQuotes(MS_WEEK);
    refreshPrefs();
    setMenuOpen(false);
  };

  const handleDisable = () => {
    disableGitaQuotes();
    refreshPrefs();
    setMenuOpen(false);
  };

  const handleRestore = () => {
    restoreGitaQuotes();
    refreshPrefs();
  };

  if (!ready) {
    return (
      <div
        className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden animate-pulse"
        aria-hidden
      >
        <div className="h-24 bg-slate-50 m-3 rounded-xl" />
      </div>
    );
  }

  if (visibility !== "visible") {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-amber-50/20 shadow-card px-4 py-3 text-center">
        <p className="text-[11px] text-slate-600 leading-snug">
          {visibility === "disabled"
            ? "Bhagavad Gita reflections are turned off."
            : snoozeUntil
              ? `Reflections snoozed until ${formatResumeTime(snoozeUntil)}.`
              : "Reflections are snoozed."}
        </p>
        <button
          type="button"
          onClick={handleRestore}
          className="mt-2 text-xs font-semibold text-amber-900/90 hover:text-amber-950 underline underline-offset-2"
        >
          Show quotes again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-b from-amber-50/90 via-white to-white shadow-card overflow-visible">
      <div className="border-b border-amber-100/80 bg-gradient-to-r from-amber-100/40 to-orange-50/30 px-4 py-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 pr-1">
          <h2 className="text-sm font-semibold text-amber-950/90">
            A moment of steadiness
          </h2>
          <p className="text-[10px] text-amber-900/55 mt-0.5 leading-snug">
            From the Bhagavad Gita — for difficult days in the search.
          </p>
        </div>
        <div className="relative shrink-0" ref={menuWrapRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
              menuOpen
                ? "border-amber-400 bg-white text-amber-900 shadow-sm"
                : "border-amber-200/80 bg-white/80 text-amber-900/70 hover:bg-white hover:border-amber-300 hover:text-amber-950"
            }`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Quote visibility settings"
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
                onClick={handleSnooze1d}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                1 day
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleSnooze7d}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                7 days
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleDisable}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                Don&apos;t show
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <blockquote className="text-sm text-slate-700 leading-relaxed font-serif">
          <span className="text-amber-700/80 text-lg leading-none font-serif">
            &ldquo;
          </span>
          {quote.text}
          <span className="text-amber-700/80 text-lg leading-none font-serif">
            &rdquo;
          </span>
        </blockquote>
        <cite className="not-italic block text-[11px] text-slate-500 mt-3 text-right">
          — {quote.ref}
        </cite>
      </div>
    </div>
  );
}
