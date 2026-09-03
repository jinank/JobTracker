"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { SiteNavMarketing } from "@/components/SiteNav";

export function TrackerPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);

  if (status === "loading" && !session) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <SiteNavMarketing />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Summer 2027 Internship Application Tracker
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-500">
            Track internship applications synced from Gmail in one pipeline dashboard.
          </p>
          <div className="mt-10 h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        </main>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <Dashboard />;
}
