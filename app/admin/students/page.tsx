"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Verification {
  id: string;
  user_id: string;
  full_name: string;
  student_email: string;
  university: string;
  linkedin_url: string | null;
  graduation_year: number | null;
  status: string;
  reviewed_at: string | null;
  created_at: string;
  users: { email: string };
}

export default function AdminStudentsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/students")
      .then((res) => {
        if (res.status === 403) throw new Error("Access denied");
        return res.json();
      })
      .then((data) => setVerifications(data.verifications ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActing(id);
    try {
      const res = await fetch("/api/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      fetchData();
    } catch {
      setError("Failed to update verification");
    } finally {
      setActing(null);
    }
  };

  const pending = verifications.filter((v) => v.status === "pending");
  const reviewed = verifications.filter((v) => v.status !== "pending");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-slate-900">Rethinkjobs</h1>
          </Link>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Admin Panel</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Student Verification Requests</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : verifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-400">No verification requests yet.</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">
                  Pending ({pending.length})
                </h3>
                <div className="space-y-3">
                  {pending.map((v) => (
                    <div key={v.id} className="bg-white rounded-xl border border-amber-200 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-sm font-semibold text-slate-900">{v.full_name}</h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                              Pending
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                            <div>
                              <span className="text-slate-400">Account:</span>{" "}
                              <span className="text-slate-700">{v.users.email}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Student email:</span>{" "}
                              <span className="text-slate-700">{v.student_email}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">University:</span>{" "}
                              <span className="text-slate-700">{v.university}</span>
                            </div>
                            {v.graduation_year && (
                              <div>
                                <span className="text-slate-400">Graduation:</span>{" "}
                                <span className="text-slate-700">{v.graduation_year}</span>
                              </div>
                            )}
                            {v.linkedin_url && (
                              <div className="sm:col-span-2">
                                <span className="text-slate-400">LinkedIn:</span>{" "}
                                <a href={v.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {v.linkedin_url}
                                </a>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-2">
                            Submitted {new Date(v.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleAction(v.id, "approve")}
                            disabled={acting === v.id}
                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(v.id, "reject")}
                            disabled={acting === v.id}
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            Reject
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
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Reviewed ({reviewed.length})
                </h3>
                <div className="space-y-2">
                  {reviewed.map((v) => (
                    <div key={v.id} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-medium text-slate-700">{v.full_name}</h4>
                          <span className="text-xs text-slate-400">{v.university}</span>
                          <span className="text-xs text-slate-400">{v.users.email}</span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            v.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {v.status === "approved" ? "Approved" : "Rejected"}
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
    </div>
  );
}
