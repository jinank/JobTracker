"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithSupabaseAccessToken } from "@/lib/authSignIn";
import { resolveCallbackUrl } from "@/lib/loginUrl";

function parseHashSession(): { access_token?: string; refresh_token?: string } {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get("access_token") ?? undefined,
    refresh_token: params.get("refresh_token") ?? undefined,
  };
}

function AuthCallbackInner() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing sign-in…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      const next = resolveCallbackUrl(searchParams.get("next"));
      const code = searchParams.get("code");
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      try {
        if (code || token_hash) {
          const res = await fetch("/api/auth/supabase-callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, token_hash, type }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            access_token?: string;
            error?: string;
          };
          if (!res.ok || !data.access_token) {
            throw new Error(
              data.error === "confirm_failed"
                ? "That sign-in link expired or was already used. Request a new email."
                : "Could not verify sign-in link. Request a new email."
            );
          }
          window.history.replaceState({}, "", `/auth/callback?next=${encodeURIComponent(next)}`);
          const result = await signInWithSupabaseAccessToken(data.access_token, next);
          if (result?.error && !cancelled) {
            setFailed(true);
            setMessage(result.error);
          }
          return;
        }

        const { access_token } = parseHashSession();
        if (access_token) {
          window.history.replaceState({}, "", `/auth/callback?next=${encodeURIComponent(next)}`);
          const result = await signInWithSupabaseAccessToken(access_token, next);
          if (result?.error && !cancelled) {
            setFailed(true);
            setMessage(result.error);
          }
          return;
        }

        if (!cancelled) {
          setFailed(true);
          setMessage("Invalid sign-in link. Request a new email below.");
        }
      } catch (e) {
        if (!cancelled) {
          setFailed(true);
          setMessage(
            e instanceof Error ? e.message : "Could not complete sign-in. Request a new email."
          );
        }
      }
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        {!failed && (
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        )}
        <p className="text-sm text-slate-700">{message}</p>
        {failed && (
          <a href="/login" className="mt-4 inline-block text-sm font-semibold text-scale-purple hover:underline">
            Back to sign in
          </a>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
