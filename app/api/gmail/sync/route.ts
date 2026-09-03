import { NextResponse } from "next/server";
import { FREE_TIER_LIMIT, getAppUser, requireSyncAccess } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";
import { listMessages, getMessage } from "@/lib/gmail/client";
import { parseGmailMessage, type ParsedMessage } from "@/lib/gmail/parser";
import {
  classifyEmail,
  type ClassificationResult,
} from "@/lib/openai/classifier";
import { recordUserActivity } from "@/lib/userTelemetry";
import {
  eventTypeToStatus,
  findBestMatch,
  advanceStatus,
  resolveCompanyName,
  normalizeRoleTitle,
  type ChainRow,
} from "@/lib/chainMatcher";
import {
  GMAIL_JOB_QUERY,
  GMAIL_JOB_QUERY_RECENT,
  MAX_MESSAGES_PER_SYNC,
  MAX_NEW_EMAILS_CLASSIFIED_PER_SYNC,
  GMAIL_FETCH_BATCH_SIZE,
  CLASSIFY_BATCH_SIZE,
  EXTRACTION_VERSION,
} from "@/lib/constants";
import {
  GMAIL_AUTH_EXPIRED_CODE,
  isGmailReauthError,
} from "@/lib/gmailAuthErrors";
import { mergeDuplicateChainsForUser } from "@/lib/mergeDuplicateChains";

const NON_APPLICATION_CREATE_EVENT_TYPES = new Set<string>([
  "REJECTION",
  "INTERVIEW_INVITE",
  "ASSESSMENT_INVITE",
  "OFFER",
]);

// If we missed the original application email, we still want to record the
// later stages (rejection/interview/etc) but avoid false positives from
// marketing content.
const MIN_CONFIDENCE_NON_APPLICATION_CHAIN = 0.55;

/** Re-open apps that were indexed but never got an event (e.g. temporary filters). */
const BACKFILL_LOOKBACK_MS = 7 * 24 * 60 * 60 * 1000;
const BACKFILL_CANDIDATE_LIMIT = 120;
/** Cap backfill so junk digests cannot starve brand-new mail. */
const MAX_BACKFILL_PER_SYNC = 8;

