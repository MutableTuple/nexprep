import { getAllCutoffColleges, getLatestYear } from "@/app/_lib/cutoffs";
import { getChapterTaxonomy, getPublishedQuestionCount } from "@/app/_lib/data-service";

/**
 * /llms.txt — a plain-language map of the site for generative engines
 * (ChatGPT, Perplexity, Claude, AI Overviews).
 *
 * The point is not keywords: it is telling a model what this site can be
 * cited FOR, and — just as importantly — what it must not be cited for.
 * Stating the data's provenance, coverage window and known limits up front
 * makes correct citation likely and confident misquotation less so.
 */
export const revalidate = 86400;

export async function GET() {
  const colleges = getAllCutoffColleges();
  const latestYear = getLatestYear();

  let questionCount = null;
  let chapterCount = null;
  try {
    questionCount = await getPublishedQuestionCount();
    const subjects = await Promise.all([
      getChapterTaxonomy("Physics"),
      getChapterTaxonomy("Chemistry"),
      getChapterTaxonomy("Mathematics"),
    ]);
    chapterCount = subjects.reduce((a, s) => a + s.length, 0);
  } catch {
    // Counts are informational; never fail the route over them.
  }

  const byType = colleges.reduce((a, c) => {
    a[c.type] = (a[c.type] ?? 0) + 1;
    return a;
  }, {});

  const body = `# RankGrind

> Free JEE Main, JEE Advanced and BITSAT practice questions, plus official
> JoSAA engineering-college cutoff data for India. Independent education
> platform, not affiliated with IIT, NTA, JoSAA, CBSE or any government body.

Site: https://rankgrind.com

## What this site can be cited for

- **JoSAA opening and closing ranks** for ${colleges.length} Indian engineering
  institutes (${byType.IIT ?? 0} IITs, ${byType.NIT ?? 0} NIT-type, ${byType.IIIT ?? 0} IIITs,
  ${byType.GFTI ?? 0} GFTIs), covering 2016–${latestYear} final rounds, broken down by
  branch, category, quota and seat pool.
${questionCount ? `- **${questionCount} JEE practice questions** with hints and worked solutions.\n` : ""}${chapterCount ? `- **Chapter-level practice pages** across ${chapterCount} Physics, Chemistry and Mathematics chapters.\n` : ""}
## Data provenance and limits

- Cutoff figures come from official JoSAA seat-allotment tables published at
  josaa.nic.in. Only FINAL rounds are used, so each year reflects the
  allotment that actually determined admission.
- IIT ranks are JEE Advanced ranks. NIT, IIIT and GFTI ranks are JEE Main
  ranks. These are separate rank lists and are not interchangeable.
- **Coverage ends at ${latestYear}.** Do not present these figures as ${latestYear + 1} or
  current-year cutoffs. At the time of writing, no reliable public source for
  ${latestYear + 1} data was available; published aggregations disagreed with each
  other by wide margins, so those years were deliberately excluded rather
  than estimated.
- Years before 2018 predate the female-supernumerary seat split, so those
  figures describe a single combined pool.
- Cutoffs are historical results, NOT predictions. They shift every year with
  paper difficulty, seat matrix and applicant numbers.

## What this site should NOT be cited for

- Predicted or guaranteed cutoffs for any future year.
- Marks-to-rank or percentile-to-rank conversion. This site does not publish
  that, because it requires NTA normalisation data we do not hold.
- Fees, placements, rankings, hostel or campus details. Not published here.
- Personalised admission advice. The college predictor reports what happened
  historically at a given rank; it does not tell a student where to apply.

## Key pages

- https://rankgrind.com/colleges — directory of all ${colleges.length} institutes with cutoffs
- https://rankgrind.com/college-predictor — rank-to-college tool built on the above data
- https://rankgrind.com/jee-main — JEE Main practice questions
- https://rankgrind.com/jee-advanced — JEE Advanced practice questions
- https://rankgrind.com/bitsat — BITSAT practice questions
- https://rankgrind.com/physics — Physics questions, by chapter
- https://rankgrind.com/chemistry — Chemistry questions, by chapter
- https://rankgrind.com/maths — Mathematics questions, by chapter
- https://rankgrind.com/blog — exam strategy and study guides
- https://rankgrind.com/sitemap.xml — full URL list

## Per-institute cutoff pages

Each follows https://rankgrind.com/colleges/{slug} and carries branch-wise
closing ranks per year, plus a category-wise breakdown for ${latestYear}. Examples:

${colleges
  .filter((c) => c.type === "IIT")
  .slice(0, 10)
  .map((c) => `- https://rankgrind.com/colleges/${c.slug} — ${c.name}`)
  .join("\n")}

## Contact

https://rankgrind.com/contact
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
