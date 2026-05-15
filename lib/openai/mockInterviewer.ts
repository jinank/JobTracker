import OpenAI from "openai";
import type { PracticeInterview } from "@/lib/practiceInterviewsData";
import { recordAiTokenUsage } from "@/lib/userTelemetry";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(interview: PracticeInterview): string {
  return `You are a professional mock interviewer conducting a ${interview.interviewType.replace(/_/g, " ")} interview for ${interview.companyName}.

Role: ${interview.roleType}
Session title: ${interview.title}
Target length: about ${interview.durationMinutes} minutes of back-and-forth.

Interview focus:
${interview.interviewerBrief}

Rules:
- Stay in character as the interviewer. Be realistic, concise, and constructive.
- Ask one clear question at a time. Use follow-ups based on the candidate's answers.
- For behavioural questions, expect STAR-style answers and probe if answers lack specifics.
- Do not fabricate that you work at ${interview.companyName} in a way that misrepresents affiliation; this is practice only.
- After 4–6 exchanges, you may offer brief feedback and suggest wrapping up unless the candidate wants to continue.
- Keep responses under 180 words unless giving structured feedback.`;
}

export async function runMockInterviewTurn(opts: {
  interview: PracticeInterview;
  messages: ChatMessage[];
  userId?: string;
}): Promise<string> {
  const { interview, messages, userId } = opts;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 500,
    messages: [
      { role: "system", content: buildSystemPrompt(interview) },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
  });

  const usage = completion.usage;
  const model = completion.model ?? "gpt-4o-mini";
  if (userId && usage) {
    const promptTokens = usage.prompt_tokens ?? 0;
    const completionTokens = usage.completion_tokens ?? 0;
    void recordAiTokenUsage({
      userId,
      model,
      promptTokens,
      completionTokens,
      totalTokens: usage.total_tokens ?? promptTokens + completionTokens,
      source: "practice_interview",
    });
  }

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("No response from interviewer");
  return text;
}
