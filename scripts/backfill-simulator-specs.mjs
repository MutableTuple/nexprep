#!/usr/bin/env node
// Classifies every question into an interactive simulator spec and
// caches it in questions.simulator_spec. Runs once (per new-question
// batch); users then read the cached JSON for free at request time.
//
// Rule-based matcher (app/_lib/question-simulator-matcher.js) is
// checked at render time BEFORE this cached column — so this script
// only needs to cover the long tail the rules miss.
//
// Setup:
//   1. npm i @supabase/supabase-js openai @google/generative-ai ws dotenv
//   2. Run supabase/add_simulator_spec.sql in the SQL editor.
//   3. Add to .env.local:
//        OPENAI_API_KEY=sk-...        (recommended, ~$0.0002/question)
//        # or GEMINI_API_KEY=...
//   4. node scripts/backfill-simulator-specs.mjs --provider=openai
//
// Flags:
//   --limit=N     process at most N rows (default: all pending)
//   --force       reclassify even if simulator_spec_generated_at is set
//   --subject=X   only rows with questions.subject = X
//   --id=UUID     just this one row (debugging)
//   --dry         print classification but don't write
//   --provider=X  openai | gemini
//   --model=X     override default model

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
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
  { auth: { persistSession: false }, realtime: { transport: ws } },
);

const provider =
  args.provider ??
  process.env.LLM_PROVIDER ??
  (OPENAI_API_KEY ? "openai" : "gemini");

const modelId =
  args.model ??
  process.env.OPENAI_MODEL ??
  process.env.GEMINI_MODEL ??
  (provider === "openai" ? "gpt-4o-mini" : "gemini-3.6-flash");

let geminiModel = null;
let openai = null;
if (provider === "gemini") {
  if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY.");
    process.exit(1);
  }
  geminiModel = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0.1,
      // Room for full SVG diagrams alongside the formula chain.
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });
} else if (provider === "openai") {
  if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY.");
    process.exit(1);
  }
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
} else {
  console.error(`Unknown provider: ${provider}`);
  process.exit(1);
}

console.log(`Using provider=${provider}  model=${modelId}`);

