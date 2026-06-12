"use client";

import { useRef, useState } from "react";
import { ROLE_CATEGORIES } from "@/lib/jobs/constants";
import type { InternshipPreferencesRecord } from "@/lib/internshipPreferences";

const ROLE_OPTIONS = ROLE_CATEGORIES.filter((r) => r !== "All roles");

type Props = {
  prefs: InternshipPreferencesRecord;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  error: string | null;
  onSavePrefs: (patch: Partial<InternshipPreferencesRecord>) => Promise<boolean>;
  onUploadResume: (file: File) => Promise<(InternshipPreferencesRecord & {
    suggestedRoles?: string[];
    keywordsAdded?: string[];
  }) | null>;
  onRemoveResume: () => Promise<boolean>;
  onPreferencesChange?: () => void;
};

export function InternshipMatchPanel({
  prefs,
  loading,
  saving,
  uploading,
  error,
  onSavePrefs,
  onUploadResume,
  onRemoveResume,
  onPreferencesChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadNote, setUploadNote] = useState<string | null>(null);

  const selectedRoles = prefs.preferredRoles;
  const canMatch =
    selectedRoles.length > 0 || prefs.resumeKeywords.length > 0;

  async function toggleRole(role: string) {
    const next = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    const ok = await onSavePrefs({ preferredRoles: next });
    if (ok) onPreferencesChange?.();
  }

  async function handleToggleMatch(enabled: boolean) {
    if (enabled && !canMatch) return;
    const ok = await onSavePrefs({ matchEnabled: enabled });
    if (ok) onPreferencesChange?.();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadNote(null);
    const result = await onUploadResume(file);
    if (result) {
      const roles = result.suggestedRoles?.length
        ? ` Roles: ${result.suggestedRoles.join(", ")}.`
        : "";
      const kw = result.keywordsAdded?.length
        ? ` ${result.keywordsAdded.length} skills detected.`
        : "";
      setUploadNote(`Resume saved.${roles}${kw}`);
      onPreferencesChange?.();
    }
  }

  async function handleRemoveResume() {
    setUploadNote(null);
    const ok = await onRemoveResume();
    if (ok) onPreferencesChange?.();
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-violet-200/80 bg-gradient-to-b from-violet-50/90 to-white p-4">
        <div className="h-4 w-32 animate-pulse rounded bg-violet-100" />
        <div className="mt-3 h-20 animate-pulse rounded bg-violet-50" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-violet-200/80 bg-gradient-to-b from-violet-50/90 to-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-slate-900">Match for me</h2>
        <p className="mt-1 text-xs text-slate-600">
          Upload your resume and pick roles you want. We&apos;ll surface
          internships that fit your background.
        </p>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
          {error}
        </p>
      )}

      {uploadNote && (
        <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs text-emerald-900">
          {uploadNote}
        </p>
      )}

      <div className="mb-4">
        <span className="mb-1.5 block text-xs font-medium text-slate-600">
          Resume (PDF or TXT)
        </span>
        {prefs.resumeFilename ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="truncate text-xs text-slate-700">
              {prefs.resumeFilename}
            </span>
            <button
              type="button"
              onClick={handleRemoveResume}
              disabled={saving}
              className="shrink-0 text-xs font-semibold text-slate-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-lg border border-dashed border-violet-300 bg-white px-3 py-2.5 text-xs font-semibold text-violet-800 transition-colors hover:border-violet-400 hover:bg-violet-50/50 disabled:opacity-60"
            >
              {uploading ? "Reading resume…" : "Upload resume"}
            </button>
          </>
        )}
      </div>

      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-medium text-slate-600">
          Preferred roles
        </legend>
        <div className="space-y-2">
          {ROLE_OPTIONS.map((role) => (
            <label
              key={role}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-1 py-0.5 text-xs text-slate-700 hover:bg-white/80"
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-scale-purple focus:ring-scale-purple/30"
              />
              {role}
            </label>
          ))}
        </div>
      </fieldset>

      {prefs.resumeKeywords.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-medium text-slate-600">
            From your resume
          </p>
          <div className="flex flex-wrap gap-1">
            {prefs.resumeKeywords.slice(0, 12).map((k) => (
              <span
                key={k}
                className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-800"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <input
          type="checkbox"
          checked={prefs.matchEnabled}
          disabled={!canMatch || saving}
          onChange={(e) => handleToggleMatch(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-scale-purple focus:ring-scale-purple/30 disabled:opacity-40"
        />
        <span className="text-xs text-slate-700">
          <span className="font-semibold text-slate-900">
            Show only relevant internships
          </span>
          {!canMatch && (
            <span className="mt-0.5 block text-slate-500">
              Upload a resume or select at least one role first.
            </span>
          )}
        </span>
      </label>
    </div>
  );
}
