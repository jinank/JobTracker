"use client";

import type { JobListing } from "@/types/jobListing";
import {
  formatTableLocation,
  locationHasMultipleCities,
} from "@/lib/jobs/formatTableLocation";
import { InternshipApplyButton } from "@/components/InternshipApplyButton";
import type { PublicTsentaApplication } from "@/lib/tsenta/types";

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

type InternshipTableProps = {
  jobs: JobListing[];
  loading?: boolean;
  emptyMessage?: string;
  showWorkType?: boolean;
  recencyField?: "posted" | "updated";
  recencyLabel?: string;
  autoApply?: boolean;
  applicationsByKey?: Record<string, PublicTsentaApplication>;
  profileReady?: boolean;
  onApply?: (job: JobListing) => void;
  onNeedProfile?: () => void;
};

export function InternshipTable({
  jobs,
  loading = false,
  emptyMessage = "No internships match your filters yet.",
  showWorkType = true,
  recencyField = "posted",
  recencyLabel = "Posted",
  autoApply = false,
  applicationsByKey,
  profileReady = false,
  onApply,
  onNeedProfile,
}: InternshipTableProps) {
  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center rounded-2xl border border-slate-200/80 bg-white py-16">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-scale-purple border-t-transparent"
          aria-label="Loading internships"
        />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50/90">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                Company
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                Role
              </th>
              <th scope="col" className="hidden px-4 py-3 font-semibold text-slate-700 md:table-cell sm:px-5">
                Location
              </th>
              {showWorkType ? (
                <th scope="col" className="hidden px-4 py-3 font-semibold text-slate-700 lg:table-cell sm:px-5">
                  Type
                </th>
              ) : null}
              <th scope="col" className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                {recencyLabel}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-slate-700 sm:px-5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => {
              const locationLabel = formatTableLocation(job.location);
              const locationTitle = locationHasMultipleCities(job.location)
                ? job.location
                : undefined;

              return (
              <tr key={job.id} className="group transition-colors hover:bg-slate-50/80">
                <td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">
                  {job.company}
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <div className="font-medium text-slate-800">{job.title}</div>
                  <div
                    className="mt-0.5 max-w-[14rem] truncate text-xs text-slate-500 md:hidden"
                    title={locationTitle}
                  >
                    {locationLabel}
                  </div>
                  {showWorkType ? (
                    <div className="mt-1 lg:hidden">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${WORK_TYPE_STYLES[job.workType]}`}
                      >
                        {job.workType}
                      </span>
                    </div>
                  ) : null}
                </td>
                <td
                  className="hidden max-w-[11rem] truncate px-4 py-3.5 text-slate-600 md:table-cell sm:px-5"
                  title={locationTitle}
                >
                  {locationLabel}
                </td>
                {showWorkType ? (
                  <td className="hidden px-4 py-3.5 lg:table-cell sm:px-5">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${WORK_TYPE_STYLES[job.workType]}`}
                    >
                      {job.workType}
                    </span>
                  </td>
                ) : null}
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 sm:px-5">
                  {postedLabel(
                    recencyField === "updated" ? job.updatedDaysAgo : job.postedDaysAgo
                  )}
                </td>
                <td className="px-4 py-3.5 text-right sm:px-5">
                  <InternshipApplyButton
                    job={job}
                    autoApply={autoApply}
                    application={
                      applicationsByKey?.[job.id] ?? applicationsByKey?.[job.applyUrl]
                    }
                    profileReady={profileReady}
                    onApply={onApply}
                    onNeedProfile={onNeedProfile}
                  />
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
