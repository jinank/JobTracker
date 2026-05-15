import { NextResponse } from "next/server";
import { getPracticeInterviewById } from "@/lib/practiceInterviewsData";
import { getAuthUser } from "@/lib/requirePaid";
import {
  runMockInterviewTurn,
  type ChatMessage,
} from "@/lib/openai/mockInterviewer";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to start a mock interview." }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Practice interviews are not configured (missing OPENAI_API_KEY)." },
      { status: 503 }
    );
  }

  let body: { interviewId?: string; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const interviewId = body.interviewId;
  const messages = body.messages;

  if (!interviewId || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "interviewId and messages are required" },
      { status: 400 }
    );
  }

  const interview = getPracticeInterviewById(interviewId);
  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  const sanitized: ChatMessage[] = messages
    .filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-24)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 4000) }));

  if (sanitized.length === 0 || sanitized[sanitized.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "Last message must be from the candidate (user)." },
      { status: 400 }
    );
  }

  try {
    const reply = await runMockInterviewTurn({
      interview,
      messages: sanitized,
      userId: user.userId,
    });
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[practice-interviews/chat]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Interview request failed" },
      { status: 500 }
    );
  }
}
