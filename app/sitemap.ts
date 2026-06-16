import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";
import { PRACTICE_INTERVIEWS } from "@/lib/practiceInterviewsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();
  const now = new Date();

  const paths: {
    path: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/login", changeFrequency: "monthly", priority: 0.6 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/find-jobs", changeFrequency: "daily", priority: 0.95 },
    { path: "/find-mentors", changeFrequency: "weekly", priority: 0.85 },
    { path: "/resources", changeFrequency: "weekly", priority: 0.85 },
    { path: "/practice-interviews", changeFrequency: "weekly", priority: 0.85 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.75 },
    { path: "/contact-us", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/verify-student", changeFrequency: "monthly", priority: 0.55 },
    ...PRACTICE_INTERVIEWS.map((interview) => ({
      path: `/practice-interviews/${interview.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return paths.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
