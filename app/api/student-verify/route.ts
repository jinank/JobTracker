import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/requirePaid";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("student_verifications")
    .select("id, status")
    .eq("user_id", user.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    if (existing.status === "approved") {
      return NextResponse.json({ error: "Already verified as a student" }, { status: 400 });
    }
    if (existing.status === "pending") {
      return NextResponse.json({ error: "You already have a pending request" }, { status: 400 });
    }
  }

  const body = await req.json();
  const { fullName, studentEmail, university, linkedinUrl, graduationYear } = body;

  if (!fullName?.trim() || !studentEmail?.trim() || !university?.trim()) {
    return NextResponse.json(
      { error: "Name, student email, and university are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("student_verifications").insert({
    user_id: user.userId,
    full_name: fullName.trim(),
    student_email: studentEmail.trim().toLowerCase(),
    university: university.trim(),
    linkedin_url: linkedinUrl?.trim() || null,
    graduation_year: graduationYear ? parseInt(graduationYear, 10) : null,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Verification request submitted" });
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("student_verifications")
    .select("id, status, created_at")
    .eq("user_id", user.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    verification: data ?? null,
  });
}
