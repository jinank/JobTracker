import { getSiteOrigin } from "@/lib/site";
import { resolveCallbackUrl } from "@/lib/loginUrl";

/**
 * Origin used in magic-link redirect URLs.
 * Production deploys always use the canonical site URL so emails never point at localhost.
 */
export function resolveAuthOrigin(request: Request): string {
  if (process.env.VERCEL_ENV === "production") {
    return getSiteOrigin();
  }

  const requestOrigin = new URL(request.url).origin;

  if (/^https?:\/\/localhost(:\d+)?$/i.test(requestOrigin)) {
    return requestOrigin;
  }

  if (process.env.VERCEL_ENV === "preview") {
    return requestOrigin;
  }

  return getSiteOrigin();
}

export function buildAuthCallbackRedirect(
  request: Request,
  callbackUrl?: string | null
): string {
  const origin = resolveAuthOrigin(request);
  const next = resolveCallbackUrl(callbackUrl);
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