// Registry — kept in lockstep with app/_components/Problems/QuestionSimulator.jsx.
// The order matters: prefer the specific handcrafted sim when a question
// matches one of them; fall back to formula-stepper for any other
// numeric question with a formula chain.
const SIMULATOR_KINDS = [
  {
    kind: "lcr-phasor",
    when:
      "Series LCR / RLC AC circuit questions involving R, X_L, X_C, impedance, phase angle, power factor, resonance.",
    params: {
      R: "resistance in ohms",
      XL: "inductive reactance in ohms",
      XC: "capacitive reactance in ohms",
    },
    defaults: { R: 100, XL: 100, XC: 100 },
  },
  {
    kind: "projectile",
    when:
      "Projectile motion, range, maximum height, time of flight, launch angle.",
    params: {
      velocity: "initial speed in m/s (5-100)",
      angleDeg: "launch angle in degrees (5-85)",
    },
    defaults: { velocity: 30, angleDeg: 45 },
  },
  {
    kind: "wedge",
    when:
      "Block on an inclined plane / wedge with friction; mg sinθ, mg cosθ, normal reaction, friction coefficient, sliding.",
    params: {
      angleDeg: "incline angle in degrees (5-80)",
      mass: "mass in kg (0.5-20)",
      muS: "static friction coefficient (0-1.5)",
      muK: "kinetic friction coefficient (0-1.5)",
    },
    defaults: { angleDeg: 30, mass: 2, muS: 0.3, muK: 0.25 },
  },
  {
    kind: "pulley",
    when: "Atwood machine / pulley with two masses, tension, constraint motion.",
    params: { m1: "kg", m2: "kg" },
    defaults: { m1: 2, m2: 3 },
  },
  {
    kind: "rayoptics",
    when:
      "Thin lens (convex/concave), image formation, focal length, magnification, principal rays.",
    params: {},
    defaults: {},
  },
  {
    kind: "coulomb",
    when: "Coulomb's law, point charges, electric field, force between charges.",
    params: {},
    defaults: {},
  },
  {
    kind: "scene3d",
    when:
      "Genuinely spatial questions where a 3D view helps intuition. Good fits: electric/magnetic dipoles and fields, point-charge geometries, molecules (VSEPR, orbitals, crystal structures), planetary/orbital motion, 3D geometry (planes, lines, solids of revolution), rotational dynamics, torques, projectile-in-3D. Bad fits: chemistry stoichiometry, colligative props, integrals, series, pure algebra — those should use formula-stepper. Only pick this when a rotatable 3D view makes the SETUP clearer.",
    params: {
      camera:
        "{ position: [x,y,z], target?: [x,y,z], fov?: number } — position the camera 3–6 units back so the scene fits.",
      controls:
        "OPTIONAL array of sliders: { name (JS identifier), label, value, min, max, unit? }. Each slider's `name` can be referenced inside primitive numeric slots as a string expression.",
      primitives:
        "Array of { type, ...props }. Every numeric coordinate/radius can be a number OR a string expression referencing control names. Types: sphere{at,r,color,label,opacity}, box{at,size,color,label,rotation,opacity}, arrow{from,to,color,label}, line{from,to,color,dashed}, cylinder{from,to,r,color,label}, plane{at,size,color,opacity,rotation}, text{at,text,size,color}. All positions in a units-of-1 scene — keep magnitudes small (fits within a 6×6×6 box).",
    },
    defaults: null,
  },
  {
    kind: "formula-stepper",
    when:
      "UNIVERSAL FALLBACK — any numeric physics / chemistry / math question that has a clear formula chain (colligative properties, gas laws, kinematics not covered above, molality, pH, half-life, Beer-Lambert, rate laws, work-energy, definite integrals with numeric answer, combinatorics with binomial coefficient, oxidation-number sums, telescoping sums, dimensional analysis, molarity/molality/mole calcs, thermodynamics, EMF, etc.). Emit `inputs` (variables the student can slide) and `steps` (chain of formulas that reference inputs and earlier step names). Never use for qualitative theory questions with no numeric answer.",
    params: {
      inputs:
        "array of { name (JS identifier, no spaces), label (human), value (number), min? (number), max? (number), unit? (string) }",
      steps:
        "array of { name? (JS identifier, needed if later steps reference this one), label (human, e.g. 'Molality'), expr (arithmetic string using input names and prior step names — +, -, *, /, ^, parens, and math functions like sin, cos, sqrt, log, exp, pi, e), unit? (string), highlight? (true on the final answer step) }",
      diagram:
        "REQUIRED string — a self-contained SVG (viewBox 0 0 400 240) showing the physical/chemical setup of the problem. Use currentColor + a small palette (orange #ea580c, green #16a34a, blue #2563eb, red #dc2626). Standard symbols: zigzag resistor, coil inductor, plate capacitor, circle+sine AC source; lens/mirror; block on incline; two point charges; molecule diagram; test-tube setup; graph with axes. No <script>, no <foreignObject>, no external hrefs. Root element must be <svg viewBox='0 0 400 240' xmlns='http://www.w3.org/2000/svg'>.",
    },
    defaults: null,
  },
];

