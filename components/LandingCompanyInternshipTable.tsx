"use client";

import { useMemo, useState } from "react";
import type { JobListing } from "@/types/jobListing";
import {
  formatTableLocation,
  locationHasMultipleCities,
} from "@/lib/jobs/formatTableLocation";
import { groupJobsByCompany } from "@/lib/jobs/groupJobsByCompany";
import { InternshipApplyButton } from "@/components/InternshipApplyButton";

function postedLabel(days: number): string {
  if (days <= 1) return "Today";
  if (days <= 7) return `${days}d ago`;
  return `${days} days ago`;
}

function groupAddedDays(jobs: JobListing[]): number {
  return Math.min(...jobs.map((job) => job.updatedDaysAgo));
}

function groupLocationLabel(jobs: JobListing[]): { label: string; title?: string } {
  const labels = jobs.map((job) => formatTableLocation(job.location));
  const unique = [...new Set(labels)];
  if (unique.length === 1) {
    const job = jobs[0];
    return {
      label: unique[0],
      title: locationHasMultipleCities(job.location) ? job.location : undefined,
    };
  }
  return { label: "Multiple", title: unique.join(" · ") };
}

type Props = {
  jobs: JobListing[];
  loading?: boolean;
  emptyMessage?: string;
};

export function LandingCompanyInternshipTable({
  jobs,
  loading = false,
  emptyMessage = "Internships sync every few hours. Check back soon.",
}: Props) {
  const groups = useMemo(() => groupJobsByCompany(jobs), [jobs]);
  const [openKeys, setOpenKeys] = useState<Record<string, true>>({});

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

  if (groups.length === 0) {
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
              <th scope="col" className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                Added
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-slate-700 sm:px-5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groups.map((group) => {
              const multi = group.jobs.length > 1;
              const open = Boolean(openKeys[group.key]);
              const primary = group.jobs[0];
              const added = postedLabel(groupAddedDays(group.jobs));
              const location = groupLocationLabel(group.jobs);

              return (
                <CompanyGroupRows
                  key={group.key}
                  company={group.company}
                  jobs={group.jobs}
                  multi={multi}
                  open={open}
                  primary={primary}
                  added={added}
                  location={location}
                  onToggle={() =>
                    setOpenKeys((current) => {
                      if (current[group.key]) {
                        const next = { ...current };
                        delete next[group.key];
                        return next;
                      }
                      return { ...current, [group.key]: true };
                    })
                  }
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompanyGroupRows({
  company,
  jobs,
  multi,
  open,
  primary,
  added,
  location,
  onToggle,
}: {
  company: string;
  jobs: JobListing[];
  multi: boolean;
  open: boolean;
  primary: JobListing;
  added: string;
  location: { label: string; title?: string };
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="group transition-colors hover:bg-slate-50/80">
        <td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">{company}</td>
        <td className="px-4 py-3.5 sm:px-5">
          {multi ? (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className="flex w-full items-center gap-2 text-left font-medium text-slate-800"
            >
              <span>
                {jobs.length} positions
              </span>
              <svg
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <>
              <div className="font-medium text-slate-800">{primary.title}</div>
              <div
                className="mt-0.5 max-w-[14rem] truncate text-xs text-slate-500 md:hidden"
                title={location.title}
              >
                {location.label}
              </div>
            </>
          )}
        </td>
        <td
          className="hidden max-w-[11rem] truncate px-4 py-3.5 text-slate-600 md:table-cell sm:px-5"
          title={location.title}
        >
          {location.label}
        </td>
        <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 sm:px-5">{added}</td>
        <td className="px-4 py-3.5 text-right sm:px-5">
          {multi ? (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className="text-xs font-semibold text-scale-purple hover:text-scale-purple-dark"
            >
              {open ? "Hide roles" : "Show roles"}
            </button>
          ) : (
            <InternshipApplyButton job={primary} />
          )}
        </td>
      </tr>
      {multi && open
        ? jobs.map((job) => {
            const roleLocation = formatTableLocation(job.location);
            const roleLocationTitle = locationHasMultipleCities(job.location)
              ? job.location
              : undefined;
            return (
              <tr key={job.id} className="bg-slate-50/60">
                <td className="px-4 py-3 sm:px-5" aria-hidden />
                <td className="px-4 py-3 sm:px-5">
                  <div className="font-medium text-slate-800">{job.title}</div>
                  <div
                    className="mt-0.5 max-w-[14rem] truncate text-xs text-slate-500 md:hidden"
                    title={roleLocationTitle}
                  >
                    {roleLocation}
                  </div>
                </td>
                <td
                  className="hidden max-w-[11rem] truncate px-4 py-3 text-slate-600 md:table-cell sm:px-5"
                  title={roleLocationTitle}
                >
                  {roleLocation}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500 sm:px-5">
                  {postedLabel(job.updatedDaysAgo)}
                </td>
                <td className="px-4 py-3 text-right sm:px-5">
                  <InternshipApplyButton job={job} />
                </td>
              </tr>
            );
          })
        : null}
    </>
  );
}
