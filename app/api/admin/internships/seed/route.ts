import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminSession } from "@/lib/isAdmin";
import { seedJobSources } from "@/lib/jobs/syncInternships";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const count = await seedJobSources();
    return NextResponse.json({ seeded: count });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
