import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { resolveCallbackUrl } from "@/lib/loginUrl";

/** Supabase magic-link landing: exchange code/token, then bridge into NextAuth. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") ?? "email";
  const next = resolveCallbackUrl(url.searchParams.get("next"));

  if (!code && !token_hash) {
    return NextResponse.redirect(
      new URL(`/login?error=missing_token&callbackUrl=${encodeURIComponent(next)}`, url.origin)
    );
  }

  try {
    const supabase = getSupabase();
    let accessToken: string | undefined;

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error || !data.session?.access_token) {
        console.error("[auth/callback] exchangeCodeForSession:", error?.message);
        return NextResponse.redirect(
          new URL(`/login?error=confirm_failed&callbackUrl=${encodeURIComponent(next)}`, url.origin)
        );
      }
      accessToken = data.session.access_token;
    } else if (token_hash) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as "email" | "signup" | "invite" | "recovery" | "email_change",
      });
      if (error || !data.session?.access_token) {
        console.error("[auth/callback] verifyOtp:", error?.message);
        return NextResponse.redirect(
          new URL(`/login?error=confirm_failed&callbackUrl=${encodeURIComponent(next)}`, url.origin)
        );
      }
      accessToken = data.session.access_token;
    }

    if (!accessToken) {
      return NextResponse.redirect(
        new URL(`/login?error=confirm_failed&callbackUrl=${encodeURIComponent(next)}`, url.origin)
      );
    }

    const bridge = new URL("/auth/session-bridge", url.origin);
    bridge.searchParams.set("access_token", accessToken);
    bridge.searchParams.set("next", next);
    return NextResponse.redirect(bridge);
  } catch (e) {
    console.error("[auth/callback]", e instanceof Error ? e.message : e);
    return NextResponse.redirect(
      new URL(`/login?error=confirm_failed&callbackUrl=${encodeURIComponent(next)}`, url.origin)
    );
  }
}
