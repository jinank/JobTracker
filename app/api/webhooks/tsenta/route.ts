import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getTsentaWebhookSecret } from "@/lib/tsenta/config";
import {
  applyRemoteStatus,
  findApplicationByTsentaId,
  type TsentaApplicationRow,
} from "@/lib/tsenta/applications";
import type { TsentaApplicationStatus } from "@/lib/tsenta/client";

export const runtime = "nodejs";

function headerValue(request: Request, name: string): string | null {
  return request.headers.get(name) ?? request.headers.get(name.toLowerCase());
}

function verifySignature(rawBody: string, request: Request, secret: string): boolean {
  const bearer = headerValue(request, "authorization");
  if (bearer?.startsWith("Bearer ")) {
    const token = bearer.slice(7).trim();
    if (token.length === secret.length) {
      try {
        return timingSafeEqual(Buffer.from(token), Buffer.from(secret));
      } catch {
        return false;
      }
    }
  }

  const signature =
    headerValue(request, "x-tsenta-signature") ??
    headerValue(request, "tsenta-signature") ??
    headerValue(request, "x-webhook-signature");
  if (!signature) return false;

  const hex = signature.includes("=") ? signature.split("=").pop() ?? "" : signature;
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(hex);
  const b = Buffer.from(digest);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function asStatus(value: unknown): TsentaApplicationStatus | null {
  if (
    value === "queued" ||
    value === "running" ||
    value === "needs_review" ||
    value === "needs_otp" ||
    value === "submitted" ||
    value === "failed"
  ) {
    return value;
  }
  return null;
}

function parseWebhook(payload: unknown): {
  tsentaId: string;
  status: TsentaApplicationStatus;
  failureReason: string | null;
  ats: string | null;
  priceUsd: number | null;
} | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const application =
    (root.application && typeof root.application === "object"
      ? (root.application as Record<string, unknown>)
      : null) ??
    (root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root);

  const tsentaId = String(application.id ?? root.application_id ?? "").trim();
  const event = String(root.type ?? root.event ?? "");
  const statusFromEvent = event.startsWith("application.")
    ? asStatus(event.slice("application.".length))
    : null;
  const status = asStatus(application.status) ?? statusFromEvent;
  if (!tsentaId || !status) return null;

  return {
    tsentaId,
    status,
    failureReason:
      typeof application.failure_reason === "string" ? application.failure_reason : null,
    ats: typeof application.ats === "string" ? application.ats : null,
    priceUsd: typeof application.price_usd === "number" ? application.price_usd : null,
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = getTsentaWebhookSecret();
  if (secret && !verifySignature(rawBody, request, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseWebhook(payload);
  if (!parsed) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const row = await findApplicationByTsentaId(parsed.tsentaId);
  if (!row) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const updated: TsentaApplicationRow = await applyRemoteStatus(row, {
    status: parsed.status,
    failure_reason: parsed.failureReason,
    ats: parsed.ats,
    price_usd: parsed.priceUsd,
  });

  return NextResponse.json({
    ok: true,
    id: updated.id,
    status: updated.status,
  });
}
