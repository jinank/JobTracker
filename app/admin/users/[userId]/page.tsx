"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DetailResponse {
  user: Record<string, unknown>;
  stats: {
    chains: number;
    events: number;
    indexed_messages: number;
    ai_tokens_total: number;
    ai_calls_recorded: number;
  };
  sign_ins: { id: string; email: string; provider: string; created_at: string }[];
  activities: { id: string; action: string; meta: Record<string, unknown> | null; created_at: string }[];
  ai_usage_recent: {
    id: string;
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    source: string;
    created_at: string;
  }[];
  payments: Record<string, unknown>[];
  student_verifications: Record<string, unknown>[];
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [data, setData] = useState<DetailResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/admin/users/${userId}`)
      .then((res) => {
        if (res.status === 403) throw new Error("Access denied");
        if (res.status === 404) throw new Error("User not found");
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-red-600">{error || "Error"}</p>
        <Link href="/admin/users" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← Back to users
        </Link>
      </main>
    );
  }

  const u = data.user as {
    email: string;
    name: string | null;
    image: string | null;
    paid: boolean;
    student_verified: boolean;
    subscription_status: string | null;
    created_at: string;
    last_login_at: string | null;
    login_count: number | null;
    google_sub: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/admin/users" className="text-sm font-medium text-blue-600 hover:underline">
        ← All users
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        {u.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.image} alt="" className="h-16 w-16 rounded-xl border border-slate-200" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 text-lg font-bold text-slate-600">
            {(u.email[0] ?? "?").toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{u.email}</h1>
          {u.name && <p className="text-slate-600">{u.name}</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">
              {u.student_verified ? "Student verified" : u.paid ? "Paid" : "Free / standard"}
            </span>
            {u.subscription_status && (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">Status: {u.subscription_status}</span>
            )}
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Applications (chains)", data.stats.chains],
          ["Timeline events", data.stats.events],
          ["Indexed Gmail messages", data.stats.indexed_messages],
          ["OpenAI tokens (total)", data.stats.ai_tokens_total.toLocaleString()],
          ["Classify API calls logged", data.stats.ai_calls_recorded],
          ["Logins (sessions recorded)", u.login_count ?? "—"],
        ].map(([label, val]) => (
          <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{val}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Account</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <dt className="text-slate-500">User ID</dt>
            <dd className="font-mono text-xs text-slate-800">{userId}</dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="text-slate-500">Created</dt>
            <dd className="text-slate-800">{u.created_at ? new Date(u.created_at).toLocaleString() : "—"}</dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="text-slate-500">Last login (profile)</dt>
            <dd className="text-slate-800">{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "—"}</dd>
          </div>
          {u.google_sub && (
            <div className="flex flex-wrap gap-2">
              <dt className="text-slate-500">Google sub</dt>
              <dd className="break-all font-mono text-xs text-slate-700">{u.google_sub}</dd>
            </div>
          )}
          {(u.stripe_customer_id || u.stripe_subscription_id) && (
            <div className="flex flex-wrap gap-2">
              <dt className="text-slate-500">Stripe</dt>
              <dd className="break-all text-xs text-slate-700">
                {u.stripe_customer_id && <span>customer: {u.stripe_customer_id} </span>}
                {u.stripe_subscription_id && <span>sub: {u.stripe_subscription_id}</span>}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Recent sign-ins</h2>
        <p className="text-xs text-slate-500">Recorded on each Google login (after migration).</p>
        <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {data.sign_ins.length === 0 ? (
            <li className="px-4 py-6 text-sm text-slate-500">No rows yet.</li>
          ) : (
            data.sign_ins.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
                <span className="text-slate-800">{new Date(s.created_at).toLocaleString()}</span>
                <span className="text-xs text-slate-500">
                  {s.provider} · {s.email}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Activity</h2>
        <p className="text-xs text-slate-500">Gmail syncs, Reach Out lookups, etc.</p>
        <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {data.activities.length === 0 ? (
            <li className="px-4 py-6 text-sm text-slate-500">No rows yet.</li>
          ) : (
            data.activities.map((a) => (
              <li key={a.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-slate-800">{a.action}</span>
                  <span className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</span>
                </div>
                {a.meta && Object.keys(a.meta).length > 0 && (
                  <pre className="mt-2 max-h-32 overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                    {JSON.stringify(a.meta, null, 2)}
                  </pre>
                )}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Recent AI usage (classify)</h2>
        <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white text-sm">
          {data.ai_usage_recent.length === 0 ? (
            <li className="px-4 py-6 text-slate-500">No token rows yet.</li>
          ) : (
            data.ai_usage_recent.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
                <span className="text-slate-700">
                  {r.total_tokens.toLocaleString()} tok · {r.model}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(r.created_at).toLocaleString()} · {r.source}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      {data.payments.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Payments</h2>
          <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white text-sm">
            {data.payments.map((p) => (
              <li key={String(p.id)} className="px-4 py-2 text-slate-700">
                {(p.amount_cents as number) / 100} {String(p.currency)} · {String(p.status)} ·{" "}
                {p.created_at ? new Date(String(p.created_at)).toLocaleString() : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.student_verifications.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Student verification</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.student_verifications.map((v) => (
              <li key={String(v.id)} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <span className="font-medium">{String(v.full_name)}</span> · {String(v.status)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
