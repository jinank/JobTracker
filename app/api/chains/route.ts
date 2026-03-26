import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/requirePaid";

const USER_NOTES_MIGRATION_HINT =
  "Add the column in Supabase SQL: ALTER TABLE chains ADD COLUMN IF NOT EXISTS user_notes text DEFAULT '';";

function withNotesMigrationHint(message: string) {
  const lower = message.toLowerCase();
  if (!lower.includes("user_notes")) return { error: message };
  return { error: message, hint: USER_NOTES_MIGRATION_HINT };
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chains")
    .select("*")
    .eq("user_id", user.userId)
    .order("last_event_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    chains: data,
    paid: user.paid,
    studentVerified: user.studentVerified,
    chainCount: user.chainCount,
    limit: user.paid ? null : user.limit,
  });
}

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { chain_id, canonical_company, role_title, status, append_note } = body;

  if (!chain_id) {
    return NextResponse.json({ error: "Missing chain_id" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (canonical_company !== undefined) {
    updates.canonical_company = canonical_company;
  }
  if (role_title !== undefined) {
    updates.role_title = role_title;
  }
  if (status !== undefined) {
    updates.status = status;
  }

  if (append_note !== undefined && append_note !== null) {
    const line = String(append_note).trim();
    if (line) {
      const { data: row, error: selErr } = await supabase
        .from("chains")
        .select("user_notes")
        .eq("chain_id", chain_id)
        .eq("user_id", user.userId)
        .single();

      if (selErr || !row) {
        return NextResponse.json(
          { error: selErr?.message ?? "Chain not found" },
          { status: selErr?.code === "PGRST116" ? 404 : 500 }
        );
      }

      const cur = String(row.user_notes ?? "").trim();
      const dated = `[${new Date().toISOString().slice(0, 10)}] ${line}`;
      updates.user_notes = cur ? `${cur}\n${dated}` : dated;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("chains")
    .update(updates)
    .eq("chain_id", chain_id)
    .eq("user_id", user.userId);

  if (error) {
    return NextResponse.json(
      { ...withNotesMigrationHint(error.message) },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chainId = searchParams.get("chainId");

  if (!chainId) {
    return NextResponse.json({ error: "Missing chainId" }, { status: 400 });
  }

  const { error } = await supabase
    .from("chains")
    .delete()
    .eq("chain_id", chainId)
    .eq("user_id", user.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
