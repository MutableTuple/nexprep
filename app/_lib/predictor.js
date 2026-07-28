import { supabase } from "./supabase";

export const CATEGORIES = [
  { value: "OPEN", label: "Open / General" },
  { value: "EWS", label: "EWS" },
  { value: "OBC-NCL", label: "OBC-NCL" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "OPEN (PwD)", label: "Open (PwD)" },
  { value: "EWS (PwD)", label: "EWS (PwD)" },
  { value: "OBC-NCL (PwD)", label: "OBC-NCL (PwD)" },
  { value: "SC (PwD)", label: "SC (PwD)" },
  { value: "ST (PwD)", label: "ST (PwD)" },
];

export const GENDERS = [
  { value: "Gender-Neutral", label: "Gender-neutral seats" },
  { value: "Female-only", label: "Female-only (supernumerary)" },
];

// IITs allot purely on All India. NIT/IIIT/GFTI seats split Home State vs
// Other State, so a quota of "AI" returns nothing for them — which is why
// the default here is "any" rather than AI.
export const QUOTAS = [
  { value: "", label: "Any quota" },
  { value: "AI", label: "All India (IITs)" },
  { value: "HS", label: "Home State" },
  { value: "OS", label: "Other State" },
  { value: "GO", label: "Goa" },
  { value: "JK", label: "Jammu & Kashmir" },
  { value: "LA", label: "Ladakh" },
];

export const TYPES = [
  { value: "IIT", label: "IITs" },
  { value: "NIT", label: "NITs" },
  { value: "IIIT", label: "IIITs" },
  { value: "GFTI", label: "GFTIs" },
];

export const CHANCE_META = {
  Safe: {
    label: "Safe",
    blurb: "Your rank cleared the closing rank in every year observed.",
    tone: "text-emerald-700 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  },
  Likely: {
    label: "Likely",
    blurb: "Better than the average closing rank across those years.",
    tone: "text-sky-700 dark:text-sky-400 border-sky-500/40 bg-sky-500/10",
  },
  Reach: {
    label: "Reach",
    blurb: "Only cleared it in the most lenient year — treat as a stretch.",
    tone: "text-amber-700 dark:text-amber-400 border-amber-500/40 bg-amber-500/10",
  },
};

export const CHANCE_ORDER = ["Safe", "Likely", "Reach"];

/**
 * Calls the predict_colleges RPC (see supabase/josaa_cutoffs.sql).
 * All bucketing happens in SQL so the numbers shown are the same ones the
 * classification was derived from.
 */
export async function predictColleges({
  rank,
  category = "OPEN",
  gender = "Gender-Neutral",
  quota = null,
  types = null,
  yearsBack = 3,
  // Results come back ordered Safe -> Likely -> Reach, so a tight limit gets
  // entirely consumed by Safe rows and silently drops the Likely/Reach ones,
  // which are the results a student actually has to make a decision about.
  // Fetch wide here; the page caps how many of each bucket it renders.
  limit = 2000,
}) {
  const { data, error } = await supabase.rpc("predict_colleges", {
    p_rank: rank,
    p_category: category,
    p_gender: gender,
    p_quota: quota || null,
    p_types: types && types.length ? types : null,
    p_years_back: yearsBack,
    p_include_unlikely: false,
    p_limit: limit,
  });
  if (error) throw error;
  return data ?? [];
}

export async function getDataYearRange() {
  const { data, error } = await supabase.rpc("josaa_filter_options");
  if (error) throw error;
  return { minYear: data?.min_year ?? null, maxYear: data?.max_year ?? null };
}
