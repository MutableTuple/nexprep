import React from "react";
import Navbar from "../_components/Navbar";

export const metadata = {
  title: {
    default: "Practice Problems | Rank Grind JEE",
    template: "%s | Rank Grind JEE",
  },
  description:
    "Solve curated JEE Main & Advanced problems in Physics, Chemistry, and Mathematics. Build streaks, earn XP, and track your progress.",
  keywords: [
    "JEE preparation",
    "JEE Main problems",
    "JEE Advanced practice",
    "Physics problems",
    "Chemistry problems",
    "Mathematics problems",
    "IIT JEE",
  ],
  openGraph: {
    title: "Practice Problems | Rank Grind JEE",
    description:
      "Solve curated JEE problems and track your progress with streaks and XP.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Practice Problems | Rank Grind JEE",
    description:
      "Solve curated JEE problems and track your progress with streaks and XP.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function layout({ children }) {
  return <div>{children}</div>;
}
