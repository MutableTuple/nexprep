import Link from "next/link";
import { Search, Info, ChevronRight, Home } from "lucide-react";
import {
  predictColleges,
  getDataYearRange,
  CATEGORIES,
  GENDERS,
  QUOTAS,
  TYPES,
  CHANCE_META,
  CHANCE_ORDER,
} from "@/app/_lib/predictor";
import { buildPredictorFaqs } from "@/app/_lib/faq";
import FaqSection from "@/app/_components/FaqSection";

const TITLE = "JEE College Predictor — JoSAA Cutoff Based";
const DESCRIPTION =
  "Enter your JEE rank to see which IITs, NITs, IIITs and GFTIs admitted at that rank, based on official JoSAA closing ranks. Shows the real min, average and max closing rank behind every result.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "JEE college predictor",
    "JoSAA college predictor",
    "JEE rank to college",
    "which college for my JEE rank",
    "IIT NIT college predictor",
  ],
  alternates: { canonical: "/college-predictor" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/college-predictor" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function Field({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

const selectCls =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground";

export default async function Page({ searchParams }) {
  const sp = await searchParams;

  const rankRaw = sp?.rank ?? "";
  const rank = parseInt(rankRaw, 10);
  const hasRank = Number.isFinite(rank) && rank > 0;

  const category = sp?.category ?? "OPEN";
  const gender = sp?.gender ?? "Gender-Neutral";
  const quota = sp?.quota ?? "";
  const yearsBack = parseInt(sp?.years ?? "3", 10) || 3;
  const selectedTypes = sp?.type
    ? Array.isArray(sp.type)
      ? sp.type
      : [sp.type]
    : [];

  let results = [];
  let error = null;
  let range = { minYear: null, maxYear: null };

  try {
    range = await getDataYearRange();
  } catch {
    // Range is decorative; a failure here shouldn't block the tool.
  }

  if (hasRank) {
    try {
      results = await predictColleges({
        rank,
        category,
        gender,
        quota,
        types: selectedTypes,
        yearsBack,
      });
    } catch (e) {
      error = e?.message ?? "Could not load predictions.";
    }
  }

  // Rows are ordered most-competitive-first inside each bucket, so the head
  // of "Safe" is the best a student can comfortably get. Past a few dozen it
  // is just progressively worse options nobody scrolls to, so cap the render
  // and say how many were held back.
  const PER_BUCKET = 60;

  const grouped = CHANCE_ORDER.map((c) => {
    const all = results.filter((r) => r.chance === c);
    return {
      chance: c,
      ...CHANCE_META[c],
      total: all.length,
      items: all.slice(0, PER_BUCKET),
      hidden: Math.max(0, all.length - PER_BUCKET),
    };
  }).filter((g) => g.total > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JEE College Predictor",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    url: "https://rankgrind.com/college-predictor",
    description: DESCRIPTION,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  // "How to use a college predictor" is a question answer engines get asked
  // directly, so the steps are marked up rather than left as prose.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to find which college you can get with your JEE rank",
    description:
      "Use official JoSAA closing ranks to find which IITs, NITs, IIITs and GFTIs admitted at your rank.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter your rank",
        text: "Enter your category rank — your JEE Advanced rank for IITs, or your JEE Main rank for NITs, IIITs and GFTIs. Do not enter a percentile.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select your category and seat pool",
        text: "Choose your reservation category (Open, EWS, OBC-NCL, SC or ST) and whether you are looking at gender-neutral or female-only supernumerary seats.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose quota and institute types",
        text: "IITs allot seats on an All India basis, while NITs, IIITs and GFTIs split seats into Home State and Other State quotas. Leave quota as Any to see everything.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Read the results",
        text: "Options are grouped as Safe, Likely or Reach based on the toughest, typical and easiest closing rank over the last three JoSAA final rounds. Check the numbers shown beside each result to judge how thin the margin is.",
      },
    ],
  };

  const faqs = buildPredictorFaqs({
    minYear: range.minYear ?? 2016,
    maxYear: range.maxYear ?? 2024,
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-foreground">
            <Home size={14} />
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">College Predictor</span>
        </nav>

        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            JEE College Predictor
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
            Enter your rank to see which institutes and branches actually
            admitted at that rank
            {range.minYear
              ? `, based on official JoSAA final-round closing ranks through ${range.maxYear}`
              : ", based on official JoSAA final-round closing ranks"}
            . Every result shows the real numbers it was judged on — no hidden
            scoring.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Use your <strong className="text-foreground">JEE Advanced</strong>{" "}
            rank for IITs and your{" "}
            <strong className="text-foreground">JEE Main</strong> rank for
            NITs, IIITs and GFTIs — they are different rank lists.
          </p>
        </header>

        {/* ── Form (plain GET: works without JS and stays linkable) ── */}
        <form
          method="GET"
          className="rounded-2xl border border-border bg-background p-5 flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Your rank" hint="Category rank, not percentile">
              <input
                type="number"
                name="rank"
                min="1"
                required
                defaultValue={rankRaw}
                placeholder="e.g. 4500"
                className={selectCls}
              />
            </Field>

            <Field label="Category">
              <select name="category" defaultValue={category} className={selectCls}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Seat pool">
              <select name="gender" defaultValue={gender} className={selectCls}>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quota" hint="IITs use All India only">
              <select name="quota" defaultValue={quota} className={selectCls}>
                {QUOTAS.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-xs font-medium text-foreground mb-1.5">
                Institute types
              </legend>
              <div className="flex flex-wrap gap-3">
                {TYPES.map((t) => (
                  <label
                    key={t.value}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground"
                  >
                    <input
                      type="checkbox"
                      name="type"
                      value={t.value}
                      defaultChecked={selectedTypes.includes(t.value)}
                      className="accent-foreground"
                    />
                    {t.label}
                  </label>
                ))}
                <span className="text-[11px] text-muted-foreground self-center">
                  (none = all)
                </span>
              </div>
            </fieldset>

            <div className="flex items-end gap-3">
              <Field label="Years considered">
                <select name="years" defaultValue={String(yearsBack)} className={selectCls}>
                  <option value="3">Last 3 years</option>
                  <option value="5">Last 5 years</option>
                </select>
              </Field>
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-foreground text-background text-sm font-semibold inline-flex items-center gap-2"
              >
                <Search size={15} />
                Predict
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {hasRank && !error && results.length === 0 && (
          <div className="rounded-2xl border border-border bg-background p-8 text-center">
            <p className="text-base font-semibold text-foreground">
              No options found at rank {rank.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              No institute in this filter admitted at that rank in the last{" "}
              {yearsBack} years. Try widening the institute types, changing the
              quota, or checking you picked the right category.
            </p>
          </div>
        )}

        {grouped.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2">
              {grouped.map((g) => (
                <span
                  key={g.chance}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium ${g.tone}`}
                >
                  {g.total} {g.label}
                </span>
              ))}
            </div>

            {grouped.map((g) => (
              <section key={g.chance}>
                <h2 className="text-lg font-semibold text-foreground">
                  {g.label}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    — {g.blurb}
                  </span>
                </h2>

                <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-background">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left font-semibold px-4 py-3 min-w-[260px]">
                          Institute &amp; branch
                        </th>
                        <th className="text-left font-semibold px-3 py-3">
                          Quota
                        </th>
                        <th className="text-right font-semibold px-3 py-3 whitespace-nowrap">
                          Toughest
                        </th>
                        <th className="text-right font-semibold px-3 py-3 whitespace-nowrap">
                          Typical
                        </th>
                        <th className="text-right font-semibold px-3 py-3 whitespace-nowrap">
                          Easiest
                        </th>
                        <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">
                          Latest
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map((r, i) => (
                        <tr
                          key={`${r.institute_slug}|${r.branch}|${r.degree}|${r.quota}|${i}`}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/colleges/${r.institute_slug}`}
                              className="font-medium text-foreground hover:underline"
                            >
                              {r.institute_name}
                            </Link>
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {r.branch}
                              {r.degree ? ` · ${r.degree}` : ""}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {r.quota}
                          </td>
                          <td className="text-right px-3 py-3 tabular-nums text-muted-foreground">
                            {r.strictest_rank?.toLocaleString("en-IN")}
                          </td>
                          <td className="text-right px-3 py-3 tabular-nums font-medium text-foreground">
                            {r.typical_rank?.toLocaleString("en-IN")}
                          </td>
                          <td className="text-right px-3 py-3 tabular-nums text-muted-foreground">
                            {r.loosest_rank?.toLocaleString("en-IN")}
                          </td>
                          <td className="text-right px-4 py-3 tabular-nums text-muted-foreground whitespace-nowrap">
                            {r.latest_rank?.toLocaleString("en-IN")}
                            <span className="block text-[11px] opacity-70">
                              {r.latest_year} · {r.years_observed}y
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {g.hidden > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing the {PER_BUCKET} most competitive of {g.total}{" "}
                    {g.label.toLowerCase()} options — the rest are less
                    competitive still. Narrow the institute types or quota to
                    see a shorter list.
                  </p>
                )}
              </section>
            ))}
          </>
        )}

        <FaqSection faqs={faqs} />

        {/* ── Methodology ── */}
        <section className="rounded-2xl border border-border bg-background p-5 text-xs leading-6 text-muted-foreground">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Info size={14} /> How this works
          </h2>
          <p>
            For every institute and branch, we take the closing ranks from the
            last {yearsBack} JoSAA final rounds and compare your rank against
            the <strong className="text-foreground">toughest</strong> (lowest),{" "}
            <strong className="text-foreground">typical</strong> (average) and{" "}
            <strong className="text-foreground">easiest</strong> (highest) of
            those years. Beat the toughest year and it&apos;s{" "}
            <em>Safe</em>; beat the average, <em>Likely</em>; beat only the
            easiest, <em>Reach</em>. Nothing is weighted or smoothed, and the
            numbers behind each verdict are in the table.
          </p>
          <p className="mt-2">
            This is a look at what <em>has</em> happened, not a forecast.
            Cutoffs move every year with paper difficulty, seat matrix and the
            number of applicants, and a branch can shift by thousands of ranks
            in one cycle. Treat a &ldquo;Safe&rdquo; result with a thin margin
            as exactly that — thin. Always confirm against{" "}
            <a
              href="https://josaa.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              JoSAA
            </a>{" "}
            during counselling.
          </p>
          <p className="mt-2">
            Data covers {range.minYear ?? 2016}–{range.maxYear ?? 2024} final
            rounds. Rows showing fewer years than requested are usually new
            branches, or ones JoSAA renamed mid-period.
          </p>
        </section>
      </div>
    </div>
  );
}
