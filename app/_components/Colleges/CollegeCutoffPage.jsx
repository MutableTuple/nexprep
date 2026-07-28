import Link from "next/link";
import { ChevronRight, Home, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { QUOTA_LABEL, TYPE_LABEL } from "@/app/_lib/cutoffs";
import { buildCollegeFaqs } from "@/app/_lib/faq";
import FaqSection from "@/app/_components/FaqSection";

const CATEGORY_ORDER = ["OPEN", "EWS", "OBC-NCL", "SC", "ST"];

// A *lower* closing rank means the branch got harder to get into, so the
// arrow direction is deliberately inverted vs. the raw number.
// `points` guards the single-year case: one data point is not a trend, and
// rendering it as "stable" would imply a flat history that was never
// measured (new branches show exactly one year).
function Trend({ first, last, points }) {
  if (first == null || last == null) return null;
  if (points < 2) {
    return <span className="text-muted-foreground opacity-60">—</span>;
  }
  const delta = last - first;
  const pct = first === 0 ? 0 : Math.round((delta / first) * 100);
  if (Math.abs(pct) < 5) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Minus size={12} /> stable
      </span>
    );
  }
  return delta < 0 ? (
    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
      <TrendingDown size={12} /> {Math.abs(pct)}% tighter
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
      <TrendingUp size={12} /> {pct}% looser
    </span>
  );
}

