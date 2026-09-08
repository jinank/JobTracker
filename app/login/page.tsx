"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogoMark } from "@/components/LogoMark";
import { SignInForm } from "@/components/SignInForm";
import { signInWithSupabaseAccessToken } from "@/lib/authSignIn";
import { resolveCallbackUrl } from "@/lib/loginUrl";
import { SITE_NAME } from "@/lib/site";
function parseHashSession(): { access_token?: string; refresh_token?: string } {
  if (typeof window === "undefined") return {};
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get("access_token") ?? undefined,
    refresh_token: params.get("refresh_token") ?? undefined,
  };
}

function loginErrorMessage(code: string | null): string | null {
  if (code === "confirm_failed") {
    return "That sign-in link expired or was already used. Request a new email below.";
  }
  if (code === "missing_token") {
    return "Invalid sign-in link. Request a new email below.";
  }
  return null;
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [completingHash, setCompletingHash] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.hash.includes("access_token");
  });
  const callbackUrl = resolveCallbackUrl(searchParams.get("callbackUrl"));
  const errorBanner = completingHash ? null : loginErrorMessage(searchParams.get("error"));

  useEffect(() => {
    const { access_token } = parseHashSession();
    if (!access_token) return;

    setCompletingHash(true);
    let cancelled = false;

    async function completeFromHash() {
      const accessToken = access_token!;
      const next = resolveCallbackUrl(searchParams.get("callbackUrl"));
      window.history.replaceState({}, "", `/login?callbackUrl=${encodeURIComponent(next)}`);
      await signInWithSupabaseAccessToken(accessToken, next);
    }

    void completeFromHash();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading" || status === "authenticated" || completingHash) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen landing-hero-mesh flex flex-col">
      <div className="pointer-events-none absolute inset-0 landing-hero-grid" aria-hidden />
      <header className="relative border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} home`}>
            <LogoMark />
            <span className="text-lg font-bold text-slate-900 hidden sm:inline">{SITE_NAME}</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-scale-purple transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Sign in or create an account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Use email or Google. No Gmail access required to get started.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-scale-soft backdrop-blur-sm sm:p-8">
            <SignInForm callbackUrl={callbackUrl} errorBanner={errorBanner} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
