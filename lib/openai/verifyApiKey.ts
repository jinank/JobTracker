import OpenAI, {
  APIError,
  AuthenticationError,
  RateLimitError,
} from "openai";

const HEALTH_MODEL = "gpt-4o-mini";

export type OpenAiVerifyResult =
  | { ok: true; model: string; latencyMs: number }
  | {
      ok: false;
      error: string;
      code: "MISSING" | "INVALID_KEY" | "RATE_LIMIT" | "API_ERROR" | "UNKNOWN";
      status?: number;
    };

/**
 * One minimal chat completion (same API surface as email classification).
 * Use from admin routes or tooling — never expose raw keys in responses.
 */
export async function verifyOpenAiApiKey(): Promise<OpenAiVerifyResult> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return {
      ok: false,
      error: "OPENAI_API_KEY is not set",
      code: "MISSING",
    };
  }

  const openai = new OpenAI({ apiKey: key });
  const t0 = Date.now();

  try {
    await openai.chat.completions.create({
      model: HEALTH_MODEL,
      messages: [{ role: "user", content: "Reply with the single word: ok" }],
      max_tokens: 5,
      temperature: 0,
    });
    return { ok: true, model: HEALTH_MODEL, latencyMs: Date.now() - t0 };
  } catch (e: unknown) {
    if (e instanceof AuthenticationError) {
      return {
        ok: false,
        error: e.message,
        code: "INVALID_KEY",
        status: e.status,
      };
    }
    if (e instanceof RateLimitError) {
      return {
        ok: false,
        error: e.message,
        code: "RATE_LIMIT",
        status: e.status,
      };
    }
    if (e instanceof APIError) {
      return {
        ok: false,
        error: e.message,
        code: "API_ERROR",
        status: e.status,
      };
    }
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return { ok: false, error: message, code: "UNKNOWN" };
  }
}
