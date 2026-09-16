import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SIMULATORS, getSimulatorBySlug } from "../../_lib/simulators";
import MarkdownRenderer from "../../_components/MarkdownRenderer";
import ProjectileMotionSim from "../../_components/Simulators/ProjectileMotionSim";
import CoulombsLawSim from "../../_components/Simulators/CoulombsLawSim";
import RayOpticsSim from "../../_components/Simulators/RayOpticsSim";
import WedgeSim from "../../_components/Simulators/WedgeSim";
import PulleySim from "../../_components/Simulators/PulleySim";

const BASE_URL = "https://rankgrind.com";

// componentKey → concrete client component. Kept as a lookup so the
// registry data file stays server-safe (no JSX imports there).
const COMPONENTS = {
  projectile: ProjectileMotionSim,
  coulomb: CoulombsLawSim,
  rayoptics: RayOpticsSim,
  wedge: WedgeSim,
  pulley: PulleySim,
};

export function generateStaticParams() {
  return SIMULATORS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sim = getSimulatorBySlug(slug);
  if (!sim) return {};
  return {
    title: sim.metaTitle,
    description: sim.metaDesc,
    keywords: sim.keywords,
    alternates: { canonical: `${BASE_URL}/simulators/${sim.slug}` },
    openGraph: {
      title: sim.title,
      description: sim.metaDesc,
      url: `${BASE_URL}/simulators/${sim.slug}`,
      type: "article",
    },
  };
}

function JsonLd({ sim }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: sim.title,
    description: sim.metaDesc,
    url: `${BASE_URL}/simulators/${sim.slug}`,
    about: sim.chapter,
    keywords: sim.keywords.join(", "),
    author: { "@type": "Organization", name: "RankGrind" },
    publisher: {
      "@type": "Organization",
      name: "RankGrind",
      url: BASE_URL,
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Simulators",
        item: `${BASE_URL}/simulators`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: sim.shortTitle,
        item: `${BASE_URL}/simulators/${sim.slug}`,
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}

export default async function SimulatorDetailPage({ params }) {
  const { slug } = await params;
  const sim = getSimulatorBySlug(slug);
  if (!sim) notFound();

  const SimComponent = COMPONENTS[sim.componentKey];

  return (
    <>
      <JsonLd sim={sim} />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/simulators" className="hover:text-foreground">
            Simulators
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">{sim.shortTitle}</span>
        </nav>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <span>{sim.subject}</span>
            <span>·</span>
            <span>{sim.chapter}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {sim.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {sim.tagline}
          </p>
        </div>

        {/* The sim */}
        <div className="mt-8">
          {SimComponent ? (
            <SimComponent />
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Simulator not yet available.
            </div>
          )}
        </div>

        {/* Intro */}
        <section className="mt-10 prose prose-neutral dark:prose-invert max-w-none">
          <div className="text-[15px] leading-7 text-foreground whitespace-pre-line">
            {sim.intro}
          </div>
        </section>

        {/* Equations */}
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">
            Key equations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sim.equations.map((eq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-muted/25 p-4"
              >
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  {eq.label}
                </div>
                <div className="text-lg">
                  <MarkdownRenderer>{`$$${eq.latex}$$`}</MarkdownRenderer>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key ideas */}
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">
            Key ideas to remember
          </h2>
          <ul className="space-y-3">
            {sim.keyIdeas.map((idea, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border bg-background p-4"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold">
                  {i + 1}
                </span>
                <div className="text-sm text-foreground [&_p]:!my-0">
                  <MarkdownRenderer>{idea}</MarkdownRenderer>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Related topics */}
        {sim.relatedTopics?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-3">
              Related topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {sim.relatedTopics.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted text-foreground border border-border px-3 py-1 text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA / cross-link */}
        <section className="mt-12 rounded-3xl border border-border bg-muted/25 p-6 sm:p-8 text-center">
          <p className="text-sm text-muted-foreground">Ready to test it?</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">
            Solve {sim.chapter.toLowerCase()} problems on RankGrind
          </h3>
          <Link
            href="/problems"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[13px] px-5 py-3"
          >
            Practice problems
          </Link>
        </section>

        {/* Back link */}
        <div className="mt-10">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            All simulators
          </Link>
        </div>
      </main>
    </>
  );
}
