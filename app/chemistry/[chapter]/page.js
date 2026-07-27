import { notFound } from "next/navigation";
import ChapterHubPage from "@/app/_components/Chapter/ChapterHubPage";
import { getChapterTaxonomy, getQuestionsPaged } from "@/app/_lib/data-service";

const SUBJECT = "Chemistry";
const SUBJECT_SLUG = "chemistry";

export async function generateStaticParams() {
  const chapters = await getChapterTaxonomy(SUBJECT);
  return chapters.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }) {
  const { chapter: chapterSlug } = await params;
  const chapters = await getChapterTaxonomy(SUBJECT);
  const match = chapters.find((c) => c.slug === chapterSlug);
  if (!match) return {};

  const title = `${match.chapter} — JEE Chemistry Practice Questions`;
  const description = `Practice ${match.count} JEE Main & Advanced Chemistry question${
    match.count === 1 ? "" : "s"
  } on ${match.chapter}. Free, with hints, step-by-step solutions, and instant XP.`;
  const canonicalUrl = `/${SUBJECT_SLUG}/${chapterSlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }) {
  const { chapter: chapterSlug } = await params;
  const chapters = await getChapterTaxonomy(SUBJECT);
  const match = chapters.find((c) => c.slug === chapterSlug);
  if (!match) notFound();

  const { questions, count } = await getQuestionsPaged({
    subject: SUBJECT,
    chapter: match.chapter,
    limit: 100,
  });

  const canonicalUrl = `https://rankgrind.com/${SUBJECT_SLUG}/${chapterSlug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${match.chapter} — JEE Chemistry Practice Questions`,
    url: canonicalUrl,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://rankgrind.com" },
        {
          "@type": "ListItem",
          position: 2,
          name: SUBJECT,
          item: `https://rankgrind.com/${SUBJECT_SLUG}`,
        },
        { "@type": "ListItem", position: 3, name: match.chapter, item: canonicalUrl },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChapterHubPage
        subject={SUBJECT}
        subjectSlug={SUBJECT_SLUG}
        chapter={match.chapter}
        topics={match.topics}
        questions={questions}
        count={count}
        siblingChapters={chapters.filter((c) => c.slug !== chapterSlug)}
      />
    </>
  );
}
