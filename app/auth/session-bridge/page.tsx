"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithSupabaseAccessToken } from "@/lib/authSignIn";
import { resolveCallbackUrl } from "@/lib/loginUrl";

function SessionBridgeInner() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing sign-in…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const next = resolveCallbackUrl(searchParams.get("next"));

    if (!accessToken) {
      setFailed(true);
      setMessage("Sign-in link was incomplete. Request a new email or use Google.");
      return;
    }

    void signInWithSupabaseAccessToken(accessToken, next).then((result) => {
      if (result?.error) {
        setFailed(true);
        setMessage(result.error);
      }
    });
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

export default function SessionBridgePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        </div>
      }
    >
      <SessionBridgeInner />
    </Suspense>
  );
}
