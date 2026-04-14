/**
 * Load .env.local (if present) and call OpenAI with the same model as classification.
 * Usage: node scripts/check-openai.cjs
 */
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai").default;
const {
  AuthenticationError,
  RateLimitError,
  APIError,
} = require("openai");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    console.error("OPENAI_API_KEY is missing (set it or add .env.local).");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: key });
  const model = "gpt-4o-mini";
  const t0 = Date.now();

  try {
    await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: "Reply with the single word: ok" }],
      max_tokens: 5,
      temperature: 0,
    });
    const ms = Date.now() - t0;
    console.log(`OpenAI OK — model ${model} responded in ${ms}ms`);
    process.exit(0);
  } catch (e) {
    if (e instanceof AuthenticationError) {
      console.error("OpenAI auth failed (401): invalid or revoked API key.");
      process.exit(2);
    }
    if (e instanceof RateLimitError) {
      console.error("OpenAI rate limited (429):", e.message);
      process.exit(3);
    }
    if (e instanceof APIError) {
      console.error(`OpenAI API error (${e.status ?? "?"}):`, e.message);
      process.exit(4);
    }
    console.error("Unexpected error:", e);
    process.exit(5);
  }
}

main();
