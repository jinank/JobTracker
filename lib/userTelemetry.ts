import { supabase } from "@/lib/supabase";

export async function recordUserSignIn(args: {
  userId: string;
  email: string;
  provider?: string;
}): Promise<void> {
  const provider = args.provider ?? "google";
  const now = new Date().toISOString();

  try {
    await supabase.from("user_sign_ins").insert({
      user_id: args.userId,
      email: args.email.toLowerCase(),
      provider,
    });

    const { data: row } = await supabase
      .from("users")
      .select("login_count")
      .eq("id", args.userId)
      .single();

    const nextCount = (row?.login_count ?? 0) + 1;
    await supabase
      .from("users")
      .update({ last_login_at: now, login_count: nextCount })
      .eq("id", args.userId);
  } catch {
    // non-fatal
  }
}

export async function recordUserActivity(args: {
  userId: string;
  action: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabase.from("user_activities").insert({
      user_id: args.userId,
      action: args.action,
      meta: args.meta ?? {},
    });
  } catch {
    // non-fatal
  }
}

export async function recordAiTokenUsage(args: {
  userId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  source?: string;
}): Promise<void> {
  try {
    await supabase.from("ai_token_usage").insert({
      user_id: args.userId,
      model: args.model,
      prompt_tokens: args.promptTokens,
      completion_tokens: args.completionTokens,
      total_tokens: args.totalTokens,
      source: args.source ?? "classify_email",
    });
  } catch {
    // non-fatal
  }
}
