import { buildSignInLinkEmail } from "@/lib/emails/signInLinkEmail";
import { SITE_NAME } from "@/lib/site";

export type SendAuthEmailResult =
  | { ok: true; provider: "resend" }
  | { ok: false; error: string };

function getFromAddress(): string {
  const from = process.env.AUTH_EMAIL_FROM?.trim();
  if (from) return from;
  return `${SITE_NAME} <onboarding@resend.dev>`;
}

/** Send a branded sign-in email via Resend (https://resend.com). */
export async function sendSignInLinkEmail(
  to: string,
  signInUrl: string
): Promise<SendAuthEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const { subject, html, text } = buildSignInLinkEmail(signInUrl);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[auth/email] Resend error:", res.status, body);
    return {
      ok: false,
      error: "Could not send sign-in email. Check RESEND_API_KEY and AUTH_EMAIL_FROM.",
    };
  }

  return { ok: true, provider: "resend" };
}
