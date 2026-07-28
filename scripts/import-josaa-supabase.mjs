/**
 * Loads supabase/josaa_cutoffs.csv into the public.josaa_cutoffs table.
 *
 *   node scripts/import-josaa-supabase.mjs           # insert (fails if rows exist)
 *   node scripts/import-josaa-supabase.mjs --replace # truncate-then-insert
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Run scripts/export-josaa-
 * supabase.mjs first, and apply supabase/josaa_cutoffs.sql so the table and
 * functions exist.
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSV = join(ROOT, "supabase", "josaa_cutoffs.csv");
const BATCH = 2000;

const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const H = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

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

const NUMERIC = new Set([
  "year",
  "round",
  "duration_years",
  "opening_rank",
  "closing_rank",
]);

async function main() {
  const replace = process.argv.includes("--replace");

  const lines = readFileSync(CSV, "utf8").trim().split("\n");
  const header = parseLine(lines[0]);
  console.log(`csv: ${lines.length - 1} rows`);

  // Guard against silently doubling the table on a re-run.
  const head = await fetch(`${URL_BASE}/rest/v1/josaa_cutoffs?select=id&limit=1`, {
    headers: { ...H, Prefer: "count=exact" },
  });
  const existing = Number(head.headers.get("content-range")?.split("/")[1] ?? 0);
  if (existing > 0) {
    if (!replace) {
      console.error(
        `\nTable already has ${existing} rows. Re-run with --replace to truncate first.`,
      );
      process.exit(1);
    }
    console.log(`deleting ${existing} existing rows...`);
    const del = await fetch(`${URL_BASE}/rest/v1/josaa_cutoffs?id=gt.0`, {
      method: "DELETE",
      headers: H,
    });
    if (!del.ok) {
      console.error("delete failed:", del.status, await del.text());
      process.exit(1);
    }
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const f = parseLine(lines[i]);
    const o = {};
    header.forEach((h, j) => {
      const v = f[j];
      o[h] = NUMERIC.has(h) ? (v === "" ? null : Number(v)) : v;
    });
    rows.push(o);
  }

  let done = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const res = await fetch(`${URL_BASE}/rest/v1/josaa_cutoffs`, {
      method: "POST",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      console.error(`\nbatch at ${i} failed:`, res.status, await res.text());
      process.exit(1);
    }
    done += chunk.length;
    process.stdout.write(`\rinserted ${done}/${rows.length}`);
  }

  const check = await fetch(
    `${URL_BASE}/rest/v1/josaa_cutoffs?select=id&limit=1`,
    { headers: { ...H, Prefer: "count=exact" } },
  );
  console.log(
    `\ndone. table now has ${check.headers.get("content-range")?.split("/")[1]} rows`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
