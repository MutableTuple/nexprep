import { ComingSoonPage } from "../_components/ComingSoonPage";
import Navbar from "../_components/Navbar";

export const metadata = {
  title: "JEE Mock Tests",
  description:
    "Full-length, timed JEE Main & Advanced mock tests with per-topic analysis and rank comparison — coming soon to RankGrind.",
  alternates: { canonical: "/mock-tests" },
  openGraph: {
    title: "JEE Mock Tests | RankGrind",
    description:
      "Full-length, timed JEE Main & Advanced mock tests with per-topic analysis and rank comparison.",
    url: "/mock-tests",
  },
};

export default function page() {
  return (
    <>
      <ComingSoonPage
        title="Mock tests are coming"
        description="Full JEE-style timed tests with detailed analysis."
        features={[
          { icon: "⏱️", label: "Timed tests", desc: "Real exam conditions" },
          { icon: "📊", label: "Analysis", desc: "Per-topic breakdown" },
          { icon: "🏅", label: "Rank", desc: "See where you stand" },
        ]}
      />
    </>
  );
}
