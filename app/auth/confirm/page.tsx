"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithSupabaseAccessToken } from "@/lib/authSignIn";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

function AuthConfirmInner() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing sign-in…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      const next = searchParams.get("next") ?? "/";
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        if (!cancelled) {
          setFailed(true);
          setMessage("Email sign-in is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        }
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.access_token) {
        if (!cancelled) {
          setFailed(true);
          setMessage(
            "Could not verify your link. Request a new sign-in email or use Continue with Google (no Gmail access)."
          );
        }
        return;
      }

      const result = await signInWithSupabaseAccessToken(data.session.access_token, next);
      if (result?.error && !cancelled) {
        setFailed(true);
        setMessage(result.error);
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
          <a href="/" className="mt-4 inline-block text-sm font-semibold text-scale-purple hover:underline">
            Back to home
          </a>
        )}
      </div>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        </div>
      }
    >
      <AuthConfirmInner />
    </Suspense>
  );
}
