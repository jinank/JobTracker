import OpenAI from "openai";
import { ROLE_CATEGORIES } from "@/lib/jobs/constants";

const ROLE_OPTIONS = ROLE_CATEGORIES.filter((r) => r !== "All roles");

export type ResumeAnalysis = {
  suggestedRoles: string[];
  keywords: string[];
};

const FALLBACK_SKILL_RE =
  /\b(python|java|javascript|typescript|react|node\.?js|sql|aws|gcp|azure|kubernetes|docker|figma|excel|tableau|machine learning|data science|product management|ux|ui design|marketing|finance|operations)\b/gi;

export async function parseResumeForInternships(
  resumeText: string
): Promise<ResumeAnalysis> {
  const trimmed = resumeText.trim().slice(0, 8000);
  if (!trimmed) {
    return { suggestedRoles: [], keywords: [] };
  }

  if (!process.env.OPENAI_API_KEY) {
    return fallbackAnalysis(trimmed);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You analyze student resumes for US internship matching. Return JSON:
{"suggestedRoles":["..."],"keywords":["..."]}
suggestedRoles: pick 1-4 from exactly this list: ${ROLE_OPTIONS.join(", ")}
keywords: 8-20 lowercase skills/technologies/domains from the resume (no sentences).`,
      },
      { role: "user", content: trimmed },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw) as {
      suggestedRoles?: string[];
      keywords?: string[];
    };
    const suggestedRoles = (parsed.suggestedRoles ?? []).filter((r) =>
      ROLE_OPTIONS.includes(r as (typeof ROLE_OPTIONS)[number])
    );
    const keywords = (parsed.keywords ?? [])
      .map((k) => String(k).trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 24);
    return {
      suggestedRoles: [...new Set(suggestedRoles)],
      keywords: [...new Set(keywords)],
    };
  } catch {
    return fallbackAnalysis(trimmed);
  }
}

function fallbackAnalysis(text: string): ResumeAnalysis {
  const lower = text.toLowerCase();
  const keywords = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(FALLBACK_SKILL_RE.source, "gi");
  while ((m = re.exec(lower)) !== null) {
    keywords.add(m[0].toLowerCase());
  }

  const suggestedRoles: string[] = [];
  if (/software|engineer|developer|frontend|backend|full.?stack/i.test(text)) {
    suggestedRoles.push("Software Engineering");
  }
  if (/data|analyst|analytics|machine learning|ml\b/i.test(text)) {
    suggestedRoles.push("Data & Analytics");
  }
  if (/product manager|\bpm\b|product management/i.test(text)) {
    suggestedRoles.push("Product");
  }
  if (/design|ux|ui|figma/i.test(text)) {
    suggestedRoles.push("Design");
  }
  if (/marketing|growth|content|social media/i.test(text)) {
    suggestedRoles.push("Marketing");
  }
  if (/operations|finance|strategy|consulting/i.test(text)) {
    suggestedRoles.push("Operations");
  }

  return {
    suggestedRoles: [...new Set(suggestedRoles)],
    keywords: [...keywords].slice(0, 20),
  };
}
