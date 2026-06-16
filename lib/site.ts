export const SITE_NAME = "Summer Internships";

/** Primary production domain — sitemap, metadata, and OAuth should use this. */
export const CANONICAL_SITE_ORIGIN = "https://www.summer2027internships.com";

export const CANONICAL_SITE_HOST = "www.summer2027internships.com";

const DEPRECATED_ORIGIN_PATTERN = /rethinkjobs\.(tech|com)/i;

export function isDeprecatedSiteOrigin(url: string): boolean {
  return DEPRECATED_ORIGIN_PATTERN.test(url);
}

function normalizeOrigin(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function sanitizeOrigin(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (isDeprecatedSiteOrigin(url)) return undefined;
  return normalizeOrigin(url);
}

/** Public support inbox (override with NEXT_PUBLIC_SUPPORT_EMAIL). */
export function getSupportEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  if (fromEnv && !fromEnv.includes("rethinksoft") && !fromEnv.includes("rethinkjobs")) {
    return fromEnv;
  }
  return "support@summer2027internships.com";
}

/**
 * Canonical site origin for metadata, sitemap, robots, and JSON-LD.
 * Ignores deprecated rethinkjobs.* values in env vars.
 */
export function getSiteOrigin(): string {
  const explicit = sanitizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;

  const vercelProduction = sanitizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercelProduction && process.env.VERCEL_ENV === "production") {
    return vercelProduction;
  }

  if (process.env.VERCEL_ENV === "preview") {
    const vercel = sanitizeOrigin(process.env.VERCEL_URL);
    if (vercel) return vercel;
  }

  if (process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production") {
    const auth = sanitizeOrigin(process.env.NEXTAUTH_URL);
    if (auth) return auth;
    return "http://localhost:3000";
  }

  return CANONICAL_SITE_ORIGIN;
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
