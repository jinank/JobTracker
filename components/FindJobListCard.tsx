"use client";

import type { HiddenJob } from "@/lib/hiddenJobsData";

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
  if (days <= 1) return "Posted today";
  return `Posted ${days} days ago`;
}

export function FindJobListCard({ job }: { job: HiddenJob }) {
  return (
    <article className="w-full bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-card hover:shadow-card-hover hover:border-blue-200/80 transition-all duration-200 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColor(job.company)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
        >
          {companyInitials(job.company)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                Company career page
              </p>
              <h2 className="text-sm font-semibold text-slate-900">{job.company}</h2>
              <p className="mt-0.5 text-sm font-medium text-slate-800">{job.title}</p>
            </div>
            <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {job.workType}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>{job.location}</span>
            <span className="text-slate-300" aria-hidden>
              ·
            </span>
            <span>{postedLabel(job.postedDaysAgo)}</span>
            <span className="text-slate-300" aria-hidden>
              ·
            </span>
            <span>{job.employmentType}</span>
            <span className="text-slate-300" aria-hidden>
              ·
            </span>
            <span>{job.experienceLevel} level</span>
          </div>

          {job.salaryRange ? (
            <p className="mt-2 text-xs font-medium text-slate-700">{job.salaryRange}</p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end sm:w-36">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Apply on site
          </a>
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[11px] font-medium text-slate-500 hover:text-blue-600 transition-colors truncate max-w-full"
            title={job.applyUrl}
          >
            View posting
          </a>
        </div>
      </div>
    </article>
  );
}
