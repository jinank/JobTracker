import { getSupabase } from "@/lib/supabase";

export type EmailSignInLinkResult =
  | { ok: true; actionLink: string }
  | { ok: false; error: string };

/**
 * Generate a magic-link URL that lands on /auth/callback with token_hash in the query
 * (server-readable). Avoids Supabase implicit flow tokens in the URL hash (#access_token=…).
 */
export async function createEmailSignInLink(
  email: string,
  redirectTo: string
): Promise<EmailSignInLinkResult> {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error) {
    console.error("[auth/createEmailSignInLink]", error.message);
    return { ok: false, error: error.message };
  }

  const hashedToken = data.properties?.hashed_token;
  if (!hashedToken) {
    return { ok: false, error: "Could not generate sign-in link." };
  }

  let callbackBase: string;
  let next = "/";
  try {
    const redirectUrl = new URL(redirectTo);
    callbackBase = `${redirectUrl.origin}${redirectUrl.pathname}`;
    next = redirectUrl.searchParams.get("next") ?? "/";
  } catch {
    return { ok: false, error: "Invalid redirect URL for sign-in link." };
  }

  const actionLink = `${callbackBase}?token_hash=${encodeURIComponent(hashedToken)}&type=magiclink&next=${encodeURIComponent(next)}`;

  return { ok: true, actionLink };
}
