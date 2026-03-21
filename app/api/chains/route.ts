import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/requirePaid";

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
  const { chain_id, canonical_company, role_title, status } = body;

  if (!chain_id) {
    return NextResponse.json({ error: "Missing chain_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("chains")
    .update({
      canonical_company,
      role_title,
      status,
    })
    .eq("chain_id", chain_id)
    .eq("user_id", user.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
