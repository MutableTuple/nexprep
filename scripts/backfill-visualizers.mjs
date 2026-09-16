#!/usr/bin/env node
// Batch-generates per-question SVG visualizations using Google Gemini's
// free tier, and stores them in questions.visualizer_svg.
//
// Runs entirely offline against the DB — nothing user-facing calls Gemini.
// Users read the cached SVG for free.
//
// Setup:
//   1. npm i @google/generative-ai @supabase/supabase-js dotenv
//   2. Add to .env.local:
//        GEMINI_API_KEY=<your free key from ai.google.dev>
//   3. Run the SQL in supabase/add_visualizer_svg.sql
//   4. node scripts/backfill-visualizers.mjs
//
// Flags:
//   --limit=N     process at most N rows (default: all pending)
//   --force       regenerate even if visualizer_svg is already set
//   --subject=X   only rows with questions.subject = X (e.g. "Physics")
//   --id=UUID     just this one row (for debugging)
//   --dry         print prompt + response but don't write

import dotenv from "dotenv";
// Next.js reads .env.local automatically; a plain `node` process does not.
// Load both so the script picks up NEXT_PUBLIC_SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY from wherever they live.
dotenv.config({ path: ".env.local" });
dotenv.config();
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
// supabase-js v2 always initializes a Realtime client, which needs a
// WebSocket implementation. Node ≥ 22 has one natively; Node 20 doesn't,
// so we hand it the `ws` package. We never use realtime here — we just
// need the constructor to succeed.
import ws from "ws";

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  GEMINI_API_KEY,
  OPENAI_API_KEY,
} = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
    realtime: { transport: ws },
  },
);

// Provider selection. Priority: --provider flag → LLM_PROVIDER env →
// whichever key is available (openai preferred if both are set because
// its rate limits are more predictable). We keep both clients set up
// lazily so a missing key only errors when the provider actually needs it.
const provider =
  args.provider ??
  process.env.LLM_PROVIDER ??
  (OPENAI_API_KEY ? "openai" : "gemini");

const modelId =
  args.model ??
  process.env.GEMINI_MODEL ??
  process.env.OPENAI_MODEL ??
  (provider === "openai" ? "gpt-4o-mini" : "gemini-3.6-flash");

let geminiModel = null;
let openai = null;
if (provider === "gemini") {
  if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY. Get a free one at https://ai.google.dev/");
    process.exit(1);
  }
  geminiModel = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({
    model: modelId,
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  });
} else if (provider === "openai") {
  if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY. Add it to .env.local.");
    process.exit(1);
  }
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
} else {
  console.error(`Unknown provider: ${provider}. Use gemini or openai.`);
  process.exit(1);
}

console.log(`Using provider=${provider}  model=${modelId}`);

// The prompt is the whole product. Kept in one place so improvements
// propagate to every subject.
const SYSTEM = `You generate self-contained SVG diagrams that visualize physics, chemistry, or math questions for JEE/NEET students.

Hard rules — the output is rendered directly in the browser:
1. Output ONLY the SVG. No prose, no markdown fences, no <!DOCTYPE>, no <html>.
2. Root element must be <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">.
3. NEVER use <script>, <foreignObject>, javascript: URLs, event handlers (onclick, onload), or external references (href, src, xlink:href pointing off-svg). All styling inline.
4. Use currentColor for lines/text so the diagram adapts to light/dark theme. Use small palette accents (orange #ea580c, blue #2563eb, green #16a34a, red #dc2626) sparingly for emphasis.
5. Keep line width ~1.5–2, font-family "ui-sans-serif, system-ui", font-size 12–14 for labels.
6. Show the SETUP of the problem, not the answer. E.g. for a series LCR question: draw the circuit with R, L, C in series across an AC source, label X_L, X_C, R next to each. Do not draw the phasor solution unless the question is *about* the phasor.
7. For circuits: use standard symbols (zigzag resistor, coil inductor, parallel-line capacitor, circle-with-sine AC source).
8. For optics: draw lens/mirror + object + optical axis; principal rays if the question is about image formation.
9. For mechanics: draw the body with a mini FBD (weight, normal, tension, friction) using labeled arrows.
10. For geometry: draw the figure with labeled points, angles, sides.
11. For chemistry (organic): draw the skeletal structure. For inorganic: draw the setup (test-tube, apparatus, molecule).
12. If the question is purely algebraic (no visualizable setup), output an SVG that renders the key equation neatly as text.
13. Fill the viewBox — don't leave 80% empty space. Center the diagram.

Return ONLY the SVG source.`;

