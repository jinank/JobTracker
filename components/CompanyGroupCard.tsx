"use client";

import Link from "next/link";
import { useState } from "react";
import type { Chain, ChainStatus } from "@/types/chain";
import { STATUS_ORDER } from "@/types/chain";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeTime } from "@/lib/utils";

function companyInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-indigo-500 to-blue-600",
  "from-orange-500 to-amber-600",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Most "forward" status in the pipeline wins (e.g. OFFER beats INTERVIEWING). */
function primaryStatus(statuses: ChainStatus[]): ChainStatus {
  const priority: ChainStatus[] = [
    "OFFER",
    "INTERVIEWING",
    "ASSESSMENT",
    "APPLIED",
    "REJECTED",
    "GHOSTED",
    "WITHDRAWN",
  ];
  for (const p of priority) {
    if (statuses.includes(p)) return p;
  }
  return statuses[0] ?? "APPLIED";
}

export interface CompanyGroup {
  /** Stable key — lowercased canonical_company. */
  key: string;
  company: string;
  chains: Chain[];
}

export function buildCompanyGroups(chains: Chain[]): CompanyGroup[] {
  const map = new Map<string, CompanyGroup>();
  for (const chain of chains) {
    const key = chain.canonical_company.trim().toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.chains.push(chain);
    } else {
      map.set(key, {
        key,
        company: chain.canonical_company,
        chains: [chain],
      });
    }
  }
  for (const group of map.values()) {
    group.chains.sort((a, b) => b.last_event_at - a.last_event_at);
  }
  return Array.from(map.values());
}

export function CompanyGroupCard({
  group,
  onChainClick,
}: {
  group: CompanyGroup;
  onChainClick: (chain: Chain) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const primary = group.chains[0];
  const extraCount = group.chains.length - 1;
  const statuses = Array.from(new Set(group.chains.map((c) => c.status))).sort(
    (a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b)
  );
  const headlineStatus = primaryStatus(statuses);
  const reachOutUrl = `/reach-out?company=${encodeURIComponent(group.company)}&chainId=${primary.chain_id}${primary.role_title ? `&role=${encodeURIComponent(primary.role_title)}` : ""}`;

  const handleHeaderActivate = () => {
    if (group.chains.length === 1) {
      onChainClick(primary);
    } else {
      setExpanded((v) => !v);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-blue-200/80 transition-all duration-200 group animate-fade-in overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={handleHeaderActivate}
          className="flex-1 min-w-0 text-left"
          aria-expanded={group.chains.length > 1 ? expanded : undefined}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColor(group.company)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
            >
              {companyInitials(group.company)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                    {group.company}
                  </h3>
                  {extraCount > 0 && (
                    <span className="shrink-0 inline-flex items-center rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 border border-slate-200">
                      +{extraCount} more
                    </span>
                  )}
                </div>
                <StatusBadge status={headlineStatus} />
              </div>
              <div className="flex items-center justify-between mt-1.5 gap-2">
                <p className="text-xs text-slate-500 truncate">
                  {extraCount > 0
                    ? `${primary.role_title || "Unknown role"} · ${group.chains.length} threads`
                    : primary.role_title || "Unknown role"}
                </p>
                <span className="text-xs text-slate-400 shrink-0 ml-2">
                  {formatRelativeTime(primary.last_event_at)}
                </span>
              </div>
              {extraCount > 0 && statuses.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {statuses.map((s) => (
                    <StatusBadge key={s} status={s} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </button>
        {group.chains.length > 1 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse threads" : "Expand threads"}
            className="shrink-0 w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        <Link
          href={reachOutUrl}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 px-3 py-2 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-colors"
        >
          Reach Out
        </Link>
      </div>

      {expanded && group.chains.length > 1 && (
        <div className="border-t border-slate-100 bg-slate-50/60">
          <ul className="divide-y divide-slate-100">
            {group.chains.map((c) => (
              <li key={c.chain_id}>
                <button
                  onClick={() => onChainClick(c)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-white transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {c.role_title || "Unknown role"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatRelativeTime(c.last_event_at)}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
