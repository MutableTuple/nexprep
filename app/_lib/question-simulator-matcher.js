// Given a question row, decides which interactive simulator (if any) can
// visualize it. Purely rule-based — no LLM, no network — so it runs
// on every card render for free.
//
// The matcher inspects three fields in priority order:
//   1. topic / chapter / subject (structured metadata)
//   2. tags (author-supplied)
//   3. question_text (fallback keyword scan)
//
// Returns `{ kind, params }` or null. `params` is a shallow object of
// initial values the target simulator understands.

const norm = (s) => (s ?? "").toString().toLowerCase();

// Pull the first "= <num>" or "<num> unit" out of the question text.
// Cheap heuristic — good enough to seed defaults; the user can slide
// them anyway.
function firstNumber(text, patterns) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const n = parseFloat(m[1]);
      if (!Number.isNaN(n)) return n;
    }
  }
  return null;
}

function extractLCRParams(text) {
  const R = firstNumber(text, [
    /r\s*=\s*(-?\d+(?:\.\d+)?)/i,
    /(-?\d+(?:\.\d+)?)\s*Ω/i,
    /(-?\d+(?:\.\d+)?)\s*ohm/i,
  ]);
  const XL = firstNumber(text, [
    /x[_\s]*l\s*=\s*(-?\d+(?:\.\d+)?)/i,
    /(-?\d+(?:\.\d+)?)\s*Ω\s*\(?\s*X[_\s]*L/i,
  ]);
  const XC = firstNumber(text, [
    /x[_\s]*c\s*=\s*(-?\d+(?:\.\d+)?)/i,
  ]);
  // The X_L = R = X_C phrasing (from the sample question) — all three equal
  const allEqual = /x[_\s]*l\s*=\s*r\s*=\s*x[_\s]*c/i.test(text);
  if (allEqual) {
    const v = R ?? XL ?? XC ?? 100;
    return { R: v, XL: v, XC: v };
  }
  return {
    R: R ?? 100,
    XL: XL ?? 100,
    XC: XC ?? 50,
  };
}

function extractProjectileParams(text) {
  const v = firstNumber(text, [
    /(?:speed|velocity|u|v_0|v0)\s*=\s*(-?\d+(?:\.\d+)?)/i,
    /(-?\d+(?:\.\d+)?)\s*m\/s/i,
  ]);
  const angle = firstNumber(text, [
    /angle\s*(?:of)?\s*(?:projection)?\s*=?\s*(-?\d+(?:\.\d+)?)\s*°/i,
    /(-?\d+(?:\.\d+)?)\s*°/i,
  ]);
  return { velocity: v ?? 30, angleDeg: angle ?? 45 };
}

function extractInclineParams(text) {
  const angle = firstNumber(text, [
    /(?:angle|incline|θ)\s*=?\s*(-?\d+(?:\.\d+)?)\s*°?/i,
    /(-?\d+(?:\.\d+)?)\s*°/i,
  ]);
  const mu = firstNumber(text, [
    /μ\s*=?\s*(-?\d+(?:\.\d+)?)/i,
    /coefficient[^=]*=?\s*(-?\d+(?:\.\d+)?)/i,
  ]);
  return {
    angleDeg: angle ?? 30,
    muS: mu ?? 0.3,
    muK: mu ? Math.max(0, mu - 0.05) : 0.25,
  };
}

function extractPulleyParams(text) {
  const nums = [...text.matchAll(/(-?\d+(?:\.\d+)?)\s*kg/gi)]
    .map((m) => parseFloat(m[1]))
    .filter((n) => !Number.isNaN(n));
  return {
    m1: nums[0] ?? 2,
    m2: nums[1] ?? 3,
  };
}

// Matcher table — first rule that matches wins. Keep rules loose enough
// to catch variant phrasings; use topic/chapter over question_text when
// possible so we don't misfire on incidental mentions.
const RULES = [
  {
    kind: "lcr-phasor",
    test: (h) =>
      /lcr|rlc/.test(h.hay) ||
      (/alternating current|a\.?c\.? circuit/.test(h.hay) &&
        /inductor|capacitor|reactance|impedance|power factor/.test(h.hay)),
    extract: (q) => extractLCRParams(q.text),
  },
  {
    kind: "projectile",
    test: (h) => /projectile|range|max(?:imum)? height/.test(h.hay),
    extract: (q) => extractProjectileParams(q.text),
  },
  {
    kind: "wedge",
    test: (h) => /inclined plane|wedge|friction on incline|slope of \d+°/.test(h.hay),
    extract: (q) => extractInclineParams(q.text),
  },
  {
    kind: "pulley",
    test: (h) => /pulley|atwood/.test(h.hay),
    extract: (q) => extractPulleyParams(q.text),
  },
  {
    kind: "rayoptics",
    test: (h) =>
      /thin lens|convex lens|concave lens|image formation|focal length/.test(
        h.hay,
      ),
    extract: () => ({}),
  },
  {
    kind: "coulomb",
    test: (h) =>
      /coulomb'?s? law|point charges?|electric field.*charge/.test(h.hay),
    extract: () => ({}),
  },
];

export function matchSimulator(q) {
  if (!q) return null;
  const topic = norm(q.topic ?? q.title);
  const chapter = norm(q.chapter);
  const subject = norm(q.subject);
  const tags = (q.tags ?? []).map(norm).join(" ");
  const text = norm(q.question_text ?? q.question);
  const hay = [topic, chapter, subject, tags, text].join(" ");
  const bundle = { hay, topic, chapter, subject, tags, text };

  for (const rule of RULES) {
    if (rule.test(bundle)) {
      return { kind: rule.kind, params: rule.extract({ text }) };
    }
  }
  return null;
}
