import ProblemScreen from "@/app/_components/Problems/ProblemScreen";
import React from "react";

// The root layout applies a "%s | rankgrind.com" template, so the brand must
// NOT be repeated here — it rendered as "… | RankGrind | rankgrind.com".
const TITLE = "JEE Practice Questions — Physics, Chemistry & Maths";
const DESCRIPTION =
  "Browse and solve free JEE Main & Advanced practice questions across Physics, Chemistry and Maths, with hints, step-by-step solutions, and XP and streak tracking.";

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
