"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";

export function HomePageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    router.replace(session?.adminCredential ? "/admin" : "/find-internships");
  }, [status, session, router]);

  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
      </div>
    );
  }

  return <LandingPage />;
}
