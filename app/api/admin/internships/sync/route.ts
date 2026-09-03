import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminSession } from "@/lib/isAdmin";
import { syncInternships } from "@/lib/jobs/syncInternships";

export const maxDuration = 300;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await syncInternships();
    const failed =
      result.errors.some(
        (e) => e.includes("relation") || e.includes("job_listings") || e.includes("job_sources")
      ) ||
      (result.sourcesProcessed === 0 && result.errors.length > 0);

    if (failed) {
      return NextResponse.json(
        {
          error: result.errors.join(" "),
          hint: "Check Supabase migration and Vercel env vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).",
          ...result,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
