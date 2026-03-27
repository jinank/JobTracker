"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdminNav } from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    if (status === "unauthenticated") {
      router.replace(`/admin/login?callbackUrl=${encodeURIComponent(pathname || "/admin")}`);
    }
  }, [status, router, pathname, isLogin]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      {children}
    </div>
  );
}
