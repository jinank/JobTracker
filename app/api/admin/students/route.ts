import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";

function isOwner(email: string): boolean {
  const ownerEmails = (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return ownerEmails.includes(email.toLowerCase());
}

export async function GET() {
  const user = await getAuthUser();
  if (!user || !isOwner(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data } = await supabase
    .from("student_verifications")
    .select("*, users!inner(email)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ verifications: data ?? [] });
}

export async function PATCH(req: Request) {
  const user = await getAuthUser();
  if (!user || !isOwner(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, action } = await req.json();

  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  const { data: verification, error: fetchError } = await supabase
    .from("student_verifications")
    .select("user_id")
    .eq("id", id)
    .single();

  if (fetchError || !verification) {
    return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("student_verifications")
    .update({ status: newStatus, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  if (action === "approve") {
    await supabase
      .from("users")
      .update({
        student_verified: true,
        paid: true,
        subscription_status: "student",
      })
      .eq("id", verification.user_id);
  }

  return NextResponse.json({ success: true, status: newStatus });
}
