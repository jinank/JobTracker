import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { FREE_TIER_LIMIT } from "@/lib/freeTier";

export { FREE_TIER_LIMIT };

export interface AppUser {
  userId: string;
  email: string;
  paid: boolean;
  studentVerified: boolean;
  /** Stripe/PayPal Pro subscription (not student free tier). */
  hasProSubscription: boolean;
  subscriptionStatus: string | null;
  chainCount: number;
  limit: number;
  gmailConnected: boolean;
  accessToken?: string;
}

/** Signed-in user (email, Google without Gmail, or email magic link). */
export async function getAppUser(): Promise<AppUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (!data) return null;

  const subscriptionStatus =
    typeof data.subscription_status === "string" ? data.subscription_status : null;

  const hasProSubscription =
    subscriptionStatus === "active" ||
    (data.paid === true && !!data.stripe_subscription_id);

  // Student verification is a label, not a paid plan.
  const isPaid =
    subscriptionStatus === "active" ||
    (data.paid === true && !!data.stripe_subscription_id) ||
    (data.paid === true &&
      data.student_verified !== true &&
      subscriptionStatus !== "student");

  const { count } = await supabase
    .from("chains")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.id);

  const gmailConnected =
    session.gmailConnected === true &&
    !!session.accessToken &&
    session.adminCredential !== true;

  return {
    userId: data.id,
    email: session.user.email,
    paid: isPaid,
    studentVerified: data.student_verified === true,
    hasProSubscription,
    subscriptionStatus,
    chainCount: count ?? 0,
    limit: isPaid ? Infinity : FREE_TIER_LIMIT,
    gmailConnected,
    accessToken: gmailConnected ? session.accessToken : undefined,
  };
}

/** @deprecated Alias — use getAppUser for non-Gmail features. */
export type AuthenticatedUser = AppUser & { accessToken: string };

/** Gmail sync and other mail APIs — requires Track Jobs Google connection. */
export async function getAuthUser(): Promise<(AppUser & { accessToken: string }) | null> {
  const user = await getAppUser();
  if (!user?.accessToken) return null;
  return user as AppUser & { accessToken: string };
}

export async function requireSyncAccess(): Promise<(AppUser & { accessToken: string }) | null> {
  const user = await getAuthUser();
  if (!user) return null;

  if (user.paid) return user;

  if (user.chainCount >= FREE_TIER_LIMIT) return null;

  return user;
}
