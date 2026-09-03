"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isInFlightStatus, type PublicTsentaApplication } from "@/lib/tsenta/types";

function keyFor(app: PublicTsentaApplication): string {
  return app.listingId || app.applyUrl;
}

export function useTsentaApply(enabled: boolean) {
  const [byKey, setByKey] = useState<Record<string, PublicTsentaApplication>>({});
  const [error, setError] = useState<string | null>(null);
  const inflight = useRef<Set<string>>(new Set());

  const upsert = useCallback((app: PublicTsentaApplication) => {
    setByKey((prev) => ({
      ...prev,
      [app.applyUrl]: app,
      ...(app.listingId ? { [app.listingId]: app } : {}),
    }));
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await fetch("/api/apply");
      if (res.status === 401) return;
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load auto-apply status");
        return;
      }
      const next: Record<string, PublicTsentaApplication> = {};
      for (const app of (data.applications ?? []) as PublicTsentaApplication[]) {
        next[app.applyUrl] = app;
        if (app.listingId) next[app.listingId] = app;
      }
      setByKey(next);
      setError(null);
    } catch {
      setError("Failed to load auto-apply status");
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const poll = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/apply/${id}`);
        const data = await res.json();
        if (res.ok && data.application) {
          upsert(data.application as PublicTsentaApplication);
        }
      } catch {
        /* keep last known status */
      }
    },
    [upsert]
  );

  useEffect(() => {
    const inflightApps = Object.values(byKey).filter((app) => isInFlightStatus(app.status));
    if (inflightApps.length === 0) return;
    const uniqueIds = [...new Set(inflightApps.map((app) => app.id))];
    const timer = window.setInterval(() => {
      uniqueIds.forEach((id) => {
        void poll(id);
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, [byKey, poll]);

  const apply = useCallback(
    async (input: { listingId: string; applyUrl: string }) => {
      const lock = input.listingId || input.applyUrl;
      if (inflight.current.has(lock)) return { ok: false as const, error: "Already applying." };
      inflight.current.add(lock);
      setError(null);
      try {
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: input.listingId, applyUrl: input.applyUrl }),
        });
        const data = await res.json();
        if (data.application) {
          upsert(data.application as PublicTsentaApplication);
        }
        if (data.unsupported === true && typeof data.applyUrl === "string") {
          return { ok: false as const, unsupported: true, applyUrl: data.applyUrl as string };
        }
        if (!res.ok) {
          const message = typeof data.error === "string" ? data.error : "Could not auto-apply.";
          setError(message);
          return {
            ok: false as const,
            error: message,
            needsProfile: data.needsProfile === true,
          };
        }
        return { ok: true as const, application: data.application as PublicTsentaApplication };
      } catch {
        const message = "Could not auto-apply.";
        setError(message);
        return { ok: false as const, error: message };
      } finally {
        inflight.current.delete(lock);
      }
    },
    [upsert]
  );

  const applying = useMemo(
    () => Object.values(byKey).some((app) => isInFlightStatus(app.status)),
    [byKey]
  );

  return { byKey, apply, refresh, error, applying };
}
