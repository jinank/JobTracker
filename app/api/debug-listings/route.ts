import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function summarize(
  label: string,
  res: {
    data: { company?: string; updated_at?: string }[] | null;
    error: { message: string } | null;
  }
) {
  return {
    label,
    count: res.data?.length ?? 0,
    error: res.error?.message ?? null,
    top: (res.data ?? []).slice(0, 3).map((r) => ({
      company: r.company,
      updated_at: r.updated_at,
    })),
  };
}

/** Temporary diagnostics — remove after homepage sort fix. */
export async function GET() {
  try {
    const a = await supabase
      .from("job_listings")
      .select("company,updated_at")
      .eq("country", "US")
      .eq("employment_type", "Internship")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(3);

    const b = await supabase
      .from("job_listings")
      .select("company,updated_at")
      .eq("country", "US")
      .eq("employment_type", "Internship")
      .eq("is_active", true)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .range(0, 4999);

    const c = await supabase
      .from("job_listings")
      .select("company,updated_at")
      .eq("country", "US")
      .eq("employment_type", "Internship")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .range(0, 4999);

    const d = await supabase
      .from("job_listings")
      .select("*", { count: "exact" })
      .eq("country", "US")
      .eq("employment_type", "Internship")
      .eq("is_active", true)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .range(0, 4999);

    return NextResponse.json({
      a: summarize("limit3 no nullsFirst", a),
      b: summarize("range + nullsFirst false", b),
      c: summarize("range no nullsFirst", c),
      d: {
        ...summarize("star range nullsFirst", {
          data: (d.data ?? []).map((r) => ({
            company: r.company,
            updated_at: r.updated_at,
          })),
          error: d.error,
        }),
        exactCount: d.count,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
