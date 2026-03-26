import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/requirePaid";
import { maskDisplayName } from "@/lib/maskDisplayName";

type LeaderboardRow = {
  user_id: string;
  chain_count: number | string;
  user_image: string | null;
  display_source: string;
};

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [topRes, aboveRes, trackersRes] = await Promise.all([
    supabase.rpc("leaderboard_by_chain_count", { p_limit: 12 }),
    supabase.rpc("count_users_with_more_chains", {
      p_count: user.chainCount,
    }),
    supabase.rpc("count_users_with_chains"),
  ]);

  if (topRes.error) {
    console.error("leaderboard_by_chain_count", topRes.error);
    return NextResponse.json(
      {
        error: "Leaderboard unavailable",
        hint: "Run supabase/migration_v4_leaderboard.sql if this is a new environment.",
      },
      { status: 503 }
    );
  }

  const rows = (topRes.data ?? []) as LeaderboardRow[];

  const entries = rows.map((row, i) => ({
    rank: i + 1,
    displayName: maskDisplayName(row.display_source),
    imageUrl: row.user_image,
    applicationCount: Number(row.chain_count),
    isYou: row.user_id === user.userId,
  }));

  let yourRank: number | null = null;
  if (!aboveRes.error && aboveRes.data != null) {
    yourRank = Number(aboveRes.data) + 1;
  }

  const trackersWithApplications = trackersRes.error
    ? null
    : Number(trackersRes.data ?? 0);

  return NextResponse.json({
    entries,
    yourRank,
    yourApplicationCount: user.chainCount,
    trackersWithApplications,
  });
}
