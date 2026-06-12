import { NextResponse } from "next/server";
import { queryInternships } from "@/lib/jobs/queryInternships";
import { getInternshipUserPrefs } from "@/lib/jobs/getInternshipUserPrefs";
import { parseInternshipQueryParams } from "@/lib/findJobsFilters";
import { getAppUser } from "@/lib/requirePaid";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseInternshipQueryParams(searchParams);

    let userPrefs = null;
    if (params.forMe) {
      const user = await getAppUser();
      if (user) {
        userPrefs = await getInternshipUserPrefs(user.userId);
      }
    }

    const result = await queryInternships(params, userPrefs);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load internships";
    const hint =
      message.includes("job_listings") || message.includes("relation")
        ? "Run supabase/migration_v9_internship_jobs.sql and seed sources."
        : undefined;
    return NextResponse.json(
      { error: message, hint, jobs: [], total: 0, stats: { totalActive: 0, companies: 0, lastSyncedAt: null } },
      { status: message.includes("relation") ? 503 : 500 }
    );
  }
}
