import ChemistryPage from "../_components/Chemistry/ChemistryPage";
import { getQuestionsPaged, getChapterTaxonomy } from "@/app/_lib/data-service";

const PAGE_SIZE = 12;

const TITLE = "Chemistry Questions — Practice JEE Chemistry Problems";
const DESCRIPTION =
  "Practice Chemistry problems for JEE Main & Advanced. Filter by difficulty, search by topic, and solve questions with instant XP and streak tracking.";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const isFiltered = Boolean(sp?.search) || (sp?.page && sp.page !== "1");

  return {
    title: sp?.search ? `"${sp.search}" — Chemistry Questions` : TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/chemistry" },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: "/chemistry",
    },
    robots: isFiltered ? { index: false, follow: true } : undefined,
  };
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const difficulty = sp.difficulty ?? "All";
  const search = sp.search ?? "";

  const [{ questions, count }, chapters] = await Promise.all([
    getQuestionsPaged({
      subject: "Chemistry",
      difficulties: difficulty === "All" ? [] : [difficulty],
      search,
      page,
      limit: PAGE_SIZE,
    }),
    getChapterTaxonomy("Chemistry").catch(() => []),
  ]);

  return (
    <ChemistryPage
      questions={questions}
      count={count}
      page={page}
      difficulty={difficulty}
      search={search}
      pageSize={PAGE_SIZE}
      chapters={chapters}
    />
  );
}