const SYSTEM = `You classify JEE/NEET physics/chemistry/math questions into interactive simulators.

Given ONE question (plus its explanation for context), choose the best-fitting simulator kind and produce its params. Prefer specific handcrafted sims over the universal formula-stepper when the topic clearly matches. Only return kind=null for pure qualitative/theory questions with no numeric answer at all.

Available simulator kinds:
${SIMULATOR_KINDS.map(
  (k) =>
    `- "${k.kind}": ${k.when}\n  params: ${JSON.stringify(k.params)}${k.defaults ? "\n  defaults: " + JSON.stringify(k.defaults) : ""}`,
).join("\n\n")}

Reply with STRICT JSON only. No prose, no markdown fences.
Schema: {"kind": string | null, "params": object, "confidence": number 0..1}

Rules for formula-stepper specifically (this covers most questions):
- Read the question and the explanation carefully; the explanation usually shows the exact steps.
- Extract every numeric quantity mentioned as an input (mass, moles, concentration, temperature, coefficients, given constants, etc.). Give each a JS-safe name (letters, digits, underscore, no spaces).
- Set sensible min/max so sliders let the student explore ~0.2×–3× the given value. Include units.
- Build steps as ordered arithmetic. Each step's expr can reference input names and any earlier step's name.
- Mark the FINAL answer step with "highlight": true.
- Use standard math syntax: + - * / ^ ( ) and functions sin cos tan log ln exp sqrt abs. Constants: pi, e. Do NOT use LaTeX or units inside expressions.
- If a formula requires unit conversion (grams to kg, cm to m), do that inside the expression: e.g. mass_water / 1000.
- ALWAYS include a "diagram" SVG that visually shows the problem's SETUP (not the answer). Circuit? Draw the circuit. Colligative? Beaker with solute + solvent. Dipole? Two point charges with arrow. Lens? Object + lens + optical axis. Combinatorics? Boxes/balls. Integral? Curve with shaded area. If nothing visual applies (pure algebraic identity), draw a clean text panel showing the key equation.

Example for an electric-dipole question (kind: scene3d):
{
  "kind": "scene3d",
  "confidence": 0.9,
  "params": {
    "camera": { "position": [3, 2, 4], "target": [1, 0, 0], "fov": 50 },
    "controls": [
      { "name": "separation", "label": "Charge separation d", "value": 2, "min": 0.5, "max": 4, "unit": "m" }
    ],
    "primitives": [
      { "type": "sphere", "at": [0, 0, 0], "r": 0.2, "color": "#dc2626", "label": "+q" },
      { "type": "sphere", "at": ["separation", 0, 0], "r": 0.2, "color": "#2563eb", "label": "−q" },
      { "type": "arrow", "from": [0, 0, 0], "to": ["separation", 0, 0], "color": "#ea580c", "label": "p" },
      { "type": "text", "at": ["separation / 2", -0.35, 0], "text": "d", "color": "#eaeaea" }
    ]
  }
}

Example for a colligative-properties question (kind: formula-stepper):
{
  "kind": "formula-stepper",
  "confidence": 0.9,
  "params": {
    "diagram": "<svg viewBox='0 0 400 240' xmlns='http://www.w3.org/2000/svg'><rect x='120' y='60' width='160' height='140' rx='6' fill='none' stroke='currentColor' stroke-width='2'/><path d='M 130 130 Q 200 110 270 130 L 270 195 L 130 195 Z' fill='#2563eb' fill-opacity='0.15' stroke='#2563eb'/><circle cx='170' cy='160' r='4' fill='#ea580c'/><circle cx='210' cy='175' r='4' fill='#ea580c'/><circle cx='240' cy='150' r='4' fill='#ea580c'/><text x='200' y='40' text-anchor='middle' font-size='14' fill='currentColor'>Urea in water</text><text x='300' y='170' font-size='11' fill='#ea580c'>solute</text><text x='60' y='170' font-size='11' fill='#2563eb'>solvent</text></svg>",
    "inputs": [
      { "name": "mass_solute", "label": "Mass of solute", "value": 0.6, "min": 0.1, "max": 5, "unit": "g" },
      { "name": "M", "label": "Molar mass", "value": 60, "min": 20, "max": 300, "unit": "g/mol" },
      { "name": "mass_solvent", "label": "Mass of solvent", "value": 100, "min": 20, "max": 500, "unit": "g" },
      { "name": "Kf", "label": "Kf", "value": 1.86, "min": 0.5, "max": 5, "unit": "K·kg/mol" }
    ],
    "steps": [
      { "name": "moles", "label": "Moles of solute", "expr": "mass_solute / M", "unit": "mol" },
      { "name": "molality", "label": "Molality", "expr": "moles / (mass_solvent / 1000)", "unit": "mol/kg" },
      { "label": "Depression in freezing point ΔTf", "expr": "Kf * molality", "unit": "K", "highlight": true }
    ]
  }
}`;

