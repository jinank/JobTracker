import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleLayout } from "@/components/BlogArticleLayout";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { BLOG_POSTS, getBlogPost } from "@/lib/blogPosts";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) {
    return buildPageMetadata({
      title: "Blog article",
      description: "Internship search tips and guides.",
      path: "/blog",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.tags,
    ogTitle: post.title,
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const { Content } = post;

  return (
    <>
      <BlogPostingJsonLd post={post} />
      <BlogArticleLayout post={post}>
        <Content />
      </BlogArticleLayout>
    </>
  );
}
