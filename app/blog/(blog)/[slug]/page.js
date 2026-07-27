import SingleBlogPage from "@/app/_components/Blog/SingleBlogPage";
import { getPostBySlug } from "@/app/_data/posts";
import React from "react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  const canonicalUrl = `/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, "JEE", "JEE Main", "JEE Advanced"],
    authors: [{ name: post.author }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function page({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: new Date(post.date).toISOString(),
        author: { "@type": "Person", name: post.author },
        publisher: {
          "@type": "Organization",
          name: "RankGrind",
          url: "https://rankgrind.com",
        },
        articleSection: post.category,
        mainEntityOfPage: `https://rankgrind.com/blog/${slug}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <SingleBlogPage slug={slug} />
    </>
  );
}
