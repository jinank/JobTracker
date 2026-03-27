"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  paid: boolean;
  subscription_status: string | null;
  student_verified: boolean;
  created_at: string;
  last_login_at: string | null;
  login_count: number | null;
  chain_count: number;
  indexed_messages_count: number;
  ai_tokens_total: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (res.status === 403) throw new Error("Access denied");
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then((data) => setUsers(data.users ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Users</h1>
      <p className="mt-1 text-sm text-slate-600">
        Accounts, usage, and sign-in stats. Open a row for full activity and token history.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3 text-right">Chains</th>
                <th className="px-4 py-3 text-right">Msgs</th>
                <th className="px-4 py-3 text-right">AI tokens</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u.id}`} className="group block min-w-0">
                      <span className="font-semibold text-blue-700 group-hover:underline">{u.email}</span>
                      {u.name && <span className="mt-0.5 block truncate text-xs text-slate-500">{u.name}</span>}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-slate-700">
                      {u.student_verified ? "Student" : u.paid ? "Paid" : u.subscription_status || "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">{u.chain_count}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">{u.indexed_messages_count}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    {u.ai_tokens_total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "—"}
                    {u.login_count != null && u.login_count > 0 && (
                      <span className="ml-1 text-slate-400">({u.login_count}×)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !error && (
            <p className="px-4 py-12 text-center text-sm text-slate-500">No users yet.</p>
          )}
        </div>
      )}
    </main>
  );
}
