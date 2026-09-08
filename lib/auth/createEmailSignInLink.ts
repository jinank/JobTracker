import { getSupabase } from "@/lib/supabase";

export type EmailSignInLinkResult =
  | { ok: true; actionLink: string }
  | { ok: false; error: string };

/**
 * Generate a Supabase magic-link URL without triggering Supabase's default email.
 * Uses action_link so Supabase verifies the token, then redirects to our callback
 * (with session tokens in the URL hash for the client page to read).
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

  const actionLink = data.properties?.action_link;
  if (!actionLink) {
    return { ok: false, error: "Could not generate sign-in link." };
  }

  return { ok: true, actionLink };
}
