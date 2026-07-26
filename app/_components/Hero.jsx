import {
  getQuestionOfTheDay,
  getLeaderboard,
  getPublishedQuestionCount,
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
  const [question, leaderboard, questionCount] = await Promise.all([
    getQuestionOfTheDay().catch(() => null),
    getLeaderboard(5).catch(() => []),
    getPublishedQuestionCount().catch(() => 0),
  ]);

  return (
    <HeroContent
      question={question}
      leaderboard={leaderboard}
      resetAt={getNextMidnightIST()}
      questionCount={questionCount}
    />
  );
}
