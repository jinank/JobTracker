"use client";

import type { JobListing } from "@/types/jobListing";
import {
  formatTableLocation,
  locationHasMultipleCities,
} from "@/lib/jobs/formatTableLocation";

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

const LEVEL_STYLES: Record<JobListing["experienceLevel"], string> = {
  Intern: "bg-violet-50 text-violet-700 ring-violet-100",
  Entry: "bg-sky-50 text-sky-700 ring-sky-100",
  Mid: "bg-amber-50 text-amber-800 ring-amber-100",
  Senior: "bg-orange-50 text-orange-800 ring-orange-100",
};

export function FindJobListCard({ job }: { job: JobListing }) {
  const locationLabel = formatTableLocation(job.location);
  const locationTitle = locationHasMultipleCities(job.location)
    ? job.location
    : undefined;
  const secondaryTags = [job.roleCategory, ...(job.tags ?? [])]
    .filter(Boolean)
    .filter((tag, index, arr) => arr.indexOf(tag) === index)
    .slice(0, 3);

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:border-blue-200/80 hover:shadow-card-hover sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarColor(job.company)} text-sm font-bold text-white shadow-sm`}
          aria-hidden
        >
          {companyInitials(job.company)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                  {job.title}
                </a>
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                <span>{job.company}</span>
                {job.salaryRange ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {job.salaryRange}
                  </span>
                ) : null}
              </div>
            </div>

            <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-slate-500">
              {postedLabel(job.postedDaysAgo)}
            </span>
          </div>

          {(job.companyWebsiteUrl || job.companyCareersUrl) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.companyWebsiteUrl ? (
                <a
                  href={job.companyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Website
                </a>
              ) : null}
              {job.companyCareersUrl ? (
                <a
                  href={job.companyCareersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  All job openings
                </a>
              ) : null}
            </div>
          )}

          {job.description ? (
            <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-700">
              {job.description}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
              title={locationTitle}
            >
              {locationLabel}
            </span>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${WORK_TYPE_STYLES[job.workType]}`}
            >
              {job.workType}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
              {job.employmentType}
            </span>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${LEVEL_STYLES[job.experienceLevel]}`}
            >
              {job.experienceLevel}
            </span>
            {secondaryTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg border border-scale-purple/25 bg-scale-mist/40 px-3 py-2 text-xs font-semibold text-scale-purple transition-colors hover:bg-scale-purple hover:text-white"
            >
              Apply
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
