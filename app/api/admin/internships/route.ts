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

  const { data: listings, error: listingsErr } = await supabase
    .from("job_listings")
    .select("company")
    .eq("country", "US")
    .eq("employment_type", "Internship")
    .eq("is_active", true);

  if (listingsErr) {
    const hint = listingsErr.message.includes("job_listings")
      ? "Run supabase/migration_v9_internship_jobs.sql"
      : undefined;
    return NextResponse.json({ error: listingsErr.message, hint }, { status: 500 });
  }

  const { count: sourceCount } = await supabase
    .from("job_sources")
    .select("*", { count: "exact", head: true })
    .eq("enabled", true);

  const { data: lastSourceSync } = await supabase
    .from("job_sources")
    .select("last_synced_at")
    .order("last_synced_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: lastRun } = await supabase
    .from("job_sync_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const companies = new Set((listings ?? []).map((r) => r.company)).size;

  return NextResponse.json({
    stats: {
      activeListings: listings?.length ?? 0,
      companies,
      enabledSources: sourceCount ?? 0,
      lastSyncedAt: lastSourceSync?.last_synced_at ?? null,
    },
    lastRun: lastRun ?? null,
  });
}
