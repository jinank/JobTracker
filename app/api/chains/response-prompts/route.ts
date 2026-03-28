import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/requirePaid";

/** Only nudge for recent invites/offers */
const MAX_AGE_MS = 21 * 24 * 60 * 60 * 1000;

const STATUS_TO_EVENT: Record<string, string> = {
  ASSESSMENT: "ASSESSMENT_INVITE",
  INTERVIEWING: "INTERVIEW_INVITE",
  OFFER: "OFFER",
};

function kindFromStatus(
  status: string
): "assessment" | "interview" | "offer" {
  if (status === "ASSESSMENT") return "assessment";
  if (status === "INTERVIEWING") return "interview";
  return "offer";
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: chains, error: cErr } = await supabase
    .from("chains")
    .select("chain_id, canonical_company, role_title, status")
    .eq("user_id", user.userId)
    .in("status", ["ASSESSMENT", "INTERVIEWING", "OFFER"]);

  if (cErr) {
    return NextResponse.json({ error: cErr.message }, { status: 500 });
  }

  if (!chains?.length) {
    return NextResponse.json({ prompts: [] });
  }

  const chainIds = chains.map((c) => c.chain_id);

  const { data: events, error: eErr } = await supabase
    .from("events")
    .select("event_id, chain_id, event_type, event_time")
    .eq("user_id", user.userId)
    .in("chain_id", chainIds)
    .in("event_type", ["ASSESSMENT_INVITE", "INTERVIEW_INVITE", "OFFER"])
    .order("event_time", { ascending: false });

  if (eErr) {
    return NextResponse.json({ error: eErr.message }, { status: 500 });
  }

  const now = Date.now();
  const byChain = new Map<string, { event_id: string; event_type: string; event_time: number }[]>();

  for (const e of events ?? []) {
    const list = byChain.get(e.chain_id) ?? [];
    list.push(e);
    byChain.set(e.chain_id, list);
  }

  const prompts: {
    promptId: string;
    chainId: string;
    company: string;
    role: string;
    kind: "assessment" | "interview" | "offer";
    eventTime: number;
  }[] = [];

  for (const chain of chains) {
    const wantType = STATUS_TO_EVENT[chain.status];
    if (!wantType) continue;
    const list = byChain.get(chain.chain_id) ?? [];
    const matching = list.filter((e) => e.event_type === wantType);
    if (matching.length === 0) continue;
    const latest = matching.reduce((a, b) => (a.event_time >= b.event_time ? a : b));
    if (now - latest.event_time > MAX_AGE_MS) continue;
    const kind = kindFromStatus(chain.status);
    // Stable id: do not include event_id — new sync rows would change the id and bypass localStorage dismissals.
    prompts.push({
      promptId: `${chain.chain_id}:${kind}`,
      chainId: chain.chain_id,
      company: chain.canonical_company,
      role: chain.role_title || "",
      kind,
      eventTime: latest.event_time,
    });
  }

  prompts.sort((a, b) => b.eventTime - a.eventTime);
  return NextResponse.json({ prompts });
}
