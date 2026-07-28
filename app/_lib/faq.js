/**
 * FAQ generation for AEO (answer engines / featured snippets / "People Also
 * Ask") and GEO (AI answer engines that cite sources).
 *
 * HARD RULE: every answer here is derived from data we actually hold. No
 * invented cutoffs, fees, placement figures, or admission advice. If a fact
 * isn't in the dataset, there is no question about it. Answer engines quote
 * these verbatim and students act on them, so a plausible-sounding
 * fabrication would do real damage.
 *
 * Answers are written to stand alone: an engine lifting one sentence out of
 * context still gets the qualifier ("in 2024", "All India quota", "Open
 * category"), because a bare number is what gets misquoted.
 */

const fmt = (n) => Number(n).toLocaleString("en-IN");

/** Shape: [{ q, a }] */
export function buildCollegeFaqs(college) {
  const { name, type, quota, years, programs } = college;
  if (!programs?.length || !years?.length) return [];

  const latestYear = years.at(-1);
  const firstYear = years[0];
  const quotaLabel =
    quota === "AI" ? "All India" : quota === "OS" ? "Other State" : quota;
  const rankType =
    type === "IIT" ? "JEE Advanced" : "JEE Main";

  const withLatest = programs.filter((p) => p.trend?.[latestYear]?.[1] != null);
  if (!withLatest.length) return [];

  const hardest = withLatest[0]; // already sorted most-competitive-first
  const easiest = withLatest[withLatest.length - 1];

  const faqs = [];

  faqs.push({
    q: `What was the ${hardest.branch} cutoff at ${name} in ${latestYear}?`,
    a: `In ${latestYear}, ${hardest.branch} (${hardest.degree || "B.Tech"}) at ${name} closed at ${rankType} rank ${fmt(
      hardest.trend[latestYear][1],
    )} in the final JoSAA round, for ${quotaLabel} quota, Open category, gender-neutral seats. The opening rank that year was ${fmt(
      hardest.trend[latestYear][0],
    )}.`,
  });

  faqs.push({
    q: `What rank do I need for ${name}?`,
    a: `It depends entirely on the branch. In ${latestYear}, the most competitive branch at ${name} was ${hardest.branch}, closing at ${rankType} rank ${fmt(
      hardest.trend[latestYear][1],
    )}, while ${easiest.branch} closed at ${fmt(
      easiest.trend[latestYear][1],
    )} — so the realistic range across ${withLatest.length} branches was roughly ${fmt(
      hardest.trend[latestYear][1],
    )} to ${fmt(
      easiest.trend[latestYear][1],
    )} (${quotaLabel} quota, Open category, gender-neutral). These are past results, not a guarantee for future years.`,
  });

  faqs.push({
    q: `Which branch at ${name} is hardest to get into?`,
    a: `Based on ${latestYear} JoSAA final-round closing ranks, ${hardest.branch} is the most competitive branch at ${name}, closing at ${rankType} rank ${fmt(
      hardest.trend[latestYear][1],
    )} for Open category, gender-neutral seats under ${quotaLabel} quota.`,
  });

  // Only claim a trend when there are genuinely two comparable endpoints.
  const firstVal = hardest.trend?.[firstYear]?.[1];
  const lastVal = hardest.trend?.[latestYear]?.[1];
  if (firstVal != null && lastVal != null && years.length >= 3) {
    const harder = lastVal < firstVal;
    const pct = Math.abs(Math.round(((lastVal - firstVal) / firstVal) * 100));
    faqs.push({
      q: `Has ${name} ${hardest.branch} become harder to get into?`,
      a: `Comparing JoSAA final-round closing ranks, ${hardest.branch} at ${name} went from rank ${fmt(
        firstVal,
      )} in ${firstYear} to ${fmt(lastVal)} in ${latestYear}. A lower closing rank means tougher competition, so it has become ${
        harder ? `about ${pct}% more competitive` : `about ${pct}% less competitive`
      } over that period, for Open category gender-neutral seats.`,
    });
  }

  const catSource = withLatest.find(
    (p) => Object.keys(p.categories ?? {}).length > 1,
  );
  if (catSource) {
    const c = catSource.categories;
    const parts = ["OPEN", "EWS", "OBC-NCL", "SC", "ST"]
      .filter((k) => c[k]?.[1] != null)
      .map((k) => `${k} ${fmt(c[k][1])}`);
    if (parts.length > 1) {
      faqs.push({
        q: `What is the category-wise cutoff for ${catSource.branch} at ${name}?`,
        a: `For ${catSource.branch} at ${name} in ${latestYear} (${quotaLabel} quota, gender-neutral seats), the JoSAA final-round closing ranks by category were: ${parts.join(
          ", ",
        )}. Note these are not directly comparable: the Open figure is a Common Rank List rank, while EWS, OBC-NCL, SC and ST figures are ranks within each category's own list, so a smaller reserved-category number does not mean that category was harder to get into.`,
      });
    }
  }

  return faqs;
}

