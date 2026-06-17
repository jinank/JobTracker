import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { SiteNavMarketing } from "@/components/SiteNav";
import { buildPageMetadata } from "@/lib/seo";
import { getBlogPostsNewestFirst } from "@/lib/blogPosts";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Internship search tips, application tracking guides, and USA internship advice from SuperInterns.",
  path: "/blog",
  keywords: ["internship tips", "job search blog", "application tracking", "summer internships"],
  ogTitle: "Blog — Internship search & application tips",
});

export default function BlogPage() {
  const posts = getBlogPostsNewestFirst();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteNavMarketing />
      <main id="main-content" className="flex-1">
        <div className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">Blog</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Internship search guides
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              Practical advice for finding USA internships, tracking applications, and preparing for
              interviews—without the spreadsheet chaos.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">Put the advice into practice</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Use {SITE_NAME} to browse US internships from company career pages, sync your
              application pipeline from Gmail, and run AI mock interviews—all free for verified
              students.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/find-jobs"
                className="inline-flex items-center justify-center rounded-xl bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-scale-purple-dark"
              >
                Browse internships
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-scale-purple/40"
              >
                Learn about {SITE_NAME}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
