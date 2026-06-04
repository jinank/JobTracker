import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { resolveCallbackUrl } from "@/lib/loginUrl";

export async function POST(request: Request) {
  let body: { email?: string; callbackUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const callbackUrl = resolveCallbackUrl(body.callbackUrl);
  const origin = new URL(request.url).origin;
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`;

  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      console.error("[auth/email-otp]", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Email sign-in failed";
    console.error("[auth/email-otp]", msg);
    return NextResponse.json(
      { error: "Email sign-in is not available. Check Supabase settings or use Google." },
      { status: 503 }
    );
  }
}
