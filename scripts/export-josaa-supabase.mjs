/**
 * Exports the full JoSAA opening/closing rank dataset as a CSV ready for
 * Supabase import:
 *
 *   node scripts/export-josaa-supabase.mjs
 *   -> supabase/josaa_cutoffs.csv
 *
 * Unlike app/_data/josaa-cutoffs.json (which is aggregated and filtered down
 * to what the static college pages render), this keeps EVERY row: all years,
 * quotas, categories and both genders. The college predictor needs the full
 * grid to answer queries for any category/quota combination.
 *
 * Source and provenance: see scripts/build-josaa-cutoffs.mjs.
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "supabase", "josaa_cutoffs.csv");
const BASE =
  "https://raw.githubusercontent.com/PardhavMaradani/josaa-sql-interface/main/csv";

const FILES = [
  ["2016", 6, "josaa-2016-r6-all.csv"],
  ["2017", 7, "josaa-2017-r7-all.csv"],
  ["2018", 7, "josaa-2018-r7-all.csv"],
  ["2019", 7, "josaa-2019-r7-all.csv"],
  ["2020", 6, "josaa-2020-r6-all.csv"],
  ["2021", 6, "josaa-2021-r6-all.csv"],
  ["2022", 6, "josaa-2022-r6-all.csv"],
  ["2023", 6, "josaa-2023-r6-all.csv"],
  ["2024", 5, "josaa-2024-r5-all.csv"],
];

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

function shortName(full) {
  let n = full.trim();
  n = n
    .replace(/Technology\(/gi, "Technology (")
    .replace(/[-–]\s*\d{6}\b/g, "")
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
    [/^International Institute of Information Technology,?\s*/i, "IIIT "],
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
  const STATES =
    "Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Jammu (?:and|&) Kashmir|Delhi";
  n = n.replace(new RegExp(`^(.+\\S)\\s*,\\s*(?:${STATES})\\s*$`, "i"), "$1");
  return n
    .replace(/\s*,\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[(),.]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitProgram(p) {
  const m = p.match(/^(.*?)\s*\((\d+)\s*Years?,\s*(.*?)\)\s*$/);
  if (!m) return { branch: p.trim(), degree: "", years: "" };
  return { branch: m[1].trim(), degree: m[3].trim(), years: m[2] };
}

const TYPE_LABEL = { IIT: "IIT", NIT: "NIT", "3IT": "IIIT", CFI: "GFTI" };

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const rows = [
    [
      "year",
      "round",
      "institute_slug",
      "institute_name",
      "institute_full_name",
      "institute_type",
      "branch",
      "degree",
      "duration_years",
      "quota",
      "category",
      "gender",
      "opening_rank",
      "closing_rank",
    ].join(","),
  ];

  let kept = 0;
  let skipped = 0;

  for (const [year, round, file] of FILES) {
    process.stdout.write(`fetching ${year}... `);
    const res = await fetch(`${BASE}/${file}`);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    const lines = (await res.text()).trim().split("\n");

    let n = 0;
    for (let i = 1; i < lines.length; i++) {
      const f = parseLine(lines[i]);
      const [
        ,
        ,
        type,
        institute,
        program,
        quota,
        category,
        gender,
        orank,
        crank,
      ] = f;

      const oi = parseInt(orank, 10);
      const ci = parseInt(crank, 10);
      if (!Number.isFinite(oi) || !Number.isFinite(ci)) {
        skipped++;
        continue;
      }

      const short = shortName(institute);
      const { branch, degree, years } = splitProgram(program);

      rows.push(
        [
          year,
          round,
          slugify(short),
          short,
          institute.trim(),
          TYPE_LABEL[type] ?? type,
          branch,
          degree,
          years,
          quota,
          category,
          // Pre-2018 has no gender split; normalise to the main pool so
          // predictor queries filtering on Gender-Neutral still see history.
          gender === "NA" ? "Gender-Neutral" : gender,
          oi,
          ci,
        ]
          .map(csvCell)
          .join(","),
      );
      n++;
      kept++;
    }
    console.log(`${n} rows`);
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, rows.join("\n") + "\n");
  console.log(`\nwrote ${kept} rows (skipped ${skipped} non-numeric) ->`, OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
