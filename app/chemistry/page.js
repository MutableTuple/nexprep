import ChemistryPage from "../_components/Chemistry/ChemistryPage";
import { getQuestionsPaged } from "@/app/_lib/data-service";

const PAGE_SIZE = 12;

export async function generateMetadata({ searchParams }) {
  const { search } = await searchParams;
  return {
    title: search
      ? `"${search}" — Chemistry Questions | JEE Platform`
      : "Chemistry Questions — Practice JEE Chemistry Problems | JEE Platform",
    description:
      "Practice Chemistry problems for JEE Main & Advanced. Filter by difficulty, search by topic, and solve questions with instant XP and streak tracking.",
  };
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const difficulty = sp.difficulty ?? "All";
  const search = sp.search ?? "";

  const { questions, count } = await getQuestionsPaged({
    subject: "Chemistry",
    difficulties: difficulty === "All" ? [] : [difficulty],
    search,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <ChemistryPage
      questions={questions}
      count={count}
      page={page}
      difficulty={difficulty}
      search={search}
      pageSize={PAGE_SIZE}
    />
  );
}
