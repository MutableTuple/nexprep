import Link from "next/link";
import { ArrowRight, Trophy, BookOpen, CheckCircle2 } from "lucide-react";
import { MILLENNIUM_PROBLEMS } from "@/app/_lib/millennium-problems";
import MillenniumDiagram from "@/app/_components/MillenniumDiagrams";

const TITLE = "The 7 Millennium Prize Problems — Explained | RankGrind";
const DESCRIPTION =
  "Deep, plain-English explainers for all seven $1,000,000 Millennium Prize Problems: P vs NP, Riemann Hypothesis, Poincaré Conjecture, Navier-Stokes, Hodge, Birch-Swinnerton-Dyer, Yang-Mills. With diagrams and current status.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/millennium-prize-problems" },
  keywords: [
    "millennium prize problems",
    "7 millennium problems",
    "millennium math problems",
    "clay mathematics institute",
    "p vs np problem",
    "riemann hypothesis",
    "poincare conjecture",
    "navier stokes",
    "hodge conjecture",
    "birch swinnerton dyer",
    "yang mills mass gap",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/millennium-prize-problems",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// JSON-LD ItemList schema — helps Google surface this page as a curated
// list and enables rich results for the 7 constituent items.
function buildJsonLd() {
  const site = "https://rankgrind.com";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The 7 Millennium Prize Problems",
    description: DESCRIPTION,
    numberOfItems: MILLENNIUM_PROBLEMS.length,
    itemListElement: MILLENNIUM_PROBLEMS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site}/millennium-prize-problems/${p.slug}`,
      name: p.title,
    })),
  };
}

export default function MillenniumIndexPage() {
  const solvedCount = MILLENNIUM_PROBLEMS.filter(
    (p) => p.status === "solved",
  ).length;
  const openCount = MILLENNIUM_PROBLEMS.length - solvedCount;

  return (
    <div className="min-h-screen bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-12 sm:py-16">
        {/* Hero */}
        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Trophy size={12} />
            $7,000,000 in prizes · Clay Mathematics Institute · 2000
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            The 7 Millennium Prize Problems
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
            Seven of the deepest open questions in mathematics, each with a{" "}
            <strong className="text-foreground">$1,000,000 prize</strong> for a
            correct solution. One has been solved (Poincaré, by Grigori
            Perelman). Six remain open. Plain-English explainers below —
            history, current status, diagrams, and what a proof would mean.
          </p>
          <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              {openCount} open
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-500" />
              {solvedCount} solved
            </span>
          </div>
        </header>

        {/* Grid */}
        <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {MILLENNIUM_PROBLEMS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/millennium-prize-problems/${p.slug}`}
              className="group flex flex-col rounded-3xl border border-border bg-background p-6 sm:p-7 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  #{i + 1} · {p.field.split(" · ")[0]}
                </span>
                {p.status === "solved" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                    <CheckCircle2 size={10} />
                    Solved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    Open
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {p.title}
              </h2>

              <div className="mt-4">
                <MillenniumDiagram id={p.diagram} className="h-32 [&_svg]:h-32 [&_svg]:w-auto mx-auto" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                {p.tldr.split("\n\n")[0]}
              </p>

              <div className="mt-auto pt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {p.posedYear} · {p.posedBy.split(" · ")[0]}
                </span>
                <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                  Read explainer
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* About Clay */}
        <section className="mt-14 rounded-3xl border border-border bg-background p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <BookOpen size={18} className="text-primary mt-1 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-foreground">
                About the Millennium Prize
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                In 2000, the Clay Mathematics Institute announced seven prize
                problems and offered $1,000,000 for the first correct solution
                to each. The list was curated with input from leading
                mathematicians — Andrew Wiles, John Tate, Alain Connes, Edward
                Witten, and others — to identify the deepest open questions
                across mathematics. Grigori Perelman's proof of the Poincaré
                Conjecture (verified by 2006) is the only prize awarded so
                far. He famously declined both the prize and the Fields Medal.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Explainers written for a general mathematically-curious audience.
          For formal statements and prize rules, see the{" "}
          <a
            href="https://www.claymath.org/millennium-problems/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Clay Mathematics Institute
          </a>
          .
        </p>
      </div>
    </div>
  );
}
