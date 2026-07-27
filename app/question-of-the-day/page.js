import React from "react";
import QuestionOfTheDayPage from "../_components/QuestionOfTheDayPage";

export const metadata = {
  title: "Question of the Day",
  description:
    "A new JEE Physics, Chemistry, or Maths practice question every day — build a daily streak and earn bonus XP on RankGrind.",
  alternates: { canonical: "/question-of-the-day" },
  openGraph: {
    title: "Question of the Day | RankGrind",
    description:
      "A new JEE practice question every day — build a daily streak and earn bonus XP.",
    url: "/question-of-the-day",
  },
};

export default function page() {
  return <QuestionOfTheDayPage />;
}
