import type { SupabaseClient } from "@supabase/supabase-js";
import { advanceStatus } from "@/lib/chainMatcher";
import type { ChainStatus } from "@/types/chain";
import {
  groupChainsByApplication,
  isGenericRole,
  pickRepresentativeChain,
} from "@/lib/uniqueApplications";

type ChainRecord = {
  chain_id: string;
  canonical_company: string;
  role_title: string;
  status: ChainStatus;
  last_event_at: number;
  confidence: number;
};

/**
 * Merge duplicate chains (same company + role) left from repeated email threads.
 * Reassigns events to the kept chain and deletes the extras.
 */
export async function mergeDuplicateChainsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data: chains, error } = await supabase
    .from("chains")
    .select(
      "chain_id, canonical_company, role_title, status, last_event_at, confidence"
    )
    .eq("user_id", userId);

  if (error || !chains?.length) return 0;

  const groups = groupChainsByApplication(chains as ChainRecord[]);
  let merged = 0;

  for (const group of groups.values()) {
    if (group.length <= 1) continue;

    const primary = pickRepresentativeChain(group);
    const duplicates = group.filter((c) => c.chain_id !== primary.chain_id);

    let status = primary.status;
    let lastEventAt = primary.last_event_at;
    let confidence = primary.confidence;
    let roleTitle = primary.role_title;

    for (const dup of duplicates) {
      status = advanceStatus(status, dup.status);
      lastEventAt = Math.max(lastEventAt, dup.last_event_at);
      confidence = Math.max(confidence, dup.confidence);
      if (
        isGenericRole(roleTitle) &&
        dup.role_title &&
        !isGenericRole(dup.role_title)
      ) {
        roleTitle = dup.role_title;
      }

      const { error: moveErr } = await supabase
        .from("events")
        .update({ chain_id: primary.chain_id })
        .eq("chain_id", dup.chain_id);

      if (moveErr) continue;

      const { error: delErr } = await supabase
        .from("chains")
        .delete()
        .eq("chain_id", dup.chain_id)
        .eq("user_id", userId);

      if (!delErr) merged++;
    }

    await supabase
      .from("chains")
      .update({
        status,
        last_event_at: lastEventAt,
        confidence,
        role_title: roleTitle,
      })
      .eq("chain_id", primary.chain_id)
      .eq("user_id", userId);
  }

  return merged;
}
