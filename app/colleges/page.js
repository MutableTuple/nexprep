import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { COLLEGES } from "@/app/_data/colleges";
import {
  getAllCutoffColleges,
  getLatestYear,
  TYPE_LABEL,
} from "@/app/_lib/cutoffs";

const TYPE_ORDER = ["IIT", "NIT", "IIIT", "GFTI"];
const TYPE_HEADING = {
  IIT: "Indian Institutes of Technology (IITs)",
  NIT: "National Institutes of Technology (NITs)",
  IIIT: "Indian Institutes of Information Technology (IIITs)",
  GFTI: "Government-Funded Technical Institutes (GFTIs)",
};

const cutoffColleges = getAllCutoffColleges();
const latestYear = getLatestYear();

const TITLE = `Engineering Colleges in India — JoSAA Cutoffs for ${cutoffColleges.length} Institutes`;
const DESCRIPTION = `JoSAA opening and closing ranks for ${cutoffColleges.length} engineering institutes — every IIT and NIT, plus IIITs and GFTIs. Branch-wise closing rank trends through ${latestYear}.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/colleges" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/colleges" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function topBranchSummary(college) {
  const top = college.programs[0];
  if (!top) return null;
  const rank = top.trend[String(latestYear)]?.[1];
  if (rank == null) return null;
  return `${top.branch} · ${rank.toLocaleString("en-IN")}`;
}

export default function CollegesPage() {
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    heading: TYPE_HEADING[type] ?? TYPE_LABEL[type] ?? type,
    items: cutoffColleges.filter((c) => c.type === type),
  })).filter((g) => g.items.length > 0);

  const privates = COLLEGES.filter((c) => c.type === "PRIVATE");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: TITLE,
    description: DESCRIPTION,
    numberOfItems: cutoffColleges.length,
    itemListElement: cutoffColleges.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `https://rankgrind.com/colleges/${c.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-12 sm:py-16 flex flex-col gap-10">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Engineering Colleges in India
          </h1>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Branch-wise JoSAA opening and closing ranks for{" "}
            {cutoffColleges.length} institutes — every IIT and NIT, plus IIITs
            and GFTIs. Each page shows how closing ranks moved year by year
            through {latestYear}.
          </p>
          <p className="text-xs text-muted-foreground mt-4 rounded-xl border border-border bg-background p-3 leading-6">
            Ranks come from official JoSAA final-round seat allotment data.
            They are historical results, not predictions — always verify on{" "}
            <a
              href="https://josaa.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              JoSAA
            </a>{" "}
            or CSAB before making an admission decision.
          </p>
        </header>

        {grouped.map(({ type, heading, items }) => (
          <section key={type}>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {heading}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              {items.length} institutes · most competitive branch in{" "}
              {latestYear}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((c) => {
                const summary = topBranchSummary(c);
                return (
                  <Link
                    key={c.slug}
                    href={`/colleges/${c.slug}`}
                    className="group rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-foreground/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {c.name}
                      </p>
                      <ChevronRight
                        size={14}
                        className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {summary ?? `${c.programs.length} branches`}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {privates.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Other Notable Engineering Institutes
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              These admit through their own entrance tests rather than JoSAA,
              so JoSAA rank data does not apply to them.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {privates.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-border bg-background px-4 py-3"
                >
                  <p className="text-sm font-medium text-foreground">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.city}, {c.state}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
