"use client";

import { useState } from "react";
import { signInWithGoogleBasic } from "@/lib/authSignIn";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SignInForm({
  callbackUrl,
  errorBanner,
}: {
  callbackUrl: string;
  errorBanner?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMagicLink() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Enter your email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, callbackUrl }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not send sign-in email. Try Google sign-in.");
        return;
      }
      setEmailSent(true);
    } catch {
      setError("Network error. Try again or use Google sign-in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {errorBanner && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorBanner}
        </div>
      )}

      <div>
        {emailSent ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-4 text-sm text-emerald-900">
            <p className="font-semibold">Check your email</p>
            <p className="mt-1 text-emerald-800/90">
              We sent a sign-in link to <strong>{email.trim()}</strong>. Open it on this device to continue.
            </p>
          </div>
        ) : (
          <>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-600">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-scale-purple focus:ring-2 focus:ring-scale-purple/20"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => void sendMagicLink()}
              className="mt-3 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Continue with email"}
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              New here? Same link creates your account.
            </p>
          </>
        )}
      </div>

      <p className="my-6 text-center text-xs font-medium uppercase tracking-wide text-slate-400">or</p>

      <button
        type="button"
        onClick={() => void signInWithGoogleBasic(callbackUrl)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-800 hover:border-scale-purple/40 hover:bg-scale-mist/30"
      >
        <GoogleIcon />
        Continue with Google
      </button>
      <p className="mt-3 text-center text-xs text-slate-500 leading-relaxed">
        Google sign-in uses your profile only. We do not request Gmail on this step.
      </p>

      <p className="mt-6 rounded-xl border border-scale-purple/15 bg-scale-mist/40 px-4 py-3 text-xs text-slate-600 leading-relaxed">
        Want to <strong className="text-slate-800">track applications from Gmail</strong>? After you sign in, open
        Track Jobs and use <strong className="text-slate-800">Connect Gmail</strong> for read-only mail access.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
