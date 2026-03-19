"use client";

import type { ChainStatus } from "@/types/chain";

const STATUS_CONFIG: Record<
  ChainStatus,
  { label: string; bg: string; text: string }
> = {
  APPLIED: { label: "Applied", bg: "bg-blue-100", text: "text-blue-700" },
  ASSESSMENT: {
    label: "Assessment",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  INTERVIEWING: {
    label: "Interviewing",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  OFFER: { label: "Offer", bg: "bg-emerald-100", text: "text-emerald-700" },
  REJECTED: { label: "Rejected", bg: "bg-red-100", text: "text-red-700" },
  GHOSTED: { label: "Ghosted", bg: "bg-gray-100", text: "text-gray-500" },
  WITHDRAWN: {
    label: "Withdrawn",
    bg: "bg-slate-100",
    text: "text-slate-500",
  },
};

export function StatusBadge({ status }: { status: ChainStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.APPLIED;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`}
    >
      {config.label}
    </span>
  );
}
