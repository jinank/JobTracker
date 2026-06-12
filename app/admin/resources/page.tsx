"use client";

import { useEffect, useState } from "react";
import { resourceTitle } from "@/lib/rethinkJobsResources";

interface AccessRequest {
  id: string;
  user_id: string;
  resource_id: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  users: { email: string };
}

export default function AdminResourceAccessPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/resource-access")
      .then((res) => {
        if (res.status === 403) throw new Error("Access denied");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.hint ? `${data.error} ${data.hint}` : data.error);
        setRequests(data.requests ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, action: "approve" | "dismiss") => {
    setActing(id);
    try {
      const res = await fetch("/api/admin/resource-access", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      fetchData();
    } catch {
      setError("Failed to update request");
    } finally {
      setActing(null);
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const reviewed = requests.filter((r) => r.status !== "pending");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h2 className="mb-2 text-xl font-bold text-slate-900">Member resource requests</h2>
      <p className="mb-6 text-sm text-slate-600">
        Students requesting access to LinkedIn review, resume review, and headshot tools.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-400">No resource access requests yet.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-600">
                Pending ({pending.length})
              </h3>
              <div className="space-y-3">
                {pending.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-amber-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {resourceTitle(r.resource_id)}
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          <span className="text-slate-400">Student:</span> {r.users.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Requested {new Date(r.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAction(r.id, "approve")}
                          disabled={acting === r.id}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(r.id, "dismiss")}
                          disabled={acting === r.id}
                          className="rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviewed.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Reviewed ({reviewed.length})
              </h3>
              <div className="space-y-2">
                {reviewed.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">
                          {resourceTitle(r.resource_id)}
                        </span>
                        <span className="text-xs text-slate-400">{r.users.email}</span>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          r.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {r.status === "approved" ? "Approved" : "Dismissed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
