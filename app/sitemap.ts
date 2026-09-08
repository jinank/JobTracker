import type { MetadataRoute } from "next";
import { getPublicSitemapPaths } from "@/lib/sitemapPaths";
import { getSiteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();
  const fallbackModified = new Date();

  return getPublicSitemapPaths().map(({ path, changeFrequency, priority, lastModified }) => ({
    url: `${base}${path}`,
    lastModified: lastModified ? new Date(`${lastModified}T12:00:00`) : fallbackModified,
    changeFrequency,
    priority,
  }));
}
