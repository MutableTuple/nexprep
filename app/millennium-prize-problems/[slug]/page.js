import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock,
  Users,
  Trophy,
} from "lucide-react";
import {
  MILLENNIUM_PROBLEMS,
  getMillenniumProblemBySlug,
} from "@/app/_lib/millennium-problems";
import MillenniumDiagram from "@/app/_components/MillenniumDiagrams";
import MarkdownRenderer from "@/app/_components/MarkdownRenderer";

// SSG all seven paths.
export async function generateStaticParams() {
  return MILLENNIUM_PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getMillenniumProblemBySlug(slug);
  if (!p) return { title: "Not found" };

  const canonical = `/millennium-prize-problems/${p.slug}`;
  const title = `${p.title} — Millennium Prize Problem Explained | RankGrind`;
  return {
    title,
    description: p.metaDesc,
    keywords: p.keywords.split(", "),
    alternates: { canonical },
    openGraph: {
      title,
      description: p.metaDesc,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.metaDesc,
    },
  };
}

// JSON-LD Article + BreadcrumbList so Google can render rich results.
function buildJsonLd(p) {
  const site = "https://rankgrind.com";
  const url = `${site}/millennium-prize-problems/${p.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.title,
      description: p.metaDesc,
      keywords: p.keywords,
      mainEntityOfPage: url,
      author: {
        "@type": "Organization",
        name: "RankGrind",
        url: site,
      },
      publisher: {
        "@type": "Organization",
        name: "RankGrind",
        url: site,
      },
      about: {
        "@type": "Thing",
        name: p.title,
      },
      isPartOf: {
        "@type": "CollectionPage",
        name: "The 7 Millennium Prize Problems",
        url: `${site}/millennium-prize-problems`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "RankGrind",
          item: site,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Millennium Prize Problems",
          item: `${site}/millennium-prize-problems`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: p.shortTitle,
          item: url,
        },
      ],
    },
  ];
}

export default async function MillenniumProblemPage({ params }) {
  const { slug } = await params;
  const p = getMillenniumProblemBySlug(slug);
  if (!p) notFound();

  // Prev / next for in-place browsing
  const idx = MILLENNIUM_PROBLEMS.findIndex((x) => x.slug === p.slug);
  const prev =
    idx > 0 ? MILLENNIUM_PROBLEMS[idx - 1] : null;
  const next =
    idx < MILLENNIUM_PROBLEMS.length - 1
      ? MILLENNIUM_PROBLEMS[idx + 1]
      : null;

  return (
    <div className="min-h-screen bg-muted/30">
      {buildJsonLd(p).map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <article className="mx-auto max-w-3xl px-4 sm:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-muted-foreground mb-6"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/millennium-prize-problems"
            className="hover:text-foreground"
          >
            Millennium Prize Problems
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{p.shortTitle}</span>
        </nav>

        {/* Header */}
        <header>
          <div className="flex items-center gap-2 mb-4">
            {p.status === "solved" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest">
                <CheckCircle2 size={12} />
                Solved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Open
              </span>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {p.field}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            {p.title}
          </h1>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <MetaCard
              icon={<Trophy size={14} />}
              label="Prize"
              value={p.prize}
            />
            <MetaCard
              icon={<Clock size={14} />}
              label="Posed"
              value={String(p.posedYear)}
            />
            <MetaCard
              icon={<Users size={14} />}
              label="By"
              value={p.posedBy}
            />
            <MetaCard
              icon={
                p.status === "solved" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-orange-500 inline-block" />
                )
              }
              label="Status"
              value={p.status === "solved" ? p.solvedBy : "Open"}
            />
          </div>
        </header>

        {/* TL;DR */}
        <section className="mt-10 rounded-3xl border border-border bg-background p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-3">
            TL;DR
          </p>
          <div className="text-base sm:text-[17px] leading-relaxed text-foreground prose-p:!my-3 first:prose-p:!mt-0 last:prose-p:!mb-0">
            <MarkdownRenderer>{p.tldr}</MarkdownRenderer>
          </div>
        </section>

        {/* Diagram */}
        <section className="mt-10 rounded-3xl border border-border bg-background p-6 sm:p-8">
          <MillenniumDiagram id={p.diagram} />
        </section>

        {/* Formal statement */}
        <Section title="Formal statement" accent>
          <MarkdownRenderer>{p.statement}</MarkdownRenderer>
        </Section>

        {/* Why it matters */}
        <Section title="Why it matters">
          <MarkdownRenderer>{p.whyItMatters}</MarkdownRenderer>
        </Section>

        {/* History */}
        <Section title="History">
          <MarkdownRenderer>{p.history}</MarkdownRenderer>
        </Section>

        {/* Progress */}
        <Section title="Current status of research">
          <MarkdownRenderer>{p.progress}</MarkdownRenderer>
        </Section>

        {/* Attempts */}
        <Section title="Notable attempts">
          <MarkdownRenderer>{p.attempts}</MarkdownRenderer>
        </Section>

        {/* What follows */}
        <Section title="What a resolution would mean">
          <MarkdownRenderer>{p.whatWouldFollow}</MarkdownRenderer>
        </Section>

        {/* Prev / next */}
        <nav className="mt-14 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/millennium-prize-problems/${prev.slug}`}
              className="group rounded-2xl border border-border bg-background p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                <ArrowLeft size={11} />
                Previous
              </div>
              <p className="font-semibold text-foreground group-hover:text-primary">
                {prev.shortTitle}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/millennium-prize-problems/${next.slug}`}
              className="group rounded-2xl border border-border bg-background p-4 text-right hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-end gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Next
                <ArrowRight size={11} />
              </div>
              <p className="font-semibold text-foreground group-hover:text-primary">
                {next.shortTitle}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Back to index */}
        <div className="mt-6 text-center">
          <Link
            href="/millennium-prize-problems"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            All 7 Millennium Prize Problems
          </Link>
        </div>
      </article>
    </div>
  );
}

function MetaCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-xs font-medium text-foreground leading-tight">
        {value}
      </p>
    </div>
  );
}

function Section({ title, children, accent = false }) {
  return (
    <section className="mt-10">
      <h2
        className={
          accent
            ? "text-lg font-bold text-orange-600 dark:text-orange-400 mb-3"
            : "text-lg font-bold text-foreground mb-3"
        }
      >
        {title}
      </h2>
      <div className="text-[15px] leading-relaxed text-foreground prose-p:!my-3 first:prose-p:!mt-0 last:prose-p:!mb-0">
        {children}
      </div>
    </section>
  );
}
