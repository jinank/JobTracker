"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Chain } from "@/types/chain";

export interface Notification {
  id: string;
  chainId: string;
  company: string;
  role: string;
  status: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = "rethinkjobs_notifications";
const SEEN_KEY = "rethinkjobs_seen_chains";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function useNotifications(chains: Chain[]) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage<Notification[]>(STORAGE_KEY, [])
  );
  const prevRef = useRef<Map<string, string>>(new Map());
  const initialized = useRef(false);

  useEffect(() => {
    if (!chains.length) return;

    const seen: Record<string, string> = loadFromStorage(SEEN_KEY, {});
    const prevMap = prevRef.current;

    if (!initialized.current) {
      for (const c of chains) {
        prevMap.set(c.chain_id, c.status);
        if (!seen[c.chain_id]) {
          seen[c.chain_id] = c.status;
        }
      }
      saveToStorage(SEEN_KEY, seen);
      initialized.current = true;
      return;
    }

    const newNotifs: Notification[] = [];

    for (const chain of chains) {
      const oldStatus = prevMap.get(chain.chain_id) ?? seen[chain.chain_id];

      if (oldStatus && oldStatus !== chain.status) {
        newNotifs.push({
          id: `${chain.chain_id}-${chain.status}-${Date.now()}`,
          chainId: chain.chain_id,
          company: chain.canonical_company,
          role: chain.role_title || "Unknown role",
          status: chain.status,
          timestamp: Date.now(),
          read: false,
        });
      }

      prevMap.set(chain.chain_id, chain.status);
      seen[chain.chain_id] = chain.status;
    }

    if (newNotifs.length > 0) {
      setNotifications((prev) => {
        const updated = [...newNotifs, ...prev].slice(0, 50);
        saveToStorage(STORAGE_KEY, updated);
        return updated;
      });
    }

    saveToStorage(SEEN_KEY, seen);
  }, [chains]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToStorage(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveToStorage(STORAGE_KEY, []);
  }, []);

  return { notifications, unreadCount, markAllRead, clearAll };
}
