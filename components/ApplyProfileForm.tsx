"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { ApplyProfilePublic } from "@/lib/tsenta/profile";
import { US_STATES } from "@/lib/userLocation";

type Props = {
  profile: ApplyProfilePublic | null;
  hasPdfResume: boolean;
  resumeFilename: string | null;
  ready: boolean;
  paid?: boolean;
  configured: boolean;
  configuredMessage: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  onSave: (patch: Record<string, unknown>) => Promise<boolean>;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-scale-purple focus:outline-none focus:ring-2 focus:ring-scale-purple/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export function ApplyProfileForm({
  profile,
  hasPdfResume,
  resumeFilename,
  ready,
  paid = true,
  configured,
  configuredMessage,
  loading,
  saving,
  error,
  onSave,
}: Props) {
  const [form, setForm] = useState<ApplyProfilePublic | null>(profile);
  const [workdayPassword, setWorkdayPassword] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  if (loading || !form) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-24 animate-pulse rounded bg-slate-50" />
      </div>
    );
  }

  function update<K extends keyof ApplyProfilePublic>(key: K, value: ApplyProfilePublic[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSavedNote(null);
    const payload: Record<string, unknown> = { ...form };
    delete payload.hasWorkdayPassword;
    if (workdayPassword.trim()) payload.workdayPassword = workdayPassword.trim();
    const ok = await onSave(payload);
    if (ok) {
      setWorkdayPassword("");
      setSavedNote("Apply profile saved.");
    }
  }

  return (
    <form
      id="apply-profile"
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-bold text-slate-900">One-click apply</h2>
      <p className="mt-1 text-xs text-slate-600">
        We submit on the company ATS using your profile. Recruiter replies still go to your email.
      </p>

      {ready ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs text-emerald-900">
          Ready. Apply on a listing to submit immediately.
        </p>
      ) : (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
          {hasPdfResume
            ? "Fill the fields below, then save."
            : "Upload a PDF resume in Match for me, then finish this form."}
        </p>
      )}

      {resumeFilename ? (
        <p className="mt-2 text-xs text-slate-500">
          Resume: {resumeFilename}
          {hasPdfResume ? "" : " (PDF required for auto-apply)"}
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
          {error}
        </p>
      ) : null}
      {savedNote ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs text-emerald-900">
          {savedNote}
        </p>
      ) : null}
      {!paid ? (
        <p className="mt-3 text-xs text-slate-500">
          One-click apply is included with student and paid access. You can still save this profile.
        </p>
      ) : null}
      {!configured && configuredMessage ? (
        <p className="mt-3 text-xs text-slate-500">{configuredMessage}</p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="First name">
          <input
            className={inputClass}
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            required
          />
        </Field>
        <Field label="Last name">
          <input
            className={inputClass}
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Phone">
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 555 555 5555"
            required
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Street address">
          <input
            className={inputClass}
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="City">
          <input
            className={inputClass}
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            required
          />
        </Field>
        <Field label="State">
          <select
            className={inputClass}
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            required
          >
            <option value="">Select</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="ZIP">
          <input
            className={inputClass}
            value={form.zipCode}
            onChange={(e) => update("zipCode", e.target.value)}
            required
          />
        </Field>
        <Field label="Country">
          <input
            className={inputClass}
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="University">
          <input
            className={inputClass}
            value={form.university}
            onChange={(e) => update("university", e.target.value)}
            required
          />
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Degree">
          <input
            className={inputClass}
            value={form.degree}
            onChange={(e) => update("degree", e.target.value)}
            placeholder="B.S. Computer Science"
            required
          />
        </Field>
      </div>

      <fieldset className="mt-4 space-y-2">
        <legend className="mb-1 text-xs font-medium text-slate-600">Work details</legend>
        {[
          ["isOver18", "I am 18 or older"],
          ["isAuthorizedToWork", "Authorized to work in the US"],
          ["needsSponsorship", "I need visa sponsorship"],
          ["canWorkInPerson", "I can work in person"],
          ["canRelocate", "I can relocate"],
          ["canStartImmediately", "I can start when the internship begins"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(form[key as keyof ApplyProfilePublic])}
              onChange={(e) =>
                update(key as keyof ApplyProfilePublic, e.target.checked as never)
              }
              className="h-3.5 w-3.5 rounded border-slate-300 text-scale-purple focus:ring-scale-purple/30"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="mt-3">
        <Field
          label={
            form.hasWorkdayPassword
              ? "Workday password (saved - leave blank to keep)"
              : "Workday password (optional)"
          }
        >
          <input
            type="password"
            className={inputClass}
            value={workdayPassword}
            onChange={(e) => setWorkdayPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-4 w-full rounded-lg bg-scale-purple px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-scale-purple-dark disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save apply profile"}
      </button>
    </form>
  );
}
