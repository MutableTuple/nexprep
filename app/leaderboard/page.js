import React from "react";
import LeaderboardPage from "../_components/LeaderboardPage";
import Navbar from "../_components/Navbar";

export const metadata = {
  title: "Leaderboard",
  description:
    "See how you rank against other JEE aspirants on RankGrind — XP, streaks, and top performers across Physics, Chemistry, and Maths.",
  alternates: { canonical: "/leaderboard" },
  openGraph: {
    title: "Leaderboard | RankGrind",
    description:
      "See how you rank against other JEE aspirants on RankGrind — XP, streaks, and top performers.",
    url: "/leaderboard",
  },
};

export default function page() {
  return (
    <>
      <LeaderboardPage />
    </>
  );
}
