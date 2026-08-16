"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApplyProfilePublic } from "@/lib/tsenta/profile";

export type ApplyProfileState = {
  profile: ApplyProfilePublic | null;
  hasPdfResume: boolean;
  resumeFilename: string | null;
  ready: boolean;
  paid: boolean;
  configured: boolean;
  missingFields: string[];
  configuredMessage: string | null;
};

const EMPTY: ApplyProfileState = {
  profile: null,
  hasPdfResume: false,
  resumeFilename: null,
  ready: false,
  paid: false,
  configured: false,
  missingFields: [],
  configuredMessage: null,
};

export function useApplyProfile() {
  const [state, setState] = useState<ApplyProfileState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/apply/profile");
      if (res.status === 401) {
        setState(EMPTY);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load apply profile");
        return;
      }
      setState({
        profile: data.profile ?? null,
        hasPdfResume: data.hasPdfResume === true,
        resumeFilename: data.resumeFilename ?? null,
        ready: data.ready === true,
        paid: data.paid === true,
        configured: data.configured === true,
        missingFields: Array.isArray(data.missingFields) ? data.missingFields : [],
        configuredMessage: data.configuredMessage ?? null,
      });
      setError(null);
    } catch {
      setError("Failed to load apply profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (patch: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/apply/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to save apply profile");
        return false;
      }
      setState({
        profile: data.profile ?? null,
        hasPdfResume: data.hasPdfResume === true,
        resumeFilename: data.resumeFilename ?? null,
        ready: data.ready === true,
        paid: data.paid === true,
        configured: data.configured === true,
        missingFields: Array.isArray(data.missingFields) ? data.missingFields : [],
        configuredMessage: data.configuredMessage ?? null,
      });
      if (typeof data.syncError === "string" && data.syncError) {
        setError(data.syncError);
      }
      return true;
    } catch {
      setError("Failed to save apply profile");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { ...state, loading, saving, error, refresh, save };
}
