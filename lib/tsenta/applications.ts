import { supabase } from "@/lib/supabase";
import { applicationDedupeKey } from "@/lib/uniqueApplications";
import { getApplication, type TsentaApplication } from "@/lib/tsenta/client";
import {
  isTerminalStatus,
  type PublicTsentaApplication,
} from "@/lib/tsenta/types";

export type { PublicTsentaApplication, TsentaApplicationStatus } from "@/lib/tsenta/types";

export type TsentaApplicationRow = {
  id: string;
  user_id: string;
  listing_id: string | null;
  apply_url: string;
  company: string;
  role_title: string;
  tsenta_application_id: string | null;
  ats: string | null;
  status: string;
  failure_reason: string | null;
  price_usd: number | null;
  chain_id: string | null;
  created_at: string;
  updated_at: string;
};

export function toPublicApplication(row: TsentaApplicationRow): PublicTsentaApplication {
  return {
    id: row.id,
    listingId: row.listing_id,
    applyUrl: row.apply_url,
    company: row.company,
    roleTitle: row.role_title,
    ats: row.ats,
    status: row.status,
    failureReason: row.failure_reason,
    chainId: row.chain_id,
  };
}

export async function countTodayApplies(userId: string): Promise<number> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("tsenta_applications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", start.toISOString());

  if (error) {
    throw new Error(error.message);
  }
  return count ?? 0;
}

export async function findApplicationByUrl(
  userId: string,
  applyUrl: string
): Promise<TsentaApplicationRow | null> {
  const { data, error } = await supabase
    .from("tsenta_applications")
    .select("*")
    .eq("user_id", userId)
    .eq("apply_url", applyUrl)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as TsentaApplicationRow | null) ?? null;
}

export async function listUserApplications(
  userId: string
): Promise<TsentaApplicationRow[]> {
  const { data, error } = await supabase
    .from("tsenta_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) throw new Error(error.message);
  return (data as TsentaApplicationRow[]) ?? [];
}

export async function getLocalApplication(
  userId: string,
  id: string
): Promise<TsentaApplicationRow | null> {
  const { data, error } = await supabase
    .from("tsenta_applications")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as TsentaApplicationRow | null) ?? null;
}

export async function upsertApplicationRow(
  row: Partial<TsentaApplicationRow> & {
    user_id: string;
    apply_url: string;
  }
): Promise<TsentaApplicationRow> {
  const { data, error } = await supabase
    .from("tsenta_applications")
    .upsert(
      {
        ...row,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,apply_url" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as TsentaApplicationRow;
}

export async function updateApplicationRow(
  id: string,
  patch: Partial<TsentaApplicationRow>
): Promise<TsentaApplicationRow | null> {
  const { data, error } = await supabase
    .from("tsenta_applications")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as TsentaApplicationRow | null) ?? null;
}

export async function findApplicationByTsentaId(
  tsentaApplicationId: string
): Promise<TsentaApplicationRow | null> {
  const { data, error } = await supabase
    .from("tsenta_applications")
    .select("*")
    .eq("tsenta_application_id", tsentaApplicationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as TsentaApplicationRow | null) ?? null;
}

function mapRemoteStatus(remote: TsentaApplication): {
  status: string;
  failure_reason: string | null;
  ats: string | null;
  price_usd: number | null;
} {
  return {
    status: remote.status,
    failure_reason: remote.failure_reason,
    ats: remote.ats ?? null,
    price_usd: remote.price_usd ?? null,
  };
}

export async function syncApplicationFromTsenta(
  row: TsentaApplicationRow
): Promise<TsentaApplicationRow> {
  if (!row.tsenta_application_id || isTerminalStatus(row.status)) {
    return row;
  }

  const remote = await getApplication(row.tsenta_application_id);
  const patch = mapRemoteStatus(remote);
  const updated = await updateApplicationRow(row.id, patch);
  const next = updated ?? { ...row, ...patch };

  if (next.status === "submitted") {
    return recordSubmittedApplication(next);
  }
  return next;
}

export async function applyRemoteStatus(
  row: TsentaApplicationRow,
  remote: Pick<TsentaApplication, "status" | "failure_reason" | "ats" | "price_usd">
): Promise<TsentaApplicationRow> {
  const patch = {
    status: remote.status,
    failure_reason: remote.failure_reason ?? null,
    ats: remote.ats ?? row.ats,
    price_usd: remote.price_usd ?? row.price_usd,
  };
  const updated = await updateApplicationRow(row.id, patch);
  const next = updated ?? { ...row, ...patch };
  if (next.status === "submitted") {
    return recordSubmittedApplication(next);
  }
  return next;
}

export async function recordSubmittedApplication(
  row: TsentaApplicationRow
): Promise<TsentaApplicationRow> {
  if (row.chain_id) return row;

  const company = row.company.trim() || "Unknown company";
  const role = row.role_title.trim();
  const now = Date.now();

  const { data: existing } = await supabase
    .from("chains")
    .select("chain_id, canonical_company, role_title, status, last_event_at, confidence")
    .eq("user_id", row.user_id);

  const targetKey = applicationDedupeKey({
    canonical_company: company,
    role_title: role,
  });

  const match = (existing ?? []).find(
    (chain) =>
      applicationDedupeKey({
        canonical_company: String(chain.canonical_company ?? ""),
        role_title: String(chain.role_title ?? ""),
      }) === targetKey
  );

  let chainId = match?.chain_id as string | undefined;
  if (!chainId) {
    chainId = crypto.randomUUID();
    const { error } = await supabase.from("chains").insert({
      chain_id: chainId,
      user_id: row.user_id,
      canonical_company: company,
      role_title: role,
      status: "APPLIED",
      last_event_at: now,
      confidence: 0.95,
      created_at: now,
    });
    if (error) throw new Error(error.message);
  } else {
    await supabase
      .from("chains")
      .update({
        last_event_at: Math.max(Number(match?.last_event_at ?? 0), now),
        status: match?.status === "REJECTED" || match?.status === "WITHDRAWN"
          ? match.status
          : "APPLIED",
      })
      .eq("chain_id", chainId);
  }

  const { data: claimed } = await supabase
    .from("tsenta_applications")
    .update({
      chain_id: chainId,
      status: "submitted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .is("chain_id", null)
    .select("*")
    .maybeSingle();

  if (!claimed) {
    const current = await supabase
      .from("tsenta_applications")
      .select("*")
      .eq("id", row.id)
      .maybeSingle();
    return (current.data as TsentaApplicationRow | null) ?? { ...row, chain_id: chainId, status: "submitted" };
  }

  await supabase.from("events").insert({
    event_id: crypto.randomUUID(),
    chain_id: chainId,
    user_id: row.user_id,
    event_type: "APPLICATION_RECEIVED",
    event_time: now,
    evidence: `Auto-applied from SuperInterns${row.ats ? ` (${row.ats})` : ""}.`,
    extracted_entities: {
      company_raw: company,
      role_raw: role || undefined,
      links: [row.apply_url],
      source: "auto_apply",
    },
    extraction_version: 1,
  });

  return claimed as TsentaApplicationRow;
}

export { isInFlightStatus, isTerminalStatus } from "@/lib/tsenta/types";
