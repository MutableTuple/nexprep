import SolveProblemScreen from "@/app/_components/Problems/SolveProblemScreen";
import { getQuestionById } from "@/app/_lib/data-service";
import React from "react";

export async function generateMetadata({ params }) {
  const { problemname, id } = await params;
  const question = await getQuestionById(id).catch(() => null);

  if (!question) return {};

  const description = question.question?.replace(/\s+/g, " ").slice(0, 200);
  const canonicalUrl = `/problems/solve/${problemname}/${id}`;

  return {
    title: question.title,
    description,
    keywords: [
      question.title,
      question.subject,
      question.chapter,
      question.topic,
      "JEE practice problem",
    ].filter(Boolean),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${question.title} | RankGrind`,
      description,
      url: canonicalUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${question.title} | RankGrind`,
      description,
    },
  };
}

export default async function page({ params }) {
  const { problemname, id } = await params;
  const question = await getQuestionById(id).catch(() => null);

  const jsonLd = question
    ? {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: question.title,
        about: question.subject,
        educationalLevel: "JEE",
        text: question.question,
        provider: {
          "@type": "Organization",
          name: "RankGrind",
          url: "https://rankgrind.com",
        },
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
      <SolveProblemScreen questionId={id} problemname={problemname} />
    </>
  );
}
