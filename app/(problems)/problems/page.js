import ProblemScreen from "@/app/_components/Problems/ProblemScreen";
import React from "react";

const TITLE = "Practice Problems | RankGrind";
const DESCRIPTION =
  "Browse and solve practice problems across topics — track your XP, streaks, and progress.";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const isFiltered = Boolean(sp?.search) || (sp?.page && sp.page !== "1");

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/problems" },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: "/problems",
    },
    // Search results and pages beyond 1 are thin/duplicate variants of the
    // same list — index only the canonical first page.
    robots: isFiltered ? { index: false, follow: true } : undefined,
  };
}

export default function page() {
  return <ProblemScreen />;
}
