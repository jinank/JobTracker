import Link from "next/link";
import { formatBlogDate, type BlogPost } from "@/lib/blogPosts";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-scale-purple">
          {post.category}
        </span>
        <span>{formatBlogDate(post.publishedAt)}</span>
        <span aria-hidden>·</span>
        <span>{post.readMinutes} min read</span>
      </div>
      <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 group-hover:text-scale-purple">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.description}</p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-scale-purple hover:underline"
      >
        Read article
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </article>
  );
}