const APPLICATIONISH_SUBJECT_RE =
  /\b(application|applied|applying|applicant|thank you for (your )?(interest|applying|application)|thanks for applying|received your|we have received|we've received|interview|assessment|offer|rejection|unfortunately|not moving forward|expression of interest|candidacy|under review|next steps)\b/i;

function shouldBackfillSubject(subject: string | null | undefined): boolean {
  return APPLICATIONISH_SUBJECT_RE.test(subject || "");
}

async function markIngestSkipped(msgIdInternal: string): Promise<void> {
  const { error } = await supabase
    .from("message_index")
    .update({ ingest_skipped: true })
    .eq("msg_id_internal", msgIdInternal);
  if (error && !/ingest_skipped/i.test(error.message)) {
    console.warn("markIngestSkipped:", error.message);
  }
}

async function ingestClassification(opts: {
  userId: string;
  email: ParsedMessage;
  classification: ClassificationResult;
  chainCache: ChainRow[];
  msgIdInternal: string;
}): Promise<boolean> {
  const { userId, email, classification, chainCache, msgIdInternal } = opts;

  if (
    classification.eventType === "OTHER" &&
    classification.confidence < 0.3
  ) {
    return false;
  }

  const status = eventTypeToStatus(classification.eventType);
  const company = resolveCompanyName(
    classification.company || undefined,
    email.from_domain
  );
  const role = normalizeRoleTitle(classification.roleTitle || "");

  const match = findBestMatch(chainCache, company, role);

  const canCreateFromNoMatch =
    classification.eventType === "APPLICATION_RECEIVED" ||
    (NON_APPLICATION_CREATE_EVENT_TYPES.has(classification.eventType) &&
      classification.confidence >= MIN_CONFIDENCE_NON_APPLICATION_CHAIN);

  if (!match && !canCreateFromNoMatch) return false;

  let chainId: string;

  if (match) {
    const updatedStatus = advanceStatus(match.status, status);
    await supabase
      .from("chains")
      .update({
        status: updatedStatus,
        last_event_at: Math.max(match.last_event_at, email.received_at),
        confidence: Math.max(match.confidence, classification.confidence),
        ...(role && !match.role_title ? { role_title: role } : {}),
      })
      .eq("chain_id", match.chain_id);

    match.status = updatedStatus;
    match.last_event_at = Math.max(match.last_event_at, email.received_at);
    match.confidence = Math.max(match.confidence, classification.confidence);
    chainId = match.chain_id;
  } else {
    chainId = crypto.randomUUID();
    const newChain: ChainRow = {
      chain_id: chainId,
      canonical_company: company,
      role_title: role,
      status,
      last_event_at: email.received_at,
      confidence: classification.confidence,
    };

    await supabase.from("chains").insert({
      ...newChain,
      user_id: userId,
      created_at: Date.now(),
    });

    chainCache.push(newChain);
  }

  const deadlineMs = classification.deadline
    ? new Date(classification.deadline).getTime()
    : null;

  await supabase.from("events").insert({
    event_id: crypto.randomUUID(),
    chain_id: chainId,
    user_id: userId,
    event_type: classification.eventType,
    event_time: email.received_at,
    due_at: deadlineMs,
    evidence: classification.evidence,
    extracted_entities: {
      company_raw: classification.company || undefined,
      role_raw: classification.roleTitle || undefined,
      recruiter_name: classification.recruiterName || undefined,
      deadline_raw: classification.deadline || undefined,
      links: classification.links,
    },
    msg_id_internal: msgIdInternal,
    extraction_version: EXTRACTION_VERSION,
  });

  return true;
}

export async function POST() {
  const appUser = await getAppUser();
  if (!appUser) {
    return NextResponse.json({ error: "Sign in required.", code: "UNAUTHORIZED" }, { status: 401 });
  }
  if (!appUser.gmailConnected) {
    return NextResponse.json(
      {
        error: "Connect Gmail from the dashboard to sync applications (Track Jobs only).",
        code: "GMAIL_NOT_CONNECTED",
        needsReauth: true,
      },
      { status: 403 }
    );
  }

  const user = await requireSyncAccess();
  if (!user) {
    return NextResponse.json(
      {
        error: `Free tier limit reached (${FREE_TIER_LIMIT} applications). Upgrade to keep tracking.`,
        code: "UPGRADE_REQUIRED",
      },
      { status: 403 }
    );
  }

  const accessToken = user.accessToken;
  const userId = user.userId;

  try {
    // PostgREST caps at 1000 rows — must page or already-synced mail looks "new".
    const processedIds = new Set<string>();
    {
      const PAGE = 1000;
      for (let from = 0; ; from += PAGE) {
        const { data: page } = await supabase
          .from("message_index")
          .select("provider_message_id")
          .eq("user_id", userId)
          .range(from, from + PAGE - 1);
        if (!page?.length) break;
        for (const m of page) {
          if (m.provider_message_id) processedIds.add(m.provider_message_id);
        }
        if (page.length < PAGE) break;
      }
    }

    async function collectMessageIds(
      q: string,
      cap: number
    ): Promise<Array<{ id: string; threadId: string }>> {
      const ids: Array<{ id: string; threadId: string }> = [];
      let pageToken: string | undefined;
      while (ids.length < cap) {
        const listing = await listMessages(accessToken, {
          q,
          maxResults: 100,
          pageToken,
        });
        if (listing.messages) ids.push(...listing.messages);
        pageToken = listing.nextPageToken;
        if (!pageToken) break;
      }
      return ids;
    }

    // Recent window first so brand-new confirmations win over older matches.
    const recentIds = await collectMessageIds(
      GMAIL_JOB_QUERY_RECENT,
      Math.min(200, MAX_MESSAGES_PER_SYNC)
    );
    const olderIds = await collectMessageIds(
      GMAIL_JOB_QUERY,
      MAX_MESSAGES_PER_SYNC
    );

    const seenId = new Set<string>();
    const allMessageIds: Array<{ id: string; threadId: string }> = [];
    for (const m of [...recentIds, ...olderIds]) {
      if (seenId.has(m.id)) continue;
      seenId.add(m.id);
      allMessageIds.push(m);
    }

    const allNewIds = allMessageIds.filter((m) => !processedIds.has(m.id));

    const chainCache: ChainRow[] = [];
    {
      const PAGE = 1000;
      for (let from = 0; ; from += PAGE) {
        const { data: page } = await supabase
          .from("chains")
          .select(
            "chain_id, canonical_company, role_title, status, last_event_at, confidence"
          )
          .eq("user_id", userId)
          .range(from, from + PAGE - 1);
        if (!page?.length) break;
        for (const c of page) {
          chainCache.push({
            chain_id: c.chain_id,
            canonical_company: c.canonical_company,
            role_title: c.role_title,
            status: c.status,
            last_event_at: c.last_event_at,
            confidence: c.confidence,
          });
        }
        if (page.length < PAGE) break;
      }
    }

    let newCount = 0;
    let classifyBudget = MAX_NEW_EMAILS_CLASSIFIED_PER_SYNC;
    let backfillAttempted = 0;
    let remainingBackfill = 0;

    // --- 1) Brand-new messages first (must not be starved by backfill) ---
    const newMessageIds = allNewIds.slice(0, Math.max(0, classifyBudget));

    const parsed: ParsedMessage[] = [];
    if (newMessageIds.length > 0) {
      for (
        let i = 0;
        i < newMessageIds.length;
        i += GMAIL_FETCH_BATCH_SIZE
      ) {
        const batch = newMessageIds.slice(i, i + GMAIL_FETCH_BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (m) => {
            try {
              const full = await getMessage(accessToken, m.id);
              return parseGmailMessage(full);
            } catch {
              return null;
            }
          })
        );
        parsed.push(...results.filter((r): r is ParsedMessage => r !== null));
      }
    }

    parsed.sort((a, b) => b.received_at - a.received_at);

    const toClassify = parsed.filter((e) => !processedIds.has(e.gmail_id));

    for (let i = 0; i < toClassify.length; i += CLASSIFY_BATCH_SIZE) {
      const slice = toClassify.slice(i, i + CLASSIFY_BATCH_SIZE);
      const classified = await Promise.all(
        slice.map(async (email) => {
          try {
            const classification = await classifyEmail(email, {
              userId: userId,
            });
            return { email, classification };
          } catch {
            return null;
          }
        })
      );

      for (const item of classified) {
        if (!item) continue;
        const { email, classification } = item;
        if (processedIds.has(email.gmail_id)) continue;

        const msgId = crypto.randomUUID();

        {
          const row = {
            msg_id_internal: msgId,
            user_id: userId,
            provider_message_id: email.gmail_id,
            provider_thread_id: email.thread_id,
            subject_text: email.subject,
            from_email: email.from_email,
            from_domain: email.from_domain,
            received_at: email.received_at,
            snippet: email.snippet,
            processed: true,
            ingest_skipped: false,
          };
          const { error: upErr } = await supabase
            .from("message_index")
            .upsert(row, { onConflict: "user_id,provider_message_id" });
          if (upErr && /ingest_skipped/i.test(upErr.message)) {
            const { ingest_skipped: _skip, ...without } = row;
            await supabase
              .from("message_index")
              .upsert(without, { onConflict: "user_id,provider_message_id" });
          }
        }

        processedIds.add(email.gmail_id);

        const created = await ingestClassification({
          userId: userId,
          email,
          classification,
          chainCache,
          msgIdInternal: msgId,
        });
        if (created) {
          newCount++;
        } else {
          await markIngestSkipped(msgId);
        }
      }
    }

    classifyBudget = Math.max(0, classifyBudget - toClassify.length);

    // --- 2) Small backfill for real app emails indexed without an event ---
    const lookback = Date.now() - BACKFILL_LOOKBACK_MS;
    type BackfillRow = {
      provider_message_id: string;
      msg_id_internal: string;
      received_at: number;
      subject_text?: string | null;
      ingest_skipped?: boolean | null;
    };

    let recentIndexed: BackfillRow[] = [];
    {
      const withSkip = await supabase
        .from("message_index")
        .select(
          "provider_message_id,msg_id_internal,received_at,subject_text,ingest_skipped"
        )
        .eq("user_id", userId)
        .eq("processed", true)
        .gte("received_at", lookback)
        .order("received_at", { ascending: false })
        .limit(BACKFILL_CANDIDATE_LIMIT);

      if (withSkip.error && /ingest_skipped/i.test(withSkip.error.message)) {
        const fallback = await supabase
          .from("message_index")
          .select("provider_message_id,msg_id_internal,received_at,subject_text")
          .eq("user_id", userId)
          .eq("processed", true)
          .gte("received_at", lookback)
          .order("received_at", { ascending: false })
          .limit(BACKFILL_CANDIDATE_LIMIT);
        recentIndexed = (fallback.data ?? []) as BackfillRow[];
      } else {
        recentIndexed = (withSkip.data ?? []) as BackfillRow[];
      }
    }

    let missingBackfill: BackfillRow[] = [];
    if (recentIndexed.length > 0) {
      const msgIdInternals = recentIndexed
        .map((m) => m.msg_id_internal)
        .filter(Boolean);

      if (msgIdInternals.length > 0) {
        const { data: indexedEvents } = await supabase
          .from("events")
          .select("msg_id_internal")
          .in("msg_id_internal", msgIdInternals);

        const hasEvent = new Set(
          (indexedEvents ?? [])
            .map((e) => e.msg_id_internal)
            .filter(Boolean)
        );

        missingBackfill = recentIndexed.filter(
          (m) =>
            m.msg_id_internal &&
            !hasEvent.has(m.msg_id_internal) &&
            m.ingest_skipped !== true &&
            shouldBackfillSubject(m.subject_text)
        );
      }
    }

    const backfillBudget = Math.min(
      MAX_BACKFILL_PER_SYNC,
      classifyBudget,
      missingBackfill.length
    );
    const backfillBatch = missingBackfill.slice(0, backfillBudget);
    backfillAttempted = backfillBatch.length;
    remainingBackfill = Math.max(0, missingBackfill.length - backfillBatch.length);

    for (
      let i = 0;
      i < backfillBatch.length;
      i += CLASSIFY_BATCH_SIZE
    ) {
      const slice = backfillBatch.slice(i, i + CLASSIFY_BATCH_SIZE);
      const results = await Promise.all(
        slice.map(async (missingMsg) => {
          const msgIdInternal = missingMsg.msg_id_internal;
          if (!msgIdInternal) return null;
          try {
            const full = await getMessage(
              accessToken,
              missingMsg.provider_message_id
            );
            const parsedMsg = parseGmailMessage(full);
            const classification = await classifyEmail(parsedMsg, {
              userId: userId,
            });
            return { parsedMsg, classification, msgIdInternal };
          } catch {
            return null;
          }
        })
      );

      for (const item of results) {
        if (!item) continue;
        const created = await ingestClassification({
          userId: userId,
          email: item.parsedMsg,
          classification: item.classification,
          chainCache,
          msgIdInternal: item.msgIdInternal,
        });
        if (created) {
          newCount++;
        } else {
          await markIngestSkipped(item.msgIdInternal);
        }
      }
    }

    // Mark marketing/job-alert indexed rows (no event, not applicationish) as skipped.
    {
      const msgIdInternals = recentIndexed
        .map((m) => m.msg_id_internal)
        .filter(Boolean);
      if (msgIdInternals.length > 0) {
        const { data: indexedEvents } = await supabase
          .from("events")
          .select("msg_id_internal")
          .in("msg_id_internal", msgIdInternals);
        const hasEvent = new Set(
          (indexedEvents ?? []).map((e) => e.msg_id_internal).filter(Boolean)
        );
        for (const m of recentIndexed) {
          if (
            !m.msg_id_internal ||
            hasEvent.has(m.msg_id_internal) ||
            m.ingest_skipped === true ||
            shouldBackfillSubject(m.subject_text)
          ) {
            continue;
          }
          await markIngestSkipped(m.msg_id_internal);
        }
      }
    }

    const hasMorePending =
      remainingBackfill > 0 ||
      allNewIds.length > newMessageIds.length;

    const mergedDuplicates = await mergeDuplicateChainsForUser(
      supabase,
      userId
    );

    void recordUserActivity({
      userId: userId,
      action: "gmail_sync",
      meta: {
        newCount,
        total: allMessageIds.length,
        mergedDuplicates,
        backfillAttempted,
        remainingBackfill,
        newFetched: newMessageIds.length,
        pendingNew: Math.max(0, allNewIds.length - newMessageIds.length),
      },
    });

    return NextResponse.json({
      newCount,
      total: allMessageIds.length,
      hasMore: hasMorePending,
      mergedDuplicates,
      backfillAttempted,
      remainingBackfill,
      newFetched: newMessageIds.length,
      pendingNew: Math.max(0, allNewIds.length - newMessageIds.length),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync Gmail";

    if (isGmailReauthError(message)) {
      const is401 =
        message.includes("Gmail API error 401") ||
        message.toLowerCase().includes("unauthenticated");
      return NextResponse.json(
        {
          code: is401 ? GMAIL_AUTH_EXPIRED_CODE : "GMAIL_SCOPE_INSUFFICIENT",
          needsReauth: true,
          error:
            "Your Gmail connection expired or was revoked. Reconnect Gmail to continue syncing.",
        },
        { status: is401 ? 401 : 403 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