export function buildChapterFaqs({ subject, chapter, count, topics, subjectSlug }) {
  const faqs = [
    {
      q: `How many ${chapter} practice questions are available?`,
      a: `RankGrind currently has ${count} free ${chapter} practice question${
        count === 1 ? "" : "s"
      } for JEE ${subject}, each with hints and step-by-step solutions.`,
    },
  ];

  if (topics?.length) {
    faqs.push({
      q: `What topics are covered under ${chapter} for JEE?`,
      a: `The ${chapter} questions on RankGrind cover ${topics.length} topic${
        topics.length === 1 ? "" : "s"
      }: ${topics.join(", ")}.`,
    });
  }

  faqs.push({
    q: `Where can I practise ${chapter} questions for JEE ${subject} free?`,
    a: `You can practise ${chapter} questions free at rankgrind.com/${subjectSlug}/${chapter
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}. Every question includes hints, a worked solution, and instant XP and streak tracking.`,
  });

  return faqs;
}

export function buildExamFaqs({ examLabel, count, subjects = ["Physics", "Chemistry", "Maths"] }) {
  return [
    {
      q: `How many ${examLabel} practice questions does RankGrind have?`,
      a: `RankGrind has ${count} ${examLabel} practice question${
        count === 1 ? "" : "s"
      } across ${subjects.join(", ")}, each with hints and step-by-step solutions, free to practise.`,
    },
    {
      q: `Are these real ${examLabel} questions?`,
      a: `These are ${examLabel}-pattern practice questions tagged to the ${examLabel} syllabus, covering ${subjects.join(
        ", ",
      )}. They are filterable by subject and difficulty.`,
    },
    {
      q: `Is RankGrind free for ${examLabel} preparation?`,
      a: `Yes. ${examLabel} practice questions, hints, solutions, XP and streak tracking are free to use on RankGrind. An account is only needed to save progress across devices.`,
    },
  ];
}

export function buildPredictorFaqs({ minYear, maxYear }) {
  return [
    {
      q: "How does the JEE college predictor work?",
      a: `It compares your rank against official JoSAA final-round closing ranks from the last three years. For each institute and branch it takes the toughest (lowest), typical (average) and easiest (highest) closing rank in that window. If your rank beats the toughest year it is marked Safe, if it beats the average it is Likely, and if it only beats the easiest year it is a Reach. The underlying numbers are shown next to every result.`,
    },
    {
      q: "Which rank should I enter — JEE Main or JEE Advanced?",
      a: "Use your JEE Advanced rank when checking IITs, and your JEE Main rank for NITs, IIITs and GFTIs. They are separate rank lists and are not interchangeable. Enter your category rank, not your percentile.",
    },
    {
      q: "How accurate is a JEE college predictor?",
      a: `This tool reports what actually happened in JoSAA seat allotment between ${minYear} and ${maxYear} — it is historical fact, not a forecast. Real cutoffs move each year with paper difficulty, the seat matrix and applicant numbers, and a branch can shift by thousands of ranks in a single cycle. Treat a "Safe" result with a thin margin as thin, and confirm against JoSAA during counselling.`,
    },
    {
      q: "Is this college predictor free?",
      a: "Yes, it is free and requires no sign-in. It covers every IIT and NIT plus IIITs and GFTIs participating in JoSAA counselling.",
    },
    {
      q: "Why does selecting NITs with All India quota show no results?",
      a: "IITs allot seats purely on an All India basis, while NITs, IIITs and GFTIs split their seats into Home State and Other State quotas. Selecting NITs together with All India quota therefore matches nothing — choose Home State, Other State, or Any quota instead.",
    },
  ];
}

/** FAQPage JSON-LD. Returns null when there is nothing to say. */
export function faqJsonLd(faqs) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