async function fetchPending() {
  let query = supabase
    .from("questions")
    .select(
      "id, subject, chapter, topic, question_text, explanation, simulator_spec, simulator_spec_generated_at",
    )
    .eq("status", "published");
  if (args.id) query = query.eq("id", args.id);
  else if (!args.force) query = query.is("simulator_spec_generated_at", null);
  if (args.subject) query = query.eq("subject", args.subject);
  query = query.order("created_at", { ascending: false });
  if (args.limit) query = query.limit(Number(args.limit));
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

function makePrompt(q) {
  // Include the explanation so the LLM can copy the formula chain that
  // the author already wrote out. Truncate very long ones to keep tokens
  // reasonable — the leading steps are the load-bearing part.
  const explanation = (q.explanation ?? "").slice(0, 2500);
  return `SUBJECT: ${q.subject}
CHAPTER: ${q.chapter ?? "n/a"}
TOPIC: ${q.topic ?? "n/a"}
QUESTION:
${q.question_text}

EXPLANATION (use this to identify inputs and the formula chain):
${explanation}`;
}

async function callProvider(prompt) {
  if (provider === "gemini") {
    const res = await geminiModel.generateContent([
      { text: SYSTEM },
      { text: prompt },
    ]);
    return res.response.text();
  }
  const res = await openai.chat.completions.create({
    model: modelId,
    temperature: 0.1,
    // Room for full SVG diagrams alongside the formula chain.
    max_tokens: 2048,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt },
    ],
  });
  return res.choices?.[0]?.message?.content ?? "";
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RATE_LIMIT_MS = provider === "openai" ? 300 : 4200;

async function callWithRetry(prompt) {
  const delays = [4000, 12000, 30000];
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

const VALID_KINDS = new Set(SIMULATOR_KINDS.map((k) => k.kind));

function extractJson(raw) {
  // Some models wrap in markdown fences even when told not to.
  const trimmed = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return null;
  }
}

