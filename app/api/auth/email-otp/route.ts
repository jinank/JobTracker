import { NextResponse } from "next/server";
import { buildAuthCallbackRedirect } from "@/lib/auth/authRedirectUrl";
import { createEmailSignInLink } from "@/lib/auth/createEmailSignInLink";
import { sendSignInLinkEmail } from "@/lib/emails/sendAuthEmail";
import { getSupabase } from "@/lib/supabase";

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

  const redirectTo = buildAuthCallbackRedirect(request, body.callbackUrl);

  try {
    const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());

    if (resendConfigured) {
      const linkResult = await createEmailSignInLink(email, redirectTo);
      if (!linkResult.ok) {
        return NextResponse.json({ error: linkResult.error }, { status: 400 });
      }

      const sent = await sendSignInLinkEmail(email, linkResult.actionLink);
      if (!sent.ok) {
        return NextResponse.json({ error: sent.error }, { status: 503 });
      }

      return NextResponse.json({ ok: true });
    }

    // Fallback: Supabase default email (customize templates in Supabase Dashboard).
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
