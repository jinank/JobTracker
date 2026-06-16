export const SITE_NAME = "Summer Internships";

function normalizeOrigin(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Canonical site origin for metadata, sitemap, robots, and JSON-LD.
 *
 * **Production:** set `NEXT_PUBLIC_SITE_URL` to the exact URL shown in Google Search
 * Console (including www vs non-www), e.g. `https://www.summer2027internships.com`.
 * Do not rely on `NEXTAUTH_URL` for SEO — it often points at an old or auth-only domain.
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeOrigin(explicit);

  // Vercel sets this to the project's primary production domain when configured.
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction && process.env.VERCEL_ENV === "production") {
    return normalizeOrigin(vercelProduction);
  }

  // Preview deployments only — never use ephemeral URLs in production sitemaps.
  if (process.env.VERCEL_ENV === "preview") {
    const vercel = process.env.VERCEL_URL?.trim();
    if (vercel) return normalizeOrigin(vercel);
  }

  if (process.env.NODE_ENV !== "production") {
    const auth = process.env.NEXTAUTH_URL?.trim();
    if (auth) return normalizeOrigin(auth);
  }

  return "http://localhost:3000";
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