export default function CollegeCutoffPage({ college }) {
  const { name, fullName, type, quota, years, programs } = college;
  const latestYear = years.at(-1);
  const firstYear = years[0];

  const withCategories = programs.filter(
    (p) => Object.keys(p.categories ?? {}).length > 1,
  );

  const faqs = buildCollegeFaqs(college);
  const rankType = type === "IIT" ? "JEE Advanced" : "JEE Main";

  // Most/least competitive branch in the latest year, for the answer block.
  const ranked = programs.filter((p) => p.trend?.[latestYear]?.[1] != null);
  const hardest = ranked[0] ?? null;
  const easiest = ranked.length > 1 ? ranked[ranked.length - 1] : null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-foreground">
            <Home size={14} />
          </Link>
          <ChevronRight size={12} />
          <Link href="/colleges" className="hover:text-foreground">
            Colleges
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">{name}</span>
        </nav>

        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {name} Cutoff — JoSAA Opening &amp; Closing Ranks ({firstYear}–
            {latestYear})
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
            Final-round JoSAA closing ranks for {fullName} across{" "}
            {programs.length} program{programs.length === 1 ? "" : "s"} and{" "}
            {years.length} year{years.length === 1 ? "" : "s"}. Figures are{" "}
            <strong className="text-foreground">
              {QUOTA_LABEL[quota] ?? quota}
            </strong>{" "}
            quota, Open category, gender-neutral seats — the pool most
            applicants compete in.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-foreground text-background font-medium">
              {type}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              {TYPE_LABEL[type] ?? type}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              {QUOTA_LABEL[quota] ?? quota} quota
            </span>
          </div>
        </header>

        {/* ── Direct answer block ──
            A self-contained factual summary immediately after the H1. This is
            what featured snippets and AI answer engines lift, so every
            qualifier (year, quota, category, rank type) is inline rather than
            implied by surrounding context. */}
        {hardest && (
          <section className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-foreground leading-relaxed">
              <strong>In {latestYear}</strong>, the most competitive branch at{" "}
              {name} was <strong>{hardest.branch}</strong>, which closed at{" "}
              {rankType} rank{" "}
              <strong>
                {hardest.trend[latestYear][1].toLocaleString("en-IN")}
              </strong>{" "}
              in the final JoSAA round
              {easiest && (
                <>
                  , while {easiest.branch} closed at{" "}
                  {easiest.trend[latestYear][1].toLocaleString("en-IN")}
                </>
              )}
              . Figures are {QUOTA_LABEL[quota] ?? quota} quota, Open category,
              gender-neutral seats. {name} has {programs.length} programs with
              published cutoffs across {years.length} years (
              {years[0]}–{latestYear}).
            </p>
          </section>
        )}

        {/* ── Closing-rank trend ── */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Closing rank by branch, {firstYear}–{latestYear}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Lower rank = more competitive. Sorted by most competitive in{" "}
            {latestYear}.
          </p>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-background">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left font-semibold px-4 py-3 sticky left-0 bg-muted/50 min-w-[220px]">
                    Branch
                  </th>
                  {years.map((y) => (
                    <th
                      key={y}
                      className="text-right font-semibold px-3 py-3 whitespace-nowrap"
                    >
                      {y}
                    </th>
                  ))}
                  <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => {
                  const firstVal = years
                    .map((y) => p.trend[y]?.[1])
                    .find((v) => v != null);
                  const lastVal = [...years]
                    .reverse()
                    .map((y) => p.trend[y]?.[1])
                    .find((v) => v != null);
                  return (
                    <tr
                      key={`${p.branch}|${p.degree}`}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 sticky left-0 bg-background">
                        <span className="font-medium text-foreground">
                          {p.branch}
                        </span>
                        {p.degree && (
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {p.years ? `${p.years}-year ` : ""}
                            {p.degree}
                          </span>
                        )}
                      </td>
                      {years.map((y) => (
                        <td
                          key={y}
                          className="text-right px-3 py-3 tabular-nums whitespace-nowrap text-muted-foreground"
                        >
                          {p.trend[y] ? (
                            p.trend[y][1].toLocaleString("en-IN")
                          ) : (
                            <span className="opacity-40">—</span>
                          )}
                        </td>
                      ))}
                      <td className="text-right px-4 py-3 whitespace-nowrap text-xs">
                        <Trend
                          first={firstVal}
                          last={lastVal}
                          points={
                            years.filter((y) => p.trend[y] != null).length
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Latest year, by category ── */}
        {withCategories.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              {latestYear} closing rank by category
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {/* explicit space: JSX drops the literal one when an expression
                  opens the line, rendering "All Indiaquota" */}
              {QUOTA_LABEL[quota] ?? quota}{" "}
              quota, gender-neutral seats, final
              round. Columns are not directly comparable — Open is a Common
              Rank List rank, while EWS, OBC-NCL, SC and ST are ranks within
              each category&apos;s own list, so a smaller number in a reserved
              column does not mean it was harder to get in.
            </p>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-background">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-semibold px-4 py-3 sticky left-0 bg-muted/50 min-w-[220px]">
                      Branch
                    </th>
                    {CATEGORY_ORDER.map((c) => (
                      <th
                        key={c}
                        className="text-right font-semibold px-3 py-3 whitespace-nowrap"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {withCategories.map((p) => (
                    <tr
                      key={`${p.branch}|${p.degree}`}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 sticky left-0 bg-background">
                        <span className="font-medium text-foreground">
                          {p.branch}
                        </span>
                        {p.degree && (
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {p.degree}
                          </span>
                        )}
                      </td>
                      {CATEGORY_ORDER.map((c) => (
                        <td
                          key={c}
                          className="text-right px-3 py-3 tabular-nums whitespace-nowrap text-muted-foreground"
                        >
                          {p.categories[c] ? (
                            p.categories[c][1].toLocaleString("en-IN")
                          ) : (
                            <span className="opacity-40">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <FaqSection
          faqs={faqs}
          heading={`${name} cutoff — frequently asked questions`}
        />

        {/* ── Provenance ── */}
        <section className="rounded-2xl border border-border bg-background p-5 text-xs leading-6 text-muted-foreground">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            About this data
          </h2>
          <p>
            Ranks are final-round JoSAA seat-allotment opening and closing
            ranks, sourced from the official{" "}
            <a
              href="https://josaa.nic.in/or-cr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              JoSAA Opening &amp; Closing Rank
            </a>{" "}
            tables. IIT ranks are JEE Advanced ranks; NIT, IIIT and GFTI ranks
            are JEE Main ranks.
          </p>
          <p className="mt-2">
            Data currently runs through <strong>{latestYear}</strong>. Years
            before 2018 predate the female-supernumerary split, so those
            figures reflect a single combined pool rather than a separate
            gender-neutral one.
          </p>
          <p className="mt-2">
            These are historical results, not predictions. Cutoffs shift every
            year with paper difficulty, seat matrix and applicant numbers —
            always confirm against JoSAA or CSAB before making an admission
            decision.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-background p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Practising for {name}?
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Work through real{" "}
            <Link href="/jee-advanced" className="underline hover:text-foreground">
              JEE Advanced
            </Link>{" "}
            and{" "}
            <Link href="/jee-main" className="underline hover:text-foreground">
              JEE Main
            </Link>{" "}
            questions with hints and step-by-step solutions, or browse the full{" "}
            <Link href="/problems" className="underline hover:text-foreground">
              question bank
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
