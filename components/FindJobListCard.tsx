"use client";

import type { JobListing } from "@/types/jobListing";

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
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-600",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function postedLabel(days: number): string {
  if (days <= 1) return "Today";
  if (days <= 7) return `${days}d ago`;
  return `${days} days ago`;
}

const WORK_TYPE_STYLES: Record<JobListing["workType"], string> = {
  Remote: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Hybrid: "bg-blue-50 text-blue-700 ring-blue-100",
  "On-site": "bg-amber-50 text-amber-800 ring-amber-100",
};

export function FindJobListCard({ job }: { job: JobListing }) {
  return (
    <article className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:border-blue-200/80 hover:shadow-card-hover">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarColor(job.company)} text-sm font-bold text-white shadow-sm`}
        aria-hidden
      >
        {companyInitials(job.company)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h2 className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
            {job.title}
          </h2>
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${WORK_TYPE_STYLES[job.workType]}`}
          >
            {job.workType}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-slate-600">{job.company}</p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
          <span className="truncate">{job.location}</span>
          <span className="text-slate-300" aria-hidden>
            ·
          </span>
          <span className="shrink-0">{postedLabel(job.postedDaysAgo)}</span>
          <span className="text-slate-300" aria-hidden>
            ·
          </span>
          <span className="shrink-0">Internship</span>
          {job.salaryRange ? (
            <>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <span className="shrink-0 font-medium text-slate-700">{job.salaryRange}</span>
            </>
          ) : null}
        </p>
      </div>

      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg border border-blue-200/60 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
      >
        Apply
      </a>
    </article>
  );
}
