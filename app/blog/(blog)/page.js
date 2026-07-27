import BlogPage from "@/app/_components/Blog/BlogPage";
import React from "react";

export const metadata = {
  title: "Blog | RankGrind — Tips, Strategy & Study Guides",
  description:
    "Practical guides, exam strategy, and problem-solving tips to help you prepare smarter and track your progress on RankGrind.",
  alternates: {
    canonical: "https://rankgrind.com/blog",
  },
  openGraph: {
    title: "Blog | RankGrind",
    description:
      "Practical guides, exam strategy, and problem-solving tips to help you prepare smarter.",
    url: "https://rankgrind.com/blog",
    type: "website",
    images: ["/og/blog-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | RankGrind",
    description:
      "Practical guides, exam strategy, and problem-solving tips to help you prepare smarter.",
    images: ["/og/blog-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "RankGrind Blog",
  url: "https://rankgrind.com/blog",
  description:
    "Practical guides, exam strategy, and problem-solving tips to help you prepare smarter.",
};

export default function Blogs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPage />
    </>
  );
}
