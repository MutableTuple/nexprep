import { faqJsonLd } from "@/app/_lib/faq";

/**
 * Renders FAQs as visible text plus FAQPage JSON-LD.
 *
 * Deliberately uses plain <h3>/<p> rather than <details>, because content
 * hidden behind a collapsed accordion is weaker for featured snippets and
 * some answer engines skip it entirely. The schema and the visible copy must
 * also match exactly — Google treats mismatched FAQ markup as spam.
 */
export default function FaqSection({ faqs, heading = "Frequently asked questions" }) {
  if (!faqs?.length) return null;
  const ld = faqJsonLd(faqs);

  return (
    <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      <dl className="mt-4 flex flex-col gap-5">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <dt className="text-sm font-semibold text-foreground">{q}</dt>
            <dd className="text-sm text-muted-foreground mt-1.5 leading-6">
              {a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
