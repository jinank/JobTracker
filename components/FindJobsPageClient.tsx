"use client";

import { useSession } from "next-auth/react";
import { FindJobsApp } from "@/components/FindJobsApp";
import { HiddenJobsLanding } from "@/components/HiddenJobsLanding";
import { SiteNavMarketing } from "@/components/SiteNav";

export function FindJobsPageClient() {
  const { data: session, status } = useSession();

  if (status === "loading" && !session) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SiteNavMarketing />
        <main className="flex-1">
          <HiddenJobsLanding />
        </main>
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
