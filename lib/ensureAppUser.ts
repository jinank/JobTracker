import { supabase } from "@/lib/supabase";
import { recordUserSignIn } from "@/lib/userTelemetry";

export type AppAuthProvider = "google" | "google-gmail" | "email";

export async function ensureAppUser(params: {
  email: string;
  name?: string | null;
  image?: string | null;
  googleSub?: string | null;
  supabaseAuthId?: string | null;
  authProvider: AppAuthProvider;
}): Promise<{ id: string; loginCount: number | null } | null> {
  const email = params.email.trim().toLowerCase();
  if (!email) return null;

  const ownerEmails = (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isOwner = ownerEmails.includes(email);

  const row: Record<string, unknown> = {
    email,
    name: params.name ?? "",
    image: params.image ?? null,
    auth_provider: params.authProvider,
  };
  if (params.googleSub) row.google_sub = params.googleSub;
  if (params.supabaseAuthId) row.supabase_auth_id = params.supabaseAuthId;
  if (isOwner) {
    row.paid = true;
    row.subscription_status = "active";
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(row, { onConflict: "email" })
    .select("id, login_count")
    .maybeSingle();

  if (error) {
    console.error("[auth] users upsert:", error.message);
    return null;
  }

  if (data?.id) {
    void recordUserSignIn({
      userId: data.id,
      email,
      provider: params.authProvider,
    });
  }

  return data?.id
    ? { id: data.id, loginCount: data.login_count ?? null }
    : null;
}