async function makePrompt(q) {
  return `SUBJECT: ${q.subject}
CHAPTER: ${q.chapter ?? "n/a"}
TOPIC: ${q.topic ?? "n/a"}
QUESTION:
${q.question_text}`;
}

// Strip markdown fences / prose that the model sometimes wraps around SVG.
function extractSvg(raw) {
  const stripped = raw
    .replace(/^```(?:svg|xml|html)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  const start = stripped.indexOf("<svg");
  const end = stripped.lastIndexOf("</svg>");
  if (start === -1 || end === -1) return null;
  return stripped.slice(start, end + "</svg>".length);
}

// Server-side safety net — the frontend re-sanitizes on render, but we don't
// want anything obviously hostile persisted in the DB either.
function looksSafe(svg) {
  const bad = /<script|javascript:|on\w+\s*=|<foreignObject/i;
  return !bad.test(svg);
}

async function fetchPending() {
  let query = supabase
    .from("questions")
    .select("id, subject, chapter, topic, question_text, visualizer_svg")
    .eq("status", "published");
  if (args.id) query = query.eq("id", args.id);
  else if (!args.force) query = query.is("visualizer_svg", null);
  if (args.subject) query = query.eq("subject", args.subject);
  query = query.order("created_at", { ascending: false });
  if (args.limit) query = query.limit(Number(args.limit));
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// One provider-agnostic call. Returns raw text; SVG extraction happens
// downstream. Retry with exponential backoff on transient 429/503.
async function callProvider(prompt) {
  if (provider === "gemini") {
    const res = await geminiModel.generateContent([
      { text: SYSTEM },
      { text: prompt },
    ]);
    return res.response.text();
  }
  // openai
  const res = await openai.chat.completions.create({
    model: modelId,
    temperature: 0.4,
    max_tokens: 4096,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt },
    ],
  });
  return res.choices?.[0]?.message?.content ?? "";
}

async function callWithRetry(prompt) {
  const delays = [5000, 15000, 45000];
  let lastErr;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await callProvider(prompt);
    } catch (err) {
      lastErr = err;
      const msg = String(err?.message ?? err);
      const transient =
        msg.includes("503") ||
        msg.includes("429") ||
        msg.includes("high demand") ||
        msg.includes("rate limit") ||
        msg.includes("overloaded");
      if (!transient || attempt === delays.length) throw err;
      const wait = delays[attempt];
      console.log(`   ↻ transient error, retrying in ${wait / 1000}s…`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

async function generateFor(q) {
  const prompt = await makePrompt(q);
  const text = await callWithRetry(prompt);
  const svg = extractSvg(text);
  if (!svg) throw new Error("No <svg> in response");
  if (!looksSafe(svg)) throw new Error("Response failed safety check");
  return svg;
}

// Rate-limit pacing. Gemini free tier caps at 15 RPM → 4.2s between
// calls. OpenAI's tier-1 minute cap is generous (500 RPM on gpt-4o-mini)
// so we can go much faster there.
const RATE_LIMIT_MS = provider === "openai" ? 400 : 4200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const rows = await fetchPending();
  console.log(`Processing ${rows.length} question(s).`);
  let ok = 0;
  let failed = 0;

  for (const [i, q] of rows.entries()) {
    const label = `[${i + 1}/${rows.length}] ${q.id.slice(0, 8)}  ${q.topic ?? q.subject}`;
    try {
      const svg = await generateFor(q);
      if (args.dry) {
        console.log(`${label}  DRY`);
        console.log(svg.slice(0, 400) + (svg.length > 400 ? "…" : ""));
      } else {
        const { error } = await supabase
          .from("questions")
          .update({
            visualizer_svg: svg,
            visualizer_model: modelId,
            visualizer_generated_at: new Date().toISOString(),
          })
          .eq("id", q.id);
        if (error) throw error;
        console.log(`${label}  OK (${svg.length}b)`);
      }
      ok++;
    } catch (err) {
      console.warn(`${label}  FAIL: ${err.message}`);
      failed++;
    }
    // Pace unless it's the last one
    if (i < rows.length - 1) await sleep(RATE_LIMIT_MS);
  }

  console.log(`\nDone. ok=${ok}  failed=${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
