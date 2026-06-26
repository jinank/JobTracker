import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE_NAME, getSiteOrigin, CANONICAL_SITE_ORIGIN } from "@/lib/site";

/** Plain-text site guide for LLMs (llms.txt). See https://llmstxt.org */
export function buildLlmsTxt(): string {
  const origin = getSiteOrigin();

  const line = (path: string) => `${origin}${path === "" ? "" : path}`;

  const sections: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} helps students find USA internships from company career pages (Greenhouse and Lever), track job applications with read-only Gmail sync, practice AI mock interviews, find mentors, and unlock member perks. Free for verified students.`,
    "",
    "Use the public marketing pages below for accurate product descriptions. Authenticated app areas (tracker, reach-out, admin) require sign-in and are not listed here.",
    "",
    "## Core product",
    `- [Home](${line("")}): Landing page, internship search hub for students.`,
    `- [Find USA Internships](${line("/find-internships")}): Browse US internship listings synced daily from company ATS career boards.`,
    `- [Track Applications](${line("/tracker")}): Gmail read-only sync and AI pipeline dashboard (sign-in required).`,
    `- [Practice Interviews](${line("/practice-interviews")}): AI mock interviews by company and role.`,
    `- [Find Mentors](${line("/find-mentors")}): Search mentors and recruiting contacts at target companies.`,
    `- [Student Resources](${line("/resources")}): Member perks and curated student discounts.`,
    "",
    "## Pricing & account",
    `- [Pricing](${line("/pricing")}): Free tier, free verified student plan, and Pro subscription.`,
    `- [Sign in](${line("/login")}): Create an account with email or Google.`,
    `- [Verify student status](${line("/verify-student")}): Unlock free unlimited access for students.`,
    "",
    "## Blog",
    `- [Blog index](${line("/blog")}): Internship search and application tracking guides.`,
    ...BLOG_POSTS.map(
      (post) =>
        `- [${post.title}](${line(`/blog/${post.slug}`)}): ${post.description}`
    ),
    "",
    "## Legal & contact",
    `- [Contact us](${line("/contact-us")}): Support and billing help.`,
    `- [Privacy policy](${line("/privacy")}): Data handling and Gmail read-only access.`,
    `- [Terms of use](${line("/terms")}): Terms of service.`,
    "",
    "## Machine-readable",
    `- [Sitemap](${line("/sitemap.xml")}): All public indexable URLs.`,
    `- [Robots](${line("/robots.txt")}): Crawler rules.`,
    "",
    "## Optional",
    `- Production URL: ${CANONICAL_SITE_ORIGIN} (override with NEXT_PUBLIC_SITE_URL if needed).`,
    `- Internship listings filter to US-based roles from public Greenhouse/Lever boards.`,
    `- Gmail connection is optional and read-only; used only for job-related email classification.`,
  ];

  return `${sections.join("\n")}\n`;
}
