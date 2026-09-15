import Link from "next/link";
import { SIMULATORS } from "../_lib/simulators";
import { ArrowRight, Sparkles } from "lucide-react";

const BASE_URL = "https://rankgrind.com";

export const metadata = {
  title:
    "Physics Simulators — Interactive Visualizations for JEE & NEET | RankGrind",
  description:
    "Free, interactive physics simulators built for JEE and NEET aspirants. Projectile motion, Coulomb's law, ray optics — visualize the equations, not just read them.",
  alternates: { canonical: `${BASE_URL}/simulators` },
  keywords: [
    "physics simulators",
    "interactive physics",
    "JEE physics simulator",
    "NEET physics simulator",
    "projectile motion simulator",
    "coulomb's law simulator",
    "ray optics simulator",
    "physics visualizations",
  ],
  openGraph: {
    title: "Physics Simulators — RankGrind",
    description:
      "Free, interactive physics simulators for JEE and NEET. Visualize the equations you're solving.",
    url: `${BASE_URL}/simulators`,
    type: "website",
  },
};

// JSON-LD ItemList so search engines see this as a curated collection.
function ItemListJsonLd() {
  const items = SIMULATORS.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${BASE_URL}/simulators/${s.slug}`,
    name: s.title,
  }));
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Physics Simulators",
    numberOfItems: items.length,
    itemListElement: items,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function SimulatorsIndexPage() {
  return (
    <>
      <ItemListJsonLd />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles size={12} className="text-orange-500" />
            Interactive
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Physics Simulators
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Formulas are easier to remember when you've watched them move.
            Every simulator on this page is free, works on your phone, and
            comes with the underlying equations spelled out.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIMULATORS.map((sim) => (
            <Link
              key={sim.slug}
              href={`/simulators/${sim.slug}`}
              className="group rounded-3xl border border-border bg-background p-6 transition-all hover:shadow-lg hover:border-orange-500/50"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                <span>{sim.subject}</span>
                <span>·</span>
                <span>{sim.chapter}</span>
              </div>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground group-hover:text-orange-600 transition-colors">
                {sim.shortTitle}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {sim.tagline}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                Open simulator
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* More coming */}
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-muted/25 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            More simulators coming soon — SHM, wave interference, Bohr's atom,
            LC circuits, and more.
          </p>
        </div>
      </main>
    </>
  );
}
