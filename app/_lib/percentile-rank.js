/**
 * Percentile <-> CRL rank estimation for JEE Main.
 *
 * HARD RULE (same as faq.js): only real, sourced numbers live here. No
 * invented percentile-to-marks tables — NTA has never published the raw
 * score distribution behind a percentile, so any "marks vs percentile"
 * figure floating around the web is itself a third-party guess. What NTA
 * *does* publish, every cycle, is the total number of unique candidates who
 * appeared across sessions — that number is real, cited below, and is
 * enough to turn a percentile into an approximate CRL rank.
 *
 * Source for CANDIDATE_COUNTS: NTA's own result-day press figures, as
 * reported by wire/education press (PTI via Careers360, Vedantu, Testbook)
 * at the time of each year's result declaration. These are the "unique
 * candidates who appeared in at least one session" totals, which is the
 * pool the final (best-of-both-sessions) percentile is drawn from.
 */
export const CANDIDATE_COUNTS = {
  2023: 1113325,
  2024: 1415110,
  2025: 1475103,
};

export function getPercentileRankYears() {
  return Object.keys(CANDIDATE_COUNTS)
    .map(Number)
    .sort((a, b) => b - a);
}

/**
 * NTA defines percentile as the share of candidates in the pool who scored
 * at or below you, to 7 decimal places. Inverting that against the total
 * pool size gives an estimate of your position in the Common Rank List —
 * not the official rank itself, since real ties, withdrawals and the exact
 * merge-of-two-sessions method aren't public. Treat this as "roughly here",
 * not "exactly here".
 */
export function estimateRankFromPercentile({ percentile, year }) {
  const total = CANDIDATE_COUNTS[year];
  if (!total) return null;
  const p = Number(percentile);
  if (!Number.isFinite(p) || p < 0 || p > 100) return null;

  const rank = Math.round((total * (100 - p)) / 100) + 1;
  return { rank: Math.min(rank, total), total };
}

/** Inverse of the above: roughly what percentile a given CRL rank implies. */
export function estimatePercentileFromRank({ rank, year }) {
  const total = CANDIDATE_COUNTS[year];
  if (!total) return null;
  const r = Number(rank);
  if (!Number.isFinite(r) || r < 1) return null;

  const percentile = ((total - r + 1) / total) * 100;
  return { percentile: Math.max(0, Math.min(100, percentile)), total };
}
