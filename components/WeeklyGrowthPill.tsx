"use client";

/**
 * Glass-style “+N …” badge (dark green pill, inner glow) inspired by dashboard metrics.
 * `periodLabel` should match the dashboard date filter (e.g. "today", "this week").
 */
export function WeeklyGrowthPill({
  count,
  periodLabel,
  selected,
}: {
  count: number;
  /** e.g. "today", "this week", "last 30 days" */
  periodLabel: string;
  selected?: boolean;
}) {
  if (count <= 0) return null;

  return (
    <span
      className={[
        "mt-1.5 inline-flex items-center justify-center rounded-full px-2.5 py-1",
        "text-[10px] font-semibold tabular-nums leading-none tracking-tight",
        "backdrop-blur-md transition-all",
        selected
          ? [
              "bg-black/30 text-white border border-white/20",
              "shadow-[inset_0_-4px_12px_rgba(52,211,153,0.55),0_0_12px_-4px_rgba(34,197,94,0.35)]",
            ].join(" ")
          : [
              "bg-emerald-950/80 text-white/95 border border-emerald-500/35",
              "shadow-[inset_0_-4px_14px_rgba(34,197,94,0.5),0_0_0_1px_rgba(16,185,129,0.12)]",
            ].join(" "),
      ].join(" ")}
    >
      +{count} {periodLabel}
    </span>
  );
}