function validateSpec(parsed) {
  if (!parsed || typeof parsed !== "object")
    return { kind: null, params: {}, confidence: 0 };
  const conf = Number(parsed.confidence) || 0;
  if (parsed.kind == null || !VALID_KINDS.has(parsed.kind) || conf < 0.5) {
    return { kind: null, params: {}, confidence: conf };
  }
  const params =
    parsed.params && typeof parsed.params === "object" ? parsed.params : {};

  // formula-stepper needs its full nested shape preserved.
  if (parsed.kind === "formula-stepper") {
    const inputs = Array.isArray(params.inputs) ? params.inputs : [];
    const steps = Array.isArray(params.steps) ? params.steps : [];
    const cleanInputs = inputs
      .filter((i) => i && typeof i.name === "string" && typeof i.value === "number")
      .map((i) => ({
        name: i.name.replace(/[^A-Za-z0-9_]/g, "_"),
        label: String(i.label ?? i.name),
        value: Number(i.value),
        min: typeof i.min === "number" ? i.min : undefined,
        max: typeof i.max === "number" ? i.max : undefined,
        unit: i.unit ? String(i.unit) : undefined,
      }));
    const cleanSteps = steps
      .filter((s) => s && typeof s.expr === "string" && typeof s.label === "string")
      .map((s) => ({
        name: s.name ? String(s.name).replace(/[^A-Za-z0-9_]/g, "_") : undefined,
        label: String(s.label),
        expr: String(s.expr).trim(),
        unit: s.unit ? String(s.unit) : undefined,
        highlight: Boolean(s.highlight),
      }));
    if (!cleanInputs.length || !cleanSteps.length) {
      return { kind: null, params: {}, confidence: conf };
    }
    // Diagram: keep only if it looks like a real SVG root; strip anything
    // obviously unsafe. The client re-sanitizes with DOMPurify at render.
    let diagram = null;
    if (typeof params.diagram === "string") {
      const d = params.diagram.trim();
      if (
        /^<svg[\s>]/i.test(d) &&
        /<\/svg>\s*$/i.test(d) &&
        !/<script|javascript:|on\w+\s*=|<foreignObject/i.test(d)
      ) {
        diagram = d;
      }
    }
    return {
      kind: "formula-stepper",
      params: { inputs: cleanInputs, steps: cleanSteps, diagram },
      confidence: conf,
    };
  }

  // scene3d — preserve nested camera + primitives + controls.
  if (parsed.kind === "scene3d") {
    const camera =
      params.camera && typeof params.camera === "object"
        ? {
            position: Array.isArray(params.camera.position)
              ? params.camera.position.map(Number)
              : [4, 3, 5],
            target: Array.isArray(params.camera.target)
              ? params.camera.target.map(Number)
              : [0, 0, 0],
            fov: Number(params.camera.fov) || 50,
          }
        : { position: [4, 3, 5], target: [0, 0, 0], fov: 50 };
    const ctrls = Array.isArray(params.controls) ? params.controls : [];
    const cleanCtrls = ctrls
      .filter((c) => c && typeof c.name === "string" && typeof c.value === "number")
      .map((c) => ({
        name: c.name.replace(/[^A-Za-z0-9_]/g, "_"),
        label: String(c.label ?? c.name),
        value: Number(c.value),
        min: typeof c.min === "number" ? c.min : undefined,
        max: typeof c.max === "number" ? c.max : undefined,
        unit: c.unit ? String(c.unit) : undefined,
      }));
    const prims = Array.isArray(params.primitives) ? params.primitives : [];
    const ALLOWED_TYPES = new Set([
      "sphere",
      "box",
      "arrow",
      "line",
      "cylinder",
      "plane",
      "text",
    ]);
    const cleanPrims = prims.filter(
      (p) => p && typeof p.type === "string" && ALLOWED_TYPES.has(p.type),
    );
    if (!cleanPrims.length) {
      return { kind: null, params: {}, confidence: conf };
    }
    return {
      kind: "scene3d",
      params: {
        camera,
        controls: cleanCtrls,
        primitives: cleanPrims,
      },
      confidence: conf,
    };
  }

  // Handcrafted sims — flat scalar/boolean params.
  const cleanParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "number") cleanParams[k] = v;
    else if (typeof v === "string" && !Number.isNaN(parseFloat(v)))
      cleanParams[k] = parseFloat(v);
    else if (typeof v === "boolean") cleanParams[k] = v;
  }
  return { kind: parsed.kind, params: cleanParams, confidence: conf };
}

async function main() {
  const rows = await fetchPending();
  console.log(`Processing ${rows.length} question(s).`);
  let matched = 0;
  let unmatched = 0;
  let failed = 0;

  for (const [i, q] of rows.entries()) {
    const label = `[${i + 1}/${rows.length}] ${q.id.slice(0, 8)}  ${q.topic ?? q.subject}`;
    try {
      const raw = await callWithRetry(makePrompt(q));
      const parsed = extractJson(raw);
      const spec = validateSpec(parsed);
      if (args.dry) {
        console.log(`${label}  DRY  →  ${JSON.stringify(spec)}`);
      } else {
        // We ALWAYS write generated_at so unmatched questions don't get
        // re-tried on every backfill. `spec` is stored as null when there's
        // no match — that's a valid, cached "no simulator" verdict.
        const { error } = await supabase
          .from("questions")
          .update({
            simulator_spec: spec.kind ? spec : null,
            simulator_spec_model: modelId,
            simulator_spec_generated_at: new Date().toISOString(),
          })
          .eq("id", q.id);
        if (error) throw error;
        console.log(
          `${label}  →  ${spec.kind ?? "null"}  (${spec.confidence.toFixed(2)})`,
        );
      }
      if (spec.kind) matched++;
      else unmatched++;
    } catch (err) {
      console.warn(`${label}  FAIL: ${err.message}`);
      failed++;
    }
    if (i < rows.length - 1) await sleep(RATE_LIMIT_MS);
  }

  console.log(
    `\nDone. matched=${matched}  unmatched=${unmatched}  failed=${failed}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
