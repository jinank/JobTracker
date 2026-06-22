import { getBlogPostsNewestFirst } from "@/lib/blogPosts";
import { PRACTICE_INTERVIEWS } from "@/lib/practiceInterviewsData";

export type SitemapPathEntry = {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  /** ISO date string for lastModified when known */
  lastModified?: string;
};

function blogSitemapEntries(): SitemapPathEntry[] {
  const posts = getBlogPostsNewestFirst();
  const recentMonth = posts[0]?.publishedAt.slice(0, 7);

  return posts.map((post) => {
    const isRecent = recentMonth != null && post.publishedAt.startsWith(recentMonth);

    return {
      path: `/blog/${post.slug}`,
      changeFrequency: isRecent ? ("weekly" as const) : ("monthly" as const),
      priority: isRecent ? 0.8 : 0.72,
      lastModified: post.updatedAt ?? post.publishedAt,
    };
  });
}

/** Public URLs included in sitemap.xml and llms.txt */
export function getPublicSitemapPaths(): SitemapPathEntry[] {
  const blogPosts = getBlogPostsNewestFirst();

  return [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/find-internships", changeFrequency: "daily", priority: 0.95 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/find-mentors", changeFrequency: "weekly", priority: 0.85 },
    { path: "/resources", changeFrequency: "weekly", priority: 0.85 },
    { path: "/practice-interviews", changeFrequency: "weekly", priority: 0.85 },
    {
      path: "/blog",
      changeFrequency: "weekly",
      priority: 0.78,
      lastModified: blogPosts[0]?.updatedAt ?? blogPosts[0]?.publishedAt,
    },
    ...blogSitemapEntries(),
    { path: "/login", changeFrequency: "monthly", priority: 0.6 },
    { path: "/verify-student", changeFrequency: "monthly", priority: 0.55 },
    { path: "/contact-us", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    ...PRACTICE_INTERVIEWS.map((interview) => ({
      path: `/practice-interviews/${interview.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
