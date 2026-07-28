import ExamHubPage from "@/app/_components/Exam/ExamHubPage";
import { getQuestionsPaged } from "@/app/_lib/data-service";
import { buildExamFaqs } from "@/app/_lib/faq";
import FaqSection from "@/app/_components/FaqSection";

const EXAM = "JEE Main";
const PAGE_SIZE = 12;

const TITLE = "JEE Main Practice Questions";
const DESCRIPTION =
  "Practice JEE Main exam questions across Physics, Chemistry, and Maths. Filter by subject and difficulty, and solve with instant XP and streak tracking.";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const isFiltered =
    Boolean(sp?.search) ||
    Boolean(sp?.subject) ||
    Boolean(sp?.difficulty) ||
    (sp?.page && sp.page !== "1");

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/jee-main" },
    openGraph: { title: TITLE, description: DESCRIPTION, url: "/jee-main" },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
    robots: isFiltered ? { index: false, follow: true } : undefined,
  };
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const subject = sp.subject ?? "All";
  const difficulty = sp.difficulty ?? "All";
  const search = sp.search ?? "";
  const isUnfiltered =
    !sp.search && !sp.subject && !sp.difficulty && (!sp.page || sp.page === "1");

  const { questions, count } = await getQuestionsPaged({
    exam: EXAM,
    subject: subject === "All" ? undefined : subject,
    difficulties: difficulty === "All" ? [] : [difficulty],
    search,
    page,
    limit: PAGE_SIZE,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: "https://rankgrind.com/jee-main",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://rankgrind.com" },
        { "@type": "ListItem", position: 2, name: EXAM, item: "https://rankgrind.com/jee-main" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExamHubPage
        examLabel={EXAM}
        questions={questions}
        count={count}
        page={page}
        subject={subject}
        difficulty={difficulty}
        search={search}
        pageSize={PAGE_SIZE}
        // FAQ answers quote the total question count, which is only correct
        // on the unfiltered view — and that is the only version we index.
        faqSlot={
          isUnfiltered ? (
            <FaqSection faqs={buildExamFaqs({ examLabel: EXAM, count })} />
          ) : null
        }
      />
    </>
  );
}
