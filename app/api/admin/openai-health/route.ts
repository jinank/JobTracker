import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminSession } from "@/lib/isAdmin";
import { verifyOpenAiApiKey } from "@/lib/openai/verifyApiKey";

/** Admin-only: checks server OPENAI_API_KEY with a tiny chat completion. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await verifyOpenAiApiKey();

  if (result.ok) {
    return NextResponse.json({
      ok: true,
      model: result.model,
      latencyMs: result.latencyMs,
      configured: true,
    });
  }

  return NextResponse.json(
    {
      ok: false,
      configured: result.code !== "MISSING",
      code: result.code,
      error: result.error,
      status: result.status,
    },
    { status: result.code === "MISSING" ? 503 : 502 }
  );
}
