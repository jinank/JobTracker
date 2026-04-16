/**
 * Canonical site origin for metadata, sitemap, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://rethinkjobs.com).
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  const auth = process.env.NEXTAUTH_URL?.trim();
  if (auth) return auth.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
