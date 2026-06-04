import { signIn } from "next-auth/react";

export const AUTH_PROVIDER_GOOGLE = "google";
export const AUTH_PROVIDER_GOOGLE_GMAIL = "google-gmail";
export const AUTH_PROVIDER_SUPABASE_EMAIL = "supabase-email";

/** Google sign-in without Gmail (Find Jobs, Interview Prep, Resources, etc.). */
export function signInWithGoogleBasic(callbackUrl?: string) {
  const url =
    callbackUrl ??
    (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  return signIn(AUTH_PROVIDER_GOOGLE, { callbackUrl: url });
}

/** Google sign-in with read-only Gmail (Track Jobs only). */
export function signInWithGmailTracking(callbackUrl = "/") {
  return signIn(AUTH_PROVIDER_GOOGLE_GMAIL, { callbackUrl });
}

/** Bridge Supabase magic-link session into NextAuth. */
export function signInWithSupabaseAccessToken(accessToken: string, callbackUrl = "/") {
  return signIn(AUTH_PROVIDER_SUPABASE_EMAIL, {
    access_token: accessToken,
    redirect: true,
    callbackUrl,
  });
}
