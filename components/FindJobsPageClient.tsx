"use client";

import { useSession } from "next-auth/react";
import { FindJobsApp } from "@/components/FindJobsApp";
import { HiddenJobsLanding } from "@/components/HiddenJobsLanding";
import { SiteNavMarketing } from "@/components/SiteNav";

export function FindJobsPageClient() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SiteNavMarketing />
        <div className="flex flex-1 items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return <FindJobsApp />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteNavMarketing />
      <main className="flex-1">
        <HiddenJobsLanding />
      </main>
    </div>
  );
}
