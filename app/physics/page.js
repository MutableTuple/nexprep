import PhysicsPage from "../_components/Physics/PhysicsPage";
import { getQuestionsPaged, getChapterTaxonomy } from "@/app/_lib/data-service";

const PAGE_SIZE = 12;

const TITLE = "Physics Questions — Practice JEE Physics Problems";
const DESCRIPTION =
  "Practice Physics problems for JEE Main & Advanced. Filter by difficulty, search by topic, and solve questions with instant XP and streak tracking.";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const isFiltered = Boolean(sp?.search) || (sp?.page && sp.page !== "1");

  return {
    title: sp?.search ? `"${sp.search}" — Physics Questions` : TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/physics" },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: "/physics",
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
      subject: "Physics",
      difficulties: difficulty === "All" ? [] : [difficulty],
      search,
      page,
      limit: PAGE_SIZE,
    }),
    getChapterTaxonomy("Physics").catch(() => []),
  ]);

  return (
    <PhysicsPage
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
