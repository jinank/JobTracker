import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** Map URL ?type= to Supabase verifyOtp type (magiclink/signup → email). */
function resolveOtpType(type: string): "email" | "signup" | "invite" | "recovery" | "email_change" {
  if (type === "signup" || type === "invite" || type === "recovery" || type === "email_change") {
    return type;
  }
  return "email";
}

export async function POST(request: Request) {
  let body: { code?: string; token_hash?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const code = body.code?.trim();
  const token_hash = body.token_hash?.trim();
  const type = body.type?.trim() ?? "email";

  if (!code && !token_hash) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    let accessToken: string | undefined;

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error || !data.session?.access_token) {
        console.error("[auth/supabase-callback] exchangeCodeForSession:", error?.message);
        return NextResponse.json({ error: "confirm_failed" }, { status: 400 });
      }
      accessToken = data.session.access_token;
    } else if (token_hash) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: resolveOtpType(type),
      });
      if (error || !data.session?.access_token) {
        console.error("[auth/supabase-callback] verifyOtp:", error?.message);
        return NextResponse.json({ error: "confirm_failed" }, { status: 400 });
      }
      accessToken = data.session.access_token;
    }

    if (!accessToken) {
      return NextResponse.json({ error: "confirm_failed" }, { status: 400 });
    }

    return NextResponse.json({ access_token: accessToken });
  } catch (e) {
    console.error("[auth/supabase-callback]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "confirm_failed" }, { status: 500 });
  }
}
