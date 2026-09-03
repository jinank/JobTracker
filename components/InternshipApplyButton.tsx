"use client";

import type { ReactNode } from "react";
import type { JobListing } from "@/types/jobListing";
import { isInFlightStatus, type PublicTsentaApplication } from "@/lib/tsenta/types";

const linkClass =
  "inline-flex rounded-lg border border-scale-purple/25 bg-scale-mist/40 px-3 py-1.5 text-xs font-semibold text-scale-purple transition-colors hover:bg-scale-purple hover:text-white";

const buttonClass =
  "inline-flex rounded-lg border border-scale-purple/25 bg-scale-mist/40 px-3 py-1.5 text-xs font-semibold text-scale-purple transition-colors hover:bg-scale-purple hover:text-white disabled:cursor-wait disabled:opacity-70";

type Props = {
  job: JobListing;
  autoApply?: boolean;
  application?: PublicTsentaApplication;
  profileReady?: boolean;
  onApply?: (job: JobListing) => void;
  onNeedProfile?: () => void;
};

export function InternshipApplyButton({
  job,
  autoApply = false,
  application,
  profileReady = false,
  onApply,
  onNeedProfile,
}: Props) {
  let applyControl: ReactNode;

  if (application?.status === "submitted") {
    applyControl = (
      <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
        Applied
      </span>
    );
  } else if (application && isInFlightStatus(application.status)) {
    applyControl = (
      <span className="inline-flex rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
        Applying…
      </span>
    );
  } else if (application?.status === "failed") {
    applyControl = (
      <span className="inline-flex flex-col items-end gap-1">
        <span
          className="text-[10px] font-medium text-amber-800"
          title={application.failureReason ?? "Application failed"}
        >
          Failed
        </span>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Apply on site
        </a>
      </span>
    );
  } else if (!autoApply) {
    applyControl = (
      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Apply
      </a>
    );
  } else if (!profileReady) {
    applyControl = (
      <button type="button" onClick={onNeedProfile} className={buttonClass}>
        Apply
      </button>
    );
  } else {
    applyControl = (
      <button type="button" onClick={() => onApply?.(job)} className={buttonClass}>
        Apply
      </button>
    );
  }

  return applyControl;
}
