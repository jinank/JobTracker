import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminSession } from "@/lib/isAdmin";
import { supabase } from "@/lib/supabase";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = params;
  if (!UUID_RE.test(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userErr || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [
    { count: chainCount },
    { count: eventCount },
    { count: msgCount },
    { data: signIns },
    { data: activities },
    { data: aiRows },
    { data: aiAllTokens },
    { data: payments },
    { data: verifications },
  ] = await Promise.all([
    supabase.from("chains").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("message_index").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("user_sign_ins")
      .select("id, email, provider, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("user_activities")
      .select("id, action, meta, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("ai_token_usage")
      .select("id, model, prompt_tokens, completion_tokens, total_tokens, source, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(80),
    supabase.from("ai_token_usage").select("total_tokens").eq("user_id", userId),
    supabase
      .from("payments")
      .select("id, amount_cents, currency, status, created_at, stripe_session_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("student_verifications")
      .select("id, full_name, student_email, university, status, created_at, reviewed_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const aiTokensTotal =
    (aiAllTokens ?? []).reduce((s, r) => s + (r.total_tokens ?? 0), 0) || 0;

  return NextResponse.json({
    user,
    stats: {
      chains: chainCount ?? 0,
      events: eventCount ?? 0,
      indexed_messages: msgCount ?? 0,
      ai_tokens_total: aiTokensTotal,
      ai_calls_recorded: aiAllTokens?.length ?? 0,
    },
    sign_ins: signIns ?? [],
    activities: activities ?? [],
    ai_usage_recent: aiRows ?? [],
    payments: payments ?? [],
    student_verifications: verifications ?? [],
  });
}
