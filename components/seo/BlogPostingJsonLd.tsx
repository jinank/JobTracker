import { getSiteOrigin } from "@/lib/site";
import type { BlogPost } from "@/lib/blogPosts";

export function BlogPostingJsonLd({ post }: { post: BlogPost }) {
  const origin = getSiteOrigin();
  const url = `${origin}/blog/${post.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Summer Internships",
    },
    publisher: {
      "@type": "Organization",
      name: "Summer Internships",
      logo: {
        "@type": "ImageObject",
        url: `${origin}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: post.tags.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
