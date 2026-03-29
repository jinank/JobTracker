"use client";

import type { Chain, ChainStatus } from "@/types/chain";
import { chainCreatedMs } from "@/lib/chainCreatedAt";
import { WeeklyGrowthPill } from "./WeeklyGrowthPill";

const PIPELINE_STAGES: { status: ChainStatus; label: string; color: string; bg: string }[] = [
  { status: "APPLIED", label: "Applied", color: "bg-blue-500", bg: "bg-blue-50" },
  { status: "ASSESSMENT", label: "Assessment", color: "bg-violet-500", bg: "bg-violet-50" },
  { status: "INTERVIEWING", label: "Interviewing", color: "bg-amber-500", bg: "bg-amber-50" },
  { status: "OFFER", label: "Offer", color: "bg-emerald-500", bg: "bg-emerald-50" },
  { status: "REJECTED", label: "Rejected", color: "bg-red-400", bg: "bg-red-50" },
];

export function PipelineBar({
  chains,
  selectedFilter,
  onFilterClick,
  growthFromMs,
  growthToMs,
  growthLabel,
}: {
  chains: Chain[];
  selectedFilter: string;
  onFilterClick: (status: string) => void;
  growthFromMs: number;
  growthToMs: number;
  growthLabel: string;
}) {
  const inGrowthWindow = (c: Chain) => {
    const t = chainCreatedMs(c);
    return t >= growthFromMs && t <= growthToMs;
  };

  const counts = PIPELINE_STAGES.map((stage) => {
    const inStage = chains.filter((c) => c.status === stage.status);
    const addedInPeriod = inStage.filter(inGrowthWindow).length;
    return {
      ...stage,
      count: inStage.length,
      addedInPeriod,
    };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-fade-in">
      {counts.map((stage) => {
        const isSelected = selectedFilter === stage.status;
        return (
          <button
            key={stage.status}
            onClick={() => onFilterClick(stage.status)}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-3.5 sm:p-4 transition-all text-left w-full min-h-[96px] ${
              isSelected
                ? `${stage.color} border-transparent text-white shadow-md`
                : `${stage.bg} border-slate-200/80 hover:border-slate-300`
            }`}
          >
            <span className="text-2xl font-bold tabular-nums">
              {stage.count}
            </span>
            <WeeklyGrowthPill
              count={stage.addedInPeriod}
              periodLabel={growthLabel}
              selected={isSelected}
            />
            <span
              className={`text-xs font-medium mt-1 ${isSelected ? "text-white/90" : "text-slate-600"}`}
            >
              {stage.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
