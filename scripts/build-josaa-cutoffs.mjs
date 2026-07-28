/**
 * Regenerates app/_data/josaa-cutoffs.json from official JoSAA opening/closing
 * rank data.
 *
 *   node scripts/build-josaa-cutoffs.mjs
 *
 * Source: github.com/PardhavMaradani/josaa-sql-interface — CSV exports of the
 * official JoSAA OR-CR tables (josaa.nic.in), which are only published behind
 * a form-based query tool with no bulk download.
 *
 * Verified before adoption: 2024 final-round CSE closing ranks from this
 * dataset (Bombay 68, Delhi 116, Madras 159, Kanpur 252, Kharagpur 415)
 * match independently published figures exactly.
 *
 * Only FINAL rounds are used, so each year reflects the last allotment —
 * the number that actually determined admission that year.
 *
 * NOTE: the dataset ends at 2024. Do not hand-add later years here; rerun
 * this script once upstream publishes them, so every number stays traceable
 * to the official tables.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "app", "_data", "josaa-cutoffs.json");
const BASE =
  "https://raw.githubusercontent.com/PardhavMaradani/josaa-sql-interface/main/csv";

// year -> final-round file (round count varies by year)
const FILES = [
  ["2016", "josaa-2016-r6-all.csv"],
  ["2017", "josaa-2017-r7-all.csv"],
  ["2018", "josaa-2018-r7-all.csv"],
  ["2019", "josaa-2019-r7-all.csv"],
  ["2020", "josaa-2020-r6-all.csv"],
  ["2021", "josaa-2021-r6-all.csv"],
  ["2022", "josaa-2022-r6-all.csv"],
  ["2023", "josaa-2023-r6-all.csv"],
  ["2024", "josaa-2024-r5-all.csv"],
];

// A page is only worth publishing if it carries a real trend and a real
// spread of branches. Below this, JoSAA's own naming drift (renames, source
// typos like "Andra Pradesh") leaves single-year fragments that would render
// as near-empty pages.
const MIN_YEARS = 4;
const MIN_PROGRAMS = 3;

function parseLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (c === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

// JoSAA prints long formal names, and the source has real typos and
// formatting quirks ("Technology(IIIT)" with no space, a redundant "(IIIT)"
// after "IIIT", embedded PIN codes). These strings become the slug, <h1> and
// <title> of ~100 pages, so normalise them to what students actually search
// ("IIIT Nagpur"), not the raw registry string ("IIIT (IIIT) Nagpur").
function shortName(full) {
  let n = full.trim();

  // Repair source formatting before any matching.
  n = n
    .replace(/Technology\(/gi, "Technology (") // missing space
    .replace(/[-–]\s*\d{6}\b/g, "") // PIN codes
    .replace(/\s+/g, " ")
    .trim();

  const rules = [
    [
      /^(?:Pt\.?\s*Dwarka Prasad Mishra\s*)?Indian Institute of Information Technology,?\s*(?:\(IIIT\))?,?\s*Design\s*(?:and|&)\s*Manufactur(?:ing|e),?\s*/i,
      "IIITDM ",
    ],
    [/^IIIT\s*Design\s*(?:and|&)\s*Manufacturing,?\s*/i, "IIITDM "],
    [
      /^Atal Bihari Vajpayee Indian Institute of Information Technology\s*(?:and|&)\s*Management,?\s*/i,
      "ABV-IIITM ",
    ],
    [
      /^International Institute of Information Technology,?\s*/i,
      "IIIT ",
    ],
    [/^Indian Institute of Technology\s+/i, "IIT "],
    [/^National Institute of Technology,?\s+/i, "NIT "],
    [
      /^Indian Institute of Information Technology\s*(?:\(IIIT\))?,?\s*/i,
      "IIIT ",
    ],
    [/^IIIT\s*\(IIIT\),?\s*/i, "IIIT "],
    [/^Indian Institute of Engineering Science and Technology,?\s*/i, "IIEST "],
    [/^Motilal Nehru National Institute of Technology\s*/i, "MNNIT "],
    [/^Malaviya National Institute of Technology\s*/i, "MNIT "],
    [/^Maulana Azad National Institute of Technology\s*/i, "MANIT "],
    [/^Visvesvaraya National Institute of Technology,?\s*/i, "VNIT "],
    [/^Sardar Vallabhbhai National Institute of Technology,?\s*/i, "SVNIT "],
  ];
  for (const [re, rep] of rules) {
    if (re.test(n)) {
      n = n.replace(re, rep);
      break;
    }
  }

  // Drop a trailing state qualifier when the city already precedes it
  // ("IIIT Raichur, Karnataka" -> "IIIT Raichur"). Kept where the state IS
  // the identifier ("NIT Andhra Pradesh").
  const STATES =
    "Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Jammu (?:and|&) Kashmir|Delhi";
  n = n.replace(new RegExp(`^(.+\\S)\\s*,\\s*(?:${STATES})\\s*$`, "i"), "$1");

  return n.replace(/\s*,\s*$/, "").replace(/\s+/g, " ").trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[(),.]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "Civil Engineering (4 Years, Bachelor of Technology)" -> branch + degree,
