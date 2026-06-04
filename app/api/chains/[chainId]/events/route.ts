import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAppUser } from "@/lib/requirePaid";

export async function GET(
  _request: Request,
  { params }: { params: { chainId: string } }
) {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("chain_id", params.chainId)
    .eq("user_id", user.userId)
    .order("event_time", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}
