"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminHomePage() {
  const { data: session } = useSession();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin overview</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Signed in as <span className="font-medium text-slate-800">{session?.user?.email ?? "—"}</span>
        {session?.adminCredential ? (
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            Admin login
          </span>
        ) : null}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/users"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
        >
          <h2 className="text-lg font-bold text-slate-900">Users</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse accounts, sign-ins, Gmail sync / Reach Out activity, and OpenAI token totals.
          </p>
        </Link>
        <Link
          href="/admin/students"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
        >
          <h2 className="text-lg font-bold text-slate-900">Student verification</h2>
          <p className="mt-2 text-sm text-slate-600">Approve or reject student access requests.</p>
        </Link>
      </div>

      <p className="mt-10 text-xs text-slate-400">
        Run <code className="rounded bg-slate-100 px-1">supabase/migration_v6_admin_analytics.sql</code> if sign-in
        or token tables are missing.
      </p>
    </main>
  );
}
