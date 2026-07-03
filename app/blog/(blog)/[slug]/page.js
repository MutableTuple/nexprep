import SingleBlogPage from "@/app/_components/Blog/SingleBlogPage";
import React from "react";

export default async function page({ params }) {
  const { slug } = await params;
  return <SingleBlogPage slug={slug} />;
}
