"use client";

import { useEffect, useMemo, useState } from "react";
import { Parser } from "expr-eval";

// Universal numeric-question simulator. Takes a list of INPUT variables
// (with slider bounds) and a chain of STEP formulas that reference those
// variables (and each other). Renders sliders for each input, evaluates
// every step live, and highlights the final answer.
//
// This is the generic fallback that covers ~90% of physics / chemistry
// / math questions with a formula chain — colligative properties, gas
// laws, kinematics, Beer-Lambert, molality, rate laws, Arrhenius, etc.
//
// The evaluator is `expr-eval`, a whitelisted expression parser — no
// `eval`, no `new Function`. Safe to run on LLM-generated strings.

export default function FormulaStepperSim({
  inputs = [],
  steps = [],
  diagram = null,
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(inputs.map((i) => [i.name, Number(i.value)])),
  );

  // Parser instance is stateless; hold it in a ref-ish memo.
  const parser = useMemo(() => new Parser(), []);

  // Walk the steps in order, evaluating each with the scope of inputs +
  // already-computed step results. A step's result is exposed to
  // subsequent steps under its `name` (if provided) so authors can build
  // long derivations without repeating substitutions.
  const evaluated = useMemo(() => {
    const scope = { ...values };
    return steps.map((step, idx) => {
      try {
        const expr = parser.parse(step.expr);
        const result = expr.evaluate(scope);
        const varName = step.name || `step${idx + 1}`;
        scope[varName] = result;
        return { ...step, computed: result, error: null };
      } catch (e) {
        return { ...step, computed: null, error: e.message };
      }
    });
  }, [values, steps, parser]);

  if (!inputs.length || !steps.length) {
    return (
      <div className="text-sm text-muted-foreground italic p-4">
        Simulator data unavailable for this problem.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {diagram ? <DiagramPanel svg={diagram} /> : null}

      {/* Inputs */}
      <div className="rounded-2xl border border-border bg-background/50 p-4">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Inputs — drag to see how the answer changes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {inputs.map((input) => (
            <Slider
              key={input.name}
              label={input.label ?? input.name}
              unit={input.unit ?? ""}
              value={values[input.name]}
              min={input.min ?? 0}
              max={input.max ?? Math.max(input.value * 3, input.value + 1)}
              step={input.step ?? guessStep(input)}
              onChange={(v) =>
                setValues((prev) => ({ ...prev, [input.name]: v }))
              }
            />
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-2xl border border-border bg-background/50 p-4">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Step-by-step solution
        </h4>
        <div className="space-y-2">
          {evaluated.map((step, i) => (
            <div
              key={i}
              className={
                "rounded-lg p-3 border flex flex-col gap-1 " +
                (step.highlight
                  ? "bg-[hsl(20,91%,48%)]/10 border-[hsl(20,91%,48%)]/40"
                  : "bg-muted/30 border-border")
              }
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  Step {i + 1}: {step.label}
                </span>
                <span
                  className={
                    "text-lg font-mono " +
                    (step.highlight ? "font-bold text-foreground" : "")
                  }
                >
                  {step.computed != null && !Number.isNaN(step.computed)
                    ? formatNum(step.computed)
                    : "—"}
                  {step.unit && (
                    <span className="text-xs text-muted-foreground ml-1">
                      {step.unit}
                    </span>
                  )}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono break-all">
                = {step.expr}
              </div>
              {step.error && (
                <div className="text-[11px] text-red-500">{step.error}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reasonable slider granularity: if a value is < 1, step by 0.01;
// < 100, by 0.1; otherwise by 1.
function guessStep(input) {
  const range = (input.max ?? input.value * 3) - (input.min ?? 0);
  if (range <= 1) return 0.01;
  if (range <= 20) return 0.1;
  if (range <= 200) return 1;
  return Math.round(range / 100);
}

function formatNum(n) {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs < 0.001 || abs >= 100000) return n.toExponential(3);
  return Number(n.toPrecision(4)).toString();
}

// DiagramPanel — takes an LLM-generated SVG string and renders it after
// sanitizing with DOMPurify (SVG profile). We strip fixed width/height
// on the outer <svg> so the diagram scales with the modal.
function DiagramPanel({ svg }) {
  const [DOMPurify, setDOMPurify] = useState(null);

  useEffect(() => {
    let live = true;
    import("isomorphic-dompurify").then((mod) => {
      if (live) setDOMPurify(() => mod.default ?? mod);
    });
    return () => {
      live = false;
    };
  }, []);

  const cleaned = useMemo(() => {
    if (!svg || !DOMPurify) return null;
    let out = DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      FORBID_ATTR: ["href", "xlink:href", "onclick", "onload", "onerror"],
      FORBID_TAGS: ["script", "foreignObject", "iframe"],
    });
    out = out.replace(/<svg([^>]*?)\swidth="[^"]*"/i, "<svg$1");
    out = out.replace(/<svg([^>]*?)\sheight="[^"]*"/i, "<svg$1");
    return out;
  }, [svg, DOMPurify]);

  if (!cleaned) return null;
  return (
    <div className="rounded-2xl border border-border bg-muted/25 p-4 flex items-center justify-center">
      <div
        className="w-full [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-[240px] text-foreground"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    </div>
  );
}

function Slider({ label, value, unit, min, max, step, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span className="normal-case tracking-normal text-[11px] text-foreground/85">
          {label}
        </span>
        <span className="font-mono normal-case tracking-normal text-foreground">
          {formatNum(value)}
          {unit ? ` ${unit}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
    </label>
  );
}
