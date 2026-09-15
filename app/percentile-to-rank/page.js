import Link from "next/link";
import { ChevronRight, Home, ArrowRightLeft, GraduationCap } from "lucide-react";
import {
  estimateRankFromPercentile,
  estimatePercentileFromRank,
  getPercentileRankYears,
} from "@/app/_lib/percentile-rank";
import { buildPercentileFaqs } from "@/app/_lib/faq";
import FaqSection from "@/app/_components/FaqSection";

const TITLE = "JEE Main Percentile to Rank Calculator";
const DESCRIPTION =
  "Estimate your JEE Main CRL rank from your percentile, or your percentile from your rank — using NTA's official year-wise candidate totals, not guessed marks tables.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "JEE Main percentile to rank",
    "JEE Main rank to percentile",
    "JEE Main marks vs percentile",
    "JEE Main percentile calculator",
    "JEE Main rank estimator",
  ],
  alternates: { canonical: "/percentile-to-rank" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/percentile-to-rank" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const fmt = (n) => Number(n).toLocaleString("en-IN");

const inputCls =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground";

function Field({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const years = getPercentileRankYears();
  const defaultYear = years[0];

  const mode = sp?.mode === "rank" ? "rank" : "percentile";
  const year = parseInt(sp?.year ?? String(defaultYear), 10) || defaultYear;

  const percentileRaw = sp?.percentile ?? "";
  const rankRaw = sp?.rank ?? "";

  let result = null;
  let error = null;
  // Whichever direction the calculation ran, this is the CRL rank the
  // College Predictor upsell below hands off — either the one just
  // estimated, or the one the student typed in themselves.
  let resultRank = null;

  if (mode === "percentile" && percentileRaw !== "") {
    const p = parseFloat(percentileRaw);
    if (!Number.isFinite(p) || p < 0 || p > 100) {
      error = "Enter a percentile between 0 and 100.";
    } else {
      result = estimateRankFromPercentile({ percentile: p, year });
      resultRank = result?.rank ?? null;
    }
  } else if (mode === "rank" && rankRaw !== "") {
    const r = parseInt(rankRaw, 10);
    if (!Number.isFinite(r) || r < 1) {
      error = "Enter a rank of 1 or higher.";
    } else {
      result = estimatePercentileFromRank({ rank: r, year });
      resultRank = r;
    }
  }

  const faqs = buildPercentileFaqs({ years });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JEE Main Percentile to Rank Calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    url: "https://rankgrind.com/percentile-to-rank",
    description: DESCRIPTION,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-foreground">
            <Home size={14} />
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">Percentile to Rank</span>
        </nav>

        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            JEE Main Percentile ↔ Rank Calculator
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
            Convert between your JEE Main percentile and an estimated CRL
            rank, using NTA&apos;s official year-wise total of unique
            candidates who appeared. This is an estimate of position, not
            your official rank — see the FAQ below for why they can differ.
          </p>
        </header>

        <form
          method="GET"
          className="rounded-2xl border border-border bg-background p-5 flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Direction">
              <select name="mode" defaultValue={mode} className={inputCls}>
                <option value="percentile">Percentile → Rank</option>
                <option value="rank">Rank → Percentile</option>
              </select>
            </Field>

            {mode === "percentile" ? (
              <Field label="Your percentile" hint="e.g. 98.765432">
                <input
                  type="number"
                  name="percentile"
                  min="0"
                  max="100"
                  step="0.0000001"
                  required
                  defaultValue={percentileRaw}
                  placeholder="e.g. 98.5"
                  className={inputCls}
                />
              </Field>
            ) : (
              <Field label="Your CRL rank" hint="e.g. 25000">
                <input
                  type="number"
                  name="rank"
                  min="1"
                  required
                  defaultValue={rankRaw}
                  placeholder="e.g. 25000"
                  className={inputCls}
                />
              </Field>
            )}

            <Field label="Year">
              <select name="year" defaultValue={String(year)} className={inputCls}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div>
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-foreground text-background text-sm font-semibold inline-flex items-center gap-2"
            >
              <ArrowRightLeft size={15} />
              Estimate
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {result && !error && (
          <div className="rounded-2xl border border-border bg-background p-6 flex flex-col gap-2">
            {mode === "percentile" ? (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Estimated CRL rank in {year}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ~{fmt(result.rank)}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Estimated percentile in {year}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ~{result.percentile.toFixed(4)}
                </p>
              </>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Based on {fmt(result.total)} unique candidates who appeared
              across JEE Main {year}&apos;s sessions. An estimate — see the
              FAQ for why this can differ from your official rank.
            </p>
          </div>
        )}

        {resultRank && !error && (
          <Link
            // This rank is a JEE Main rank, and IITs only ever admit on JEE
            // Advanced rank — a different list entirely. Pre-filtering to
            // NIT/IIIT/GFTI here stops the predictor from showing IIT rows
            // that this rank has no real bearing on.
            href={`/college-predictor?rank=${resultRank}&type=NIT&type=IIIT&type=GFTI`}
            className="group rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 flex items-center justify-between gap-4 transition-colors hover:border-amber-400/70 hover:bg-amber-400/15"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-400 p-2.5 shrink-0">
                <GraduationCap size={18} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  See which colleges you can get at rank ~{fmt(resultRank)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Opens the College Predictor for NITs, IIITs and GFTIs with
                  this rank filled in — Open category by default, change it
                  there. IITs use a separate JEE Advanced rank.
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-amber-500 shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}

        <div className="rounded-2xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground leading-relaxed">
          This tool does not estimate marks. NTA has never published the raw
          score distribution behind a percentile, so any &quot;marks vs
          percentile&quot; figure you see elsewhere is a third-party guess —
          we only convert between percentile and rank, both of which follow
          from candidate totals NTA actually discloses.
        </div>

        <FaqSection faqs={faqs} />
      </div>
    </div>
  );
}
