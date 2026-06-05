"use client";

import type { ReactNode } from "react";
import { AppNavAccountMenu } from "@/components/AppNavAccountMenu";

/**
 * Right-side app header slot with fixed footprint so layout stays stable
 * across Track Jobs, Find Jobs, etc. (with or without sync).
 */
export function AppHeaderActions({
  email,
  syncSlot,
  extra,
}: {
  email?: string | null;
  /** Sync button column — pass null to reserve empty space on non-track pages. */
  syncSlot?: ReactNode | null;
  extra?: ReactNode;
}) {
  return (
    <div className="flex w-full max-w-[21.5rem] items-center justify-end gap-2">
      <div className="flex w-[9.5rem] shrink-0 justify-end sm:w-[11rem]">
        {syncSlot}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {extra}
        <AppNavAccountMenu email={email} />
      </div>
    </div>
  );
}
