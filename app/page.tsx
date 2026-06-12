"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Signed-in home is Find Internships; admins go to the admin panel 
  useEffect(() => {
    if (status !== "authenticated") return;
    router.replace(session?.adminCredential ? "/admin" : "/find-jobs");
  }, [status, session, router]);

  if (status === "loading" && !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
    </div>
  );
}
