"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Chain } from "@/types/chain";
import {
  applicationDayStreak,
  dailyApplicationCount,
  weeklyApplicationCount,
} from "@/lib/goalMetrics";
import {
  DEFAULT_DAILY_TARGET,
  DEFAULT_WEEKLY_TARGET,
  type GoalPeriod,
  readDailyTarget,
  readGoalPeriod,
  readWeeklyTarget,
  resetGoalTargetsToDefaults,
  writeGoalPeriod,
  writeGoalTargets,
  clampDailyTarget,
  clampWeeklyTarget,
} from "@/lib/goalPreferences";

export { DEFAULT_DAILY_TARGET, DEFAULT_WEEKLY_TARGET } from "@/lib/goalPreferences";

function GoalSettingsButton({
  onSave,
  dailyTarget,
  weeklyTarget,
}: {
  onSave: (daily: number, weekly: number) => void;
  dailyTarget: number;
  weeklyTarget: number;
}) {
  const [open, setOpen] = useState(false);
  const [draftDaily, setDraftDaily] = useState(String(dailyTarget));
  const [draftWeekly, setDraftWeekly] = useState(String(weeklyTarget));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraftDaily(String(dailyTarget));
    setDraftWeekly(String(weeklyTarget));
  }, [open, dailyTarget, weeklyTarget]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSave = () => {
    const d = clampDailyTarget(parseInt(draftDaily, 10));
    const w = clampWeeklyTarget(parseInt(draftWeekly, 10));
    onSave(d, w);
    setOpen(false);
  };

  const handleReset = () => {
    resetGoalTargetsToDefaults();
    onSave(DEFAULT_DAILY_TARGET, DEFAULT_WEEKLY_TARGET);
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
          open
            ? "border-[#7E77D8]/50 bg-white text-[#5c54b8] shadow-sm"
            : "border-slate-200 bg-white/90 text-slate-500 hover:bg-white hover:border-slate-300 hover:text-slate-800"
        }`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Goal targets settings"
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
      {open && (
        <div
          role="dialog"
          aria-label="Edit goal targets"
          className="absolute right-0 top-full z-[60] mt-1 w-[min(17rem,calc(100vw-2rem))] rounded-xl border border-slate-200/90 bg-white p-3 shadow-lg ring-1 ring-black/5"
        >
          <p className="text-[11px] font-semibold text-slate-800 mb-2">
            Target applications
          </p>
          <div className="space-y-2">
            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Daily
              </span>
              <input
                type="number"
                min={1}
                max={50}
                value={draftDaily}
                onChange={(e) => setDraftDaily(e.target.value)}
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-800 tabular-nums focus:border-[#7E77D8] focus:outline-none focus:ring-2 focus:ring-[#7E77D8]/20"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Weekly
              </span>
              <input
                type="number"
                min={1}
                max={100}
                value={draftWeekly}
                onChange={(e) => setDraftWeekly(e.target.value)}
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-800 tabular-nums focus:border-[#7E77D8] focus:outline-none focus:ring-2 focus:ring-[#7E77D8]/20"
              />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 min-w-[5rem] rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function GoalProgressSection({ chains }: { chains: Chain[] }) {
  const safeChains = Array.isArray(chains) ? chains : [];
  const [period, setPeriod] = useState<GoalPeriod>("weekly");
  const [dailyTarget, setDailyTarget] = useState(DEFAULT_DAILY_TARGET);
  const [weeklyTarget, setWeeklyTarget] = useState(DEFAULT_WEEKLY_TARGET);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPeriod(readGoalPeriod());
    setDailyTarget(readDailyTarget());
    setWeeklyTarget(readWeeklyTarget());
    setMounted(true);
  }, []);

  const setPeriodPersist = (next: GoalPeriod) => {
    setPeriod(next);
    writeGoalPeriod(next);
  };

  const persistTargets = (daily: number, weekly: number) => {
    const d = clampDailyTarget(daily);
    const w = clampWeeklyTarget(weekly);
    writeGoalTargets(d, w);
    setDailyTarget(d);
    setWeeklyTarget(w);
  };

  const { current, target, label } = useMemo(() => {
    const now = new Date();
    if (period === "daily") {
      return {
        current: dailyApplicationCount(safeChains, now),
        target: dailyTarget,
        label: "Daily goal",
      };
    }
    return {
      current: weeklyApplicationCount(safeChains, now),
      target: weeklyTarget,
      label: "Weekly goal",
    };
  }, [safeChains, period, dailyTarget, weeklyTarget]);

  const pct = Math.min(
    100,
    target > 0 ? Math.round((current / target) * 100) : 0
  );
  const streak = useMemo(
    () => applicationDayStreak(safeChains, new Date()),
    [safeChains]
  );

  if (!mounted) {
    return (
      <div
        className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden animate-pulse"
        aria-hidden
      >
        <div className="h-10 border-b border-slate-100 bg-slate-50" />
        <div className="p-3 space-y-3">
          <div className="h-6 w-28 rounded-lg bg-slate-100" />
          <div className="h-3 w-full rounded-full bg-slate-100" />
          <div className="h-8 rounded-lg bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-visible animate-fade-in">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-violet-50/30 px-3 py-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 pr-1">
          <h2 className="text-sm font-semibold text-slate-800">Goals</h2>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
            Track applications synced this period.
          </p>
        </div>
        <GoalSettingsButton
          dailyTarget={dailyTarget}
          weeklyTarget={weeklyTarget}
          onSave={persistTargets}
        />
      </div>

      <div className="p-3 space-y-3">
        <div className="inline-flex rounded-xl border border-slate-200/90 bg-slate-50/80 p-0.5 w-full">
          {(
            [
              { key: "daily" as const, label: "Daily" },
              { key: "weekly" as const, label: "Weekly" },
            ] as const
          ).map(({ key, label: l }) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriodPersist(key)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                period === key
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {label}
            </span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {current} / {target}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 min-w-0 h-2.5 rounded-full bg-slate-200/90 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7E77D8] to-[#6DA7E1] transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums text-[#7E77D8] shrink-0 w-9 text-right">
              {pct}%
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Day streak
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold tabular-nums text-slate-900 leading-none">
              {streak}
            </span>
            <span className="text-base leading-none" aria-hidden>
              🔥
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
            Days in a row with a new application
          </p>
        </div>
      </div>
    </div>
  );
}
