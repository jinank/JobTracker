import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();
  const now = new Date();

  const paths: {
    path: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  }[] = [
      { path: "", changeFrequency: "weekly", priority: 1 },
      { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
      { path: "/resources", changeFrequency: "weekly", priority: 0.85 },
      { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
      { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
      { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
      { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
      { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
      { path: "/verify-student", changeFrequency: "monthly", priority: 0.55 },
      { path: "/reach-out", changeFrequency: "monthly", priority: 0.55 },
      { path: "/success", changeFrequency: "monthly", priority: 0.3 },
    ];

  return paths.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
