import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";
import { RESOURCE_IDS } from "@/lib/memberResources";

export async function GET() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("resource_access_requests")
    .select("resource_id, status, created_at")
    .eq("user_id", user.userId);

  if (error) {
    const hint = error.message.includes("resource_access_requests")
      ? "Run supabase/migration_v12_resource_access_requests.sql"
      : undefined;
    return NextResponse.json({ error: error.message, hint }, { status: 500 });
  }

  const requests: Record<string, { status: string; createdAt: string }> = {};
  for (const row of data ?? []) {
    requests[row.resource_id] = {
      status: row.status,
      createdAt: row.created_at,
    };
  }

  return NextResponse.json({ requests });
}

export async function POST(req: Request) {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { resourceId?: string };
  try {
    body = (await req.json()) as { resourceId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const resourceId = body.resourceId?.trim();
  if (!resourceId || !RESOURCE_IDS.has(resourceId)) {
    return NextResponse.json({ error: "Invalid resource" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("resource_access_requests")
    .select("id, status")
    .eq("user_id", user.userId)
    .eq("resource_id", resourceId)
    .maybeSingle();

  if (existing) {
    if (existing.status === "pending") {
      return NextResponse.json({
        success: true,
        status: "pending",
        message: "Request already submitted",
      });
    }
    if (existing.status === "approved") {
      return NextResponse.json({
        success: true,
        status: "approved",
        message: "Access already approved",
      });
    }

    const { error: updateError } = await supabase
      .from("resource_access_requests")
      .update({ status: "pending", reviewed_at: null })
      .eq("id", existing.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: "pending",
      message: "Request submitted",
    });
  }

  const { error } = await supabase.from("resource_access_requests").insert({
    user_id: user.userId,
    resource_id: resourceId,
    status: "pending",
  });

  if (error) {
    const hint = error.message.includes("resource_access_requests")
      ? "Run supabase/migration_v12_resource_access_requests.sql"
      : undefined;
    return NextResponse.json({ error: error.message, hint }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    status: "pending",
    message: "Request submitted",
  });
}
