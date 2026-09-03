import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/requirePaid";
import {
  getLocalApplication,
  syncApplicationFromTsenta,
  toPublicApplication,
} from "@/lib/tsenta/applications";
import { TsentaApiError } from "@/lib/tsenta/client";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAppUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing application id." }, { status: 400 });
  }

  try {
    const row = await getLocalApplication(user.userId, id);
    if (!row) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    const synced = await syncApplicationFromTsenta(row);
    return NextResponse.json({ application: toPublicApplication(synced) });
  } catch (err) {
    if (err instanceof TsentaApiError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    const message = err instanceof Error ? err.message : "Failed to load application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
