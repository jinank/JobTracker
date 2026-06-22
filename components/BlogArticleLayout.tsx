import Link from "next/link";
import type { ReactNode } from "react";
import { SiteNavMarketing } from "@/components/SiteNav";
import { formatBlogDate, type BlogPost } from "@/lib/blogPosts";
import { SITE_NAME } from "@/lib/site";

type BlogArticleLayoutProps = {
  post: BlogPost;
  children: ReactNode;
};

export function BlogArticleLayout({ post, children }: BlogArticleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNavMarketing />
      <main id="main-content" className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-scale-purple"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to blog
          </Link>

          <header className="mt-6 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-scale-purple">
                {post.category}
              </span>
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span aria-hidden>·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{post.description}</p>
          </header>

          <div className="blog-article mt-10 space-y-5 text-base leading-relaxed text-slate-700">
            {children}
          </div>

          <footer className="mt-12 rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50 to-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">
              Ready to run your search on {SITE_NAME}?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Browse USA internships, track applications from Gmail, and practice interviews in one
              free student account.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/find-internships"
                className="inline-flex items-center justify-center rounded-xl bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-scale-purple-dark"
              >
                Find internships
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-scale-purple/40"
              >
                Create free account
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
