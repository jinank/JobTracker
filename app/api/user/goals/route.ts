import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/requirePaid";
import {
  DEFAULT_DAILY_TARGET,
  DEFAULT_WEEKLY_TARGET,
  type GoalPeriod,
  clampDailyTarget,
  clampWeeklyTarget,
} from "@/lib/goalPreferences";

type GoalsRow = {
  goal_period: string | null;
  goal_daily_target: number | null;
  goal_weekly_target: number | null;
};

function normalizePeriod(v: string | null | undefined): GoalPeriod {
  return v === "daily" ? "daily" : "weekly";
}

function normalizeResponse(row: GoalsRow | null) {
  const period = normalizePeriod(row?.goal_period ?? undefined);
  const dailyTarget = clampDailyTarget(
    row?.goal_daily_target ?? DEFAULT_DAILY_TARGET
  );
  const weeklyTarget = clampWeeklyTarget(
    row?.goal_weekly_target ?? DEFAULT_WEEKLY_TARGET
  );
  return { period, dailyTarget, weeklyTarget };
}

function parseOptionalInt(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("goal_period, goal_daily_target, goal_weekly_target")
    .eq("id", user.userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(normalizeResponse(data as GoalsRow));
}

export async function PATCH(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data: row, error: selErr } = await supabase
    .from("users")
    .select("goal_period, goal_daily_target, goal_weekly_target")
    .eq("id", user.userId)
    .single();

  if (selErr || !row) {
    return NextResponse.json(
      { error: selErr?.message ?? "User not found" },
      { status: 500 }
    );
  }

  let period = normalizePeriod((row as GoalsRow).goal_period ?? undefined);
  let dailyTarget = clampDailyTarget(
    (row as GoalsRow).goal_daily_target ?? DEFAULT_DAILY_TARGET
  );
  let weeklyTarget = clampWeeklyTarget(
    (row as GoalsRow).goal_weekly_target ?? DEFAULT_WEEKLY_TARGET
  );

  if (body.period === "daily" || body.period === "weekly") {
    period = body.period;
  }

  const d = parseOptionalInt(body.dailyTarget);
  if (d !== undefined) dailyTarget = clampDailyTarget(d);

  const w = parseOptionalInt(body.weeklyTarget);
  if (w !== undefined) weeklyTarget = clampWeeklyTarget(w);

  const { error: upErr } = await supabase
    .from("users")
    .update({
      goal_period: period,
      goal_daily_target: dailyTarget,
      goal_weekly_target: weeklyTarget,
    })
    .eq("id", user.userId);

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  return NextResponse.json({ period, dailyTarget, weeklyTarget });
}