// so tables stay readable without losing which degree a rank refers to.
function splitProgram(p) {
  const m = p.match(/^(.*?)\s*\((\d+)\s*Years?,\s*(.*?)\)\s*$/);
  if (!m) return { branch: p.trim(), degree: "", years: null };
  return { branch: m[1].trim(), degree: m[3].trim(), years: Number(m[2]) };
}

const TYPE_LABEL = { IIT: "IIT", NIT: "NIT", "3IT": "IIIT", CFI: "GFTI" };

async function main() {
  const institutes = new Map();

  for (const [year, file] of FILES) {
    process.stdout.write(`fetching ${year}... `);
    const res = await fetch(`${BASE}/${file}`);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    const lines = (await res.text()).trim().split("\n");
    console.log(`${lines.length - 1} rows`);

    for (let i = 1; i < lines.length; i++) {
      const f = parseLine(lines[i]);
      const [, , type, institute, program, quota, category, gender, orank, crank] =
        f;

      // Pre-2018 rows carry gender "NA": female-supernumerary seats only
      // began in 2018, so those years are one combined pool. Both mean "the
      // main, non-supernumerary pool" — kept together, footnoted in the UI.
      if (gender !== "Gender-Neutral" && gender !== "NA") continue;

      const oi = parseInt(orank, 10);
      const ci = parseInt(crank, 10);
      if (!Number.isFinite(oi) || !Number.isFinite(ci)) continue;

      const short = shortName(institute);
      const slug = slugify(short);
      if (!institutes.has(slug)) {
        institutes.set(slug, {
          slug,
          name: short,
          fullName: institute.trim(),
          type: TYPE_LABEL[type] ?? type,
          programs: new Map(),
          sourceNames: new Set(),
        });
      }
      const inst = institutes.get(slug);
      inst.sourceNames.add(institute.trim());

      const { branch, degree, years } = splitProgram(program);
      const pkey = `${branch}|${degree}`;
      if (!inst.programs.has(pkey)) {
        inst.programs.set(pkey, {
          branch,
          degree,
          years,
          open: {},
          latestCats: {},
        });
      }
      const prog = inst.programs.get(pkey);

      if (category === "OPEN") {
        (prog.open[quota] ??= {})[year] = [oi, ci];
      }
      if (year === "2024" && !/PwD/.test(category)) {
        (prog.latestCats[quota] ??= {})[category] = [oi, ci];
      }
    }
  }

  // IITs are All-India only. NIT/IIIT/GFTI seats split Home State vs Other
  // State; OS is the pool most applicants nationally compete in.
  function primaryQuota(programs) {
    const counts = {};
    for (const p of programs.values())
      for (const q of Object.keys(p.open)) counts[q] = (counts[q] ?? 0) + 1;
    for (const q of ["AI", "OS", "HS", "GO", "JK", "LA"])
      if (counts[q]) return q;
    return Object.keys(counts)[0] ?? null;
  }

  const out = [];
  for (const inst of institutes.values()) {
    const pq = primaryQuota(inst.programs);
    if (!pq) continue;

    const programs = [...inst.programs.values()]
      .map((p) => ({
        branch: p.branch,
        degree: p.degree,
        years: p.years,
        trend: p.open[pq] ?? {},
        categories: p.latestCats[pq] ?? {},
      }))
      .filter((p) => Object.keys(p.trend).length > 0)
      .sort((a, b) => {
        const la = a.trend["2024"]?.[1] ?? Infinity;
        const lb = b.trend["2024"]?.[1] ?? Infinity;
        return la - lb;
      });

    const years = [...new Set(programs.flatMap((p) => Object.keys(p.trend)))].sort();
    if (years.length < MIN_YEARS || programs.length < MIN_PROGRAMS) continue;

    out.push({
      slug: inst.slug,
      name: inst.name,
      fullName: inst.fullName,
      type: inst.type,
      quota: pq,
      years,
      programs,
    });
  }

  out.sort((a, b) => a.name.localeCompare(b.name));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out));

  // Normalisation can legitimately merge source variants (JoSAA has both
  // "...Sri City, Chittoor District, Andhra Pradesh" and "...Andra Pradesh"),
  // but it must never silently merge two genuinely different institutes.
  const merges = [...institutes.values()].filter((i) => i.sourceNames.size > 1);
  if (merges.length) {
    console.log(`\n${merges.length} slug(s) merged multiple source names:`);
    for (const m of merges) {
      console.log(`  ${m.slug}`);
      for (const s of m.sourceNames) console.log(`      <- ${s}`);
    }
  }

  const byType = out.reduce((a, i) => ((a[i.type] = (a[i.type] ?? 0) + 1), a), {});
  console.log(`\nwrote ${out.length} institutes ->`, OUT);
  console.log("by type:", byType);
  console.log("programs:", out.reduce((a, i) => a + i.programs.length, 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
