import { NextResponse } from "next/server";
import { requireSyncAccess } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";
import { listMessages, getMessage } from "@/lib/gmail/client";
import { parseGmailMessage, type ParsedMessage } from "@/lib/gmail/parser";
import { classifyEmail } from "@/lib/openai/classifier";
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
  MAX_MESSAGES_PER_SYNC,
  GMAIL_FETCH_BATCH_SIZE,
  EXTRACTION_VERSION,
} from "@/lib/constants";

export async function POST() {
  const user = await requireSyncAccess();
  if (!user) {
    return NextResponse.json(
      { error: "Free tier limit reached (50 applications). Upgrade to Pro for unlimited.", code: "UPGRADE_REQUIRED" },
      { status: 403 }
    );
  }

  try {
    const { data: existingMsgs } = await supabase
      .from("message_index")
      .select("provider_message_id")
      .eq("user_id", user.userId);

    const processedIds = new Set(
      (existingMsgs ?? []).map((m) => m.provider_message_id)
    );

    const allMessageIds: Array<{ id: string; threadId: string }> = [];
    let pageToken: string | undefined;

    while (allMessageIds.length < MAX_MESSAGES_PER_SYNC) {
      const listing = await listMessages(user.accessToken, {
        q: GMAIL_JOB_QUERY,
        maxResults: 100,
        pageToken,
      });

      if (listing.messages) {
        allMessageIds.push(...listing.messages);
      }

      pageToken = listing.nextPageToken;
      if (!pageToken) break;
    }

    const newMessageIds = allMessageIds
      .filter((m) => !processedIds.has(m.id))
      .slice(0, MAX_MESSAGES_PER_SYNC);

    if (newMessageIds.length === 0) {
      return NextResponse.json({ newCount: 0, total: allMessageIds.length });
    }

    const parsed: ParsedMessage[] = [];
    for (let i = 0; i < newMessageIds.length; i += GMAIL_FETCH_BATCH_SIZE) {
      const batch = newMessageIds.slice(i, i + GMAIL_FETCH_BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (m) => {
          try {
            const full = await getMessage(user.accessToken, m.id);
            return parseGmailMessage(full);
          } catch {
            return null;
          }
        })
      );
      parsed.push(...results.filter((r): r is ParsedMessage => r !== null));
    }

    const { data: userChains } = await supabase
      .from("chains")
      .select("chain_id, canonical_company, role_title, status, last_event_at, confidence")
      .eq("user_id", user.userId);

    const chainCache: ChainRow[] = (userChains ?? []).map((c) => ({
      chain_id: c.chain_id,
      canonical_company: c.canonical_company,
      role_title: c.role_title,
      status: c.status,
      last_event_at: c.last_event_at,
      confidence: c.confidence,
    }));

    let newCount = 0;

    for (const email of parsed) {
      if (processedIds.has(email.gmail_id)) continue;

      let classification;
      try {
        classification = await classifyEmail(email);
      } catch {
        continue;
      }

      const msgId = crypto.randomUUID();

      await supabase.from("message_index").upsert(
        {
          msg_id_internal: msgId,
          user_id: user.userId,
          provider_message_id: email.gmail_id,
          provider_thread_id: email.thread_id,
          subject_text: email.subject,
          from_email: email.from_email,
          from_domain: email.from_domain,
          received_at: email.received_at,
          snippet: email.snippet,
          processed: true,
        },
        { onConflict: "user_id,provider_message_id" }
      );

      processedIds.add(email.gmail_id);

      if (
        classification.eventType === "OTHER" &&
        classification.confidence < 0.3
      ) {
        continue;
      }

      const status = eventTypeToStatus(classification.eventType);
      const company = resolveCompanyName(
        classification.company || undefined,
        email.from_domain
      );
      const role = normalizeRoleTitle(classification.roleTitle || "");

      const match = findBestMatch(chainCache, company, role);

      // Only create NEW chains from APPLICATION_RECEIVED (application confirmation).
      // Interview/assessment invites, offers, rejections, etc. must match an existing
      // application—otherwise skip (e.g. marketing emails like "interview tips" from Alison).
      if (!match && classification.eventType !== "APPLICATION_RECEIVED") {
        continue;
      }

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
          user_id: user.userId,
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
        user_id: user.userId,
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
        msg_id_internal: msgId,
        extraction_version: EXTRACTION_VERSION,
      });

      newCount++;
    }

    return NextResponse.json({ newCount, total: allMessageIds.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync Gmail";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
