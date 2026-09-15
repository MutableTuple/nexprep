import {
  getQuestionOfTheDay,
  getQuestionSolvers,
} from "@/app/_lib/data-service";
import HeroContent from "./HeroContent";

// next midnight IST (UTC+5:30, no DST), as a real UTC instant
function getNextMidnightIST() {
  const now = new Date();
  const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const istMidnight = Date.UTC(
    istNow.getUTCFullYear(),
    istNow.getUTCMonth(),
    istNow.getUTCDate() + 1,
  );
  return new Date(istMidnight - 5.5 * 60 * 60 * 1000).toISOString();
}

export default async function Hero() {
  // Solvers depend on knowing the question's id first, so it can't join
  // the initial Promise.all — everything else still fetches in parallel.
  const question = await getQuestionOfTheDay().catch(() => null);

  const solverData = question
    ? await getQuestionSolvers(question.id, 3).catch(() => ({
        solvers: [],
        totalCount: 0,
      }))
    : { solvers: [], totalCount: 0 };

  return (
    <HeroContent
      question={question}
      resetAt={getNextMidnightIST()}
      solvers={solverData.solvers}
      solversCount={solverData.totalCount}
    />
  );
}
