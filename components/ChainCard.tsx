"use client";

import Link from "next/link";
import type { Chain } from "@/types/chain";
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

export function ChainCard({
  chain,
  onClick,
}: {
  chain: Chain;
  onClick: () => void;
}) {
  const reachOutUrl = `/reach-out?company=${encodeURIComponent(chain.canonical_company)}&chainId=${chain.chain_id}${chain.role_title ? `&role=${encodeURIComponent(chain.role_title)}` : ""}`;

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 p-4 shadow-card hover:shadow-card-hover hover:border-blue-200/80 transition-all duration-200 group animate-fade-in flex items-center gap-3">
      <button
        onClick={onClick}
        className="flex-1 min-w-0 text-left"
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColor(chain.canonical_company)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
          >
            {companyInitials(chain.canonical_company)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                {chain.canonical_company}
              </h3>
              <StatusBadge status={chain.status} />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-slate-500 truncate">
                {chain.role_title || "Unknown role"}
              </p>
              <span className="text-xs text-slate-400 shrink-0 ml-2">
                {formatRelativeTime(chain.last_event_at)}
              </span>
            </div>
          </div>
        </div>
      </button>
      <Link
        href={reachOutUrl}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 px-3 py-2 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-colors"
      >
        Reach Out
      </Link>
    </div>
  );
}
