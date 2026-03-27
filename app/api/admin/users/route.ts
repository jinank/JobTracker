import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminSession } from "@/lib/isAdmin";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: users, error } = await supabase
    .from("users")
    .select(
      "id, email, name, image, paid, paid_at, subscription_status, student_verified, created_at, last_login_at, login_count, stripe_customer_id, stripe_subscription_id"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const [{ data: chains }, { data: msgs }, { data: usageRows }] = await Promise.all([
    supabase.from("chains").select("user_id"),
    supabase.from("message_index").select("user_id"),
    supabase.from("ai_token_usage").select("user_id, total_tokens"),
  ]);

  const chainByUser = new Map<string, number>();
  for (const c of chains ?? []) {
    const id = c.user_id as string;
    if (id) chainByUser.set(id, (chainByUser.get(id) ?? 0) + 1);
  }

  const msgByUser = new Map<string, number>();
  for (const m of msgs ?? []) {
    const id = m.user_id as string;
    if (id) msgByUser.set(id, (msgByUser.get(id) ?? 0) + 1);
  }

  const tokensByUser = new Map<string, number>();
  for (const u of usageRows ?? []) {
    const id = u.user_id as string;
    if (!id) continue;
    tokensByUser.set(id, (tokensByUser.get(id) ?? 0) + (u.total_tokens ?? 0));
  }

  const rows = (users ?? []).map((u) => ({
    ...u,
    chain_count: chainByUser.get(u.id) ?? 0,
    indexed_messages_count: msgByUser.get(u.id) ?? 0,
    ai_tokens_total: tokensByUser.get(u.id) ?? 0,
  }));

  return NextResponse.json({ users: rows });
}
