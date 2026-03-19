"use client";

import { useState, useEffect, useCallback } from "react";
import type { Chain } from "@/types/chain";
import type { AppEvent } from "@/types/event";

export function useChains() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [paid, setPaid] = useState<boolean>(false);
  const [chainCount, setChainCount] = useState(0);
  const [limit, setLimit] = useState<number | null>(50);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/chains");
      if (!res.ok) return;
      const data = await res.json();
      setChains(data.chains ?? []);
      setPaid(data.paid ?? false);
      setChainCount(data.chainCount ?? 0);
      setLimit(data.limit ?? null);
    } catch {
      console.error("Failed to load chains");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { chains, paid, chainCount, limit, loading, refresh };
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
