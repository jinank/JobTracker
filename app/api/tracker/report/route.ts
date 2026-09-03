import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";
import {
  buildApplicationReport,
  uniqueAppsFromChains,
  type ReportChain,
} from "@/lib/applicationReport";

type EventRow = {
  chain_id: string;
  event_time: number;
  event_type: string;
};

const PAGE = 1000;

type PageResult<T> = { data: T[] | null; error: { message: string } | null };

async function pageAll<T>(
  fetchPage: (from: number, to: number) => PromiseLike<PageResult<T>>
): Promise<{ rows: T[]; error: string | null }> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await fetchPage(from, from + PAGE - 1);
    if (error) return { rows, error: error.message };
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return { rows, error: null };
}

export async function GET() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const chainsRes = await pageAll<ReportChain>((from, to) =>
    supabase
      .from("chains")
      .select(
        "chain_id, canonical_company, role_title, status, last_event_at, created_at, confidence"
      )
      .eq("user_id", user.userId)
      .order("last_event_at", { ascending: false })
      .range(from, to)
  );

  if (chainsRes.error) {
    return NextResponse.json({ error: chainsRes.error }, { status: 500 });
  }

  const eventsRes = await pageAll<EventRow>((from, to) =>
    supabase
      .from("events")
      .select("chain_id, event_time, event_type")
      .eq("user_id", user.userId)
      .order("event_time", { ascending: true })
      .range(from, to)
  );

  if (eventsRes.error) {
    return NextResponse.json({ error: eventsRes.error }, { status: 500 });
  }

  const firstEventByChain = new Map<string, number>();
  for (const ev of eventsRes.rows) {
    const id = ev.chain_id as string;
    const t = Number(ev.event_time);
    if (!id || !Number.isFinite(t)) continue;
    const prev = firstEventByChain.get(id);
    const isApply = ev.event_type === "APPLICATION_RECEIVED";
    if (prev == null) {
      firstEventByChain.set(id, t);
      continue;
    }
    if (isApply && t < prev) firstEventByChain.set(id, t);
    else if (!isApply && t < prev) firstEventByChain.set(id, t);
  }

  // Prefer the first APPLICATION_RECEIVED when present.
  const applyFirst = new Map<string, number>();
  for (const ev of eventsRes.rows) {
    if (ev.event_type !== "APPLICATION_RECEIVED") continue;
    const id = ev.chain_id as string;
    const t = Number(ev.event_time);
    if (!id || !Number.isFinite(t)) continue;
    const prev = applyFirst.get(id);
    if (prev == null || t < prev) applyFirst.set(id, t);
  }
  for (const [id, t] of applyFirst) {
    firstEventByChain.set(id, t);
  }

  const apps = uniqueAppsFromChains(chainsRes.rows, firstEventByChain);
  const report = buildApplicationReport(apps);

  return NextResponse.json({ report });
}
