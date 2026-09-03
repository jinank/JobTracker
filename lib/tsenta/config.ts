const TSENTA_API_BASE = "https://api.autojobs.me/v1";

export const TSENTA_DAILY_APPLY_CAP = 25;
export const TSENTA_RESUME_BUCKET = "resumes";
export const TSENTA_SIGNED_URL_SECONDS = 60 * 60 * 24 * 7;

export function getTsentaApiBase(): string {
  return TSENTA_API_BASE;
}

export function getTsentaApiKey(): string | null {
  const key = process.env.TSENTA_API_KEY?.trim();
  return key || null;
}

export function isTsentaConfigured(): boolean {
  return Boolean(getTsentaApiKey());
}

export function getTsentaWebhookSecret(): string | null {
  const secret = process.env.TSENTA_WEBHOOK_SECRET?.trim();
  return secret || null;
}

export function tsentaNotConfiguredMessage(): string {
  return "Auto Apply is not available right now. Open the listing and apply on the company site.";
}
