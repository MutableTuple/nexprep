import { ComingSoonPage } from "../_components/ComingSoonPage";
import Navbar from "../_components/Navbar";

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
