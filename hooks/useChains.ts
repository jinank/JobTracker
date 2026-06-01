"use client";

import { useState, useEffect, useCallback } from "react";
import type { Chain } from "@/types/chain";
import type { AppEvent } from "@/types/event";

export function useChains() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [paid, setPaid] = useState<boolean>(false);
  const [studentVerified, setStudentVerified] = useState<boolean>(false);
  const [chainCount, setChainCount] = useState(0);
  const [limit, setLimit] = useState<number | null>(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chains");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          typeof data.error === "string"
            ? data.error
            : "Failed to load chains"
        );
        return;
      }
      const data = await res.json();
      setChains(data.chains ?? []);
      setPaid(data.paid ?? false);
      setStudentVerified(data.studentVerified ?? false);
      setChainCount(data.chainCount ?? 0);
      setLimit(data.limit ?? null);
    } catch (e) {
      console.error("Failed to load chains", e);
      setError("Failed to load chains");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { chains, paid, studentVerified, chainCount, limit, loading, error, refresh };
}

export function useChainEvents(chainId: string | null) {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chainId) {
      setEvents([]);
      return;
    }

    setLoading(true);
    fetch(`/api/chains/${chainId}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [chainId]);

  return { events, loading };
}
