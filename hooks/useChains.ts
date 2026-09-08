"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Chain } from "@/types/chain";
import type { AppEvent } from "@/types/event";
import { chainsDataEqual } from "@/lib/chainsSnapshot";
import { FREE_TIER_LIMIT } from "@/lib/freeTier";

export function useChains() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [paid, setPaid] = useState<boolean>(false);
  const [studentVerified, setStudentVerified] = useState<boolean>(false);
  const [hasProSubscription, setHasProSubscription] = useState<boolean>(false);
  const [chainCount, setChainCount] = useState(0);
  const [limit, setLimit] = useState<number | null>(FREE_TIER_LIMIT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);

  const refresh = useCallback(async () => {
    const showBlockingLoader = !hasLoadedOnce.current;
    if (showBlockingLoader) setLoading(true);
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
      const nextChains = (data.chains ?? []) as Chain[];

      setChains((prev) =>
        chainsDataEqual(prev, nextChains) ? prev : nextChains
      );
      setPaid(data.paid ?? false);
      setStudentVerified(data.studentVerified ?? false);
      setHasProSubscription(data.hasProSubscription ?? false);
      setChainCount(data.chainCount ?? 0);
      setLimit(data.limit ?? null);
      hasLoadedOnce.current = true;
    } catch (e) {
      console.error("Failed to load chains", e);
      setError("Failed to load chains");
    } finally {
      if (showBlockingLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    chains,
    paid,
    studentVerified,
    hasProSubscription,
    chainCount,
    limit,
    loading,
    error,
    refresh,
  };
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
