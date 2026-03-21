import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const FREE_TIER_LIMIT = 50;

export interface AuthenticatedUser {
  userId: string;
  email: string;
  accessToken: string;
  paid: boolean;
  studentVerified: boolean;
  chainCount: number;
  limit: number;
}

export async function getAuthUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.accessToken) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (!data) return null;

  const isPaid =
    data.paid === true ||
    data.subscription_status === "active" ||
    data.subscription_status === "student" ||
    data.student_verified === true;

  const { count } = await supabase
    .from("chains")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.id);

  return {
    userId: data.id,
    email: session.user.email,
    accessToken: session.accessToken,
    paid: isPaid,
    studentVerified: data.student_verified === true,
    chainCount: count ?? 0,
    limit: isPaid ? Infinity : FREE_TIER_LIMIT,
  };
}

export async function requireSyncAccess(): Promise<AuthenticatedUser | null> {
  const user = await getAuthUser();
  if (!user) return null;

  if (user.paid) return user;

  if (user.chainCount >= FREE_TIER_LIMIT) return null;

  return user;
}
