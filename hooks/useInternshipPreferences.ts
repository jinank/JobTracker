"use client";

import { useCallback, useEffect, useState } from "react";
import type { InternshipPreferencesRecord } from "@/lib/internshipPreferences";

const EMPTY: InternshipPreferencesRecord = {
  preferredRoles: [],
  resumeFilename: null,
  resumeKeywords: [],
  matchEnabled: false,
  hasResume: false,
};

export function useInternshipPreferences() {
  const [prefs, setPrefs] = useState<InternshipPreferencesRecord>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/user/internship-preferences");
      if (res.status === 401) {
        setPrefs(EMPTY);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data.hint === "string"
            ? `${data.error} ${data.hint}`
            : data.error ?? "Failed to load preferences"
        );
        return;
      }
      setPrefs(data);
    } catch {
      setError("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const savePrefs = useCallback(
    async (patch: Partial<InternshipPreferencesRecord>) => {
      setSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/user/internship-preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to save");
          return false;
        }
        setPrefs(data);
        return true;
      } catch {
        setError("Failed to save");
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const uploadResume = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("resume", file);
      const res = await fetch("/api/user/internship-preferences/resume", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data.hint === "string"
            ? `${data.error} ${data.hint}`
            : data.error ?? "Upload failed"
        );
        return null;
      }
      setPrefs(data);
      return data as InternshipPreferencesRecord & {
        suggestedRoles?: string[];
        keywordsAdded?: string[];
      };
    } catch {
      setError("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const removeResume = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/user/internship-preferences/resume", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to remove resume");
        return false;
      }
      setPrefs(data);
      return true;
    } catch {
      setError("Failed to remove resume");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    prefs,
    loading,
    saving,
    uploading,
    error,
    refresh,
    savePrefs,
    uploadResume,
    removeResume,
  };
}
