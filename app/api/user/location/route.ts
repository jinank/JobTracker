import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAppUser } from "@/lib/requirePaid";
import { normalizeUserLocation } from "@/lib/userLocation";

export async function GET() {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("city, state, country")
    .eq("id", user.userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    city: data?.city ?? null,
    state: data?.state ?? null,
    country: data?.country ?? null,
  });
}

export async function PATCH(request: Request) {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const location = normalizeUserLocation(body);
  if (!location) {
    return NextResponse.json(
      { error: "City, state, and country are required." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("users")
    .update({
      city: location.city,
      state: location.state,
      country: location.country,
    })
    .eq("id", user.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(location);
}
