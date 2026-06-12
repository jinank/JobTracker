"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { clearPendingLocation, readPendingLocation } from "@/lib/userLocation";

/** Saves sign-up location from localStorage after the user authenticates. */
export function PendingLocationSync() {
  const { status } = useSession();
  const synced = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || synced.current) return;

    const pending = readPendingLocation();
    if (!pending) return;

    synced.current = true;
    void fetch("/api/user/location")
      .then((res) => (res.ok ? res.json() : null))
      .then((existing) => {
        if (existing?.city && existing?.state && existing?.country) {
          clearPendingLocation();
          return null;
        }
        return fetch("/api/user/location", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pending),
        });
      })
      .then((res) => {
        if (res?.ok) clearPendingLocation();
      })
      .catch(() => {
        synced.current = false;
      });
  }, [status]);

  return null;
}
