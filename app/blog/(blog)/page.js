import BlogPage from "@/app/_components/Blog/BlogPage";
import React from "react";

const DESCRIPTION =
  "Practical guides, exam strategy, and problem-solving tips for JEE Main & Advanced aspirants — from the RankGrind team.";

export const metadata = {
  // No brand suffix here: the root layout applies "%s | rankgrind.com", so
  // adding it again rendered "Blog | RankGrind — … | rankgrind.com".
  title: "Blog — JEE Tips, Strategy & Study Guides",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — JEE Tips, Strategy & Study Guides",
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
    // No `images` key: listing one here would override the generated
    // opengraph-image.jsx in this folder. The old value pointed at
    // /og/blog-default.png, which does not exist.
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — JEE Tips, Strategy & Study Guides",
    description: DESCRIPTION,
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
