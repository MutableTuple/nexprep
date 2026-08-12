// app/_lib/latex-to-text.js
//
// Converts LaTeX math notation into readable plain/Unicode text, for
// contexts that can't render actual math typesetting — namely email
// clients, which don't run KaTeX/MathJax and would otherwise show raw
// LaTeX source (e.g. "\frac{\pi}{4}") as literal text.
//
// This is a heuristic text transform, not a LaTeX parser — it covers the
// constructs that actually show up in this question bank (fractions, sums,
// limits, trig functions, Greek letters, sub/superscripts, basic
// operators). It will not handle matrices, aligned systems, or other
// advanced constructs; those will just have their backslash commands
// stripped, which is still more readable than raw LaTeX.

const GREEK = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  pi: "π",
  rho: "ρ",
  sigma: "σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  Gamma: "Γ",
  Delta: "Δ",
  Theta: "Θ",
  Lambda: "Λ",
  Xi: "Ξ",
  Pi: "Π",
  Sigma: "Σ",
  Phi: "Φ",
  Psi: "Ψ",
  Omega: "Ω",
  infty: "∞",
};

const TRIG_AND_FUNCS =
  /\\(sin|cos|tan|cot|sec|csc|log|ln|exp|min|max|det|dim|gcd|lcm|sinh|cosh|tanh)\b/g;

function replaceFractions(s) {
  // \frac{a}{b}, \dfrac{a}{b}, \tfrac{a}{b} -> (a)/(b)
  // Run repeatedly, innermost-first, so nested fractions resolve correctly.
  const fracRe = /\\d?frac\{([^{}]*)\}\{([^{}]*)\}/;
  let prev;
  do {
    prev = s;
    s = s.replace(fracRe, "($1)/($2)");
  } while (s !== prev && fracRe.test(s));
  return s;
}

function replaceGreek(s) {
  return s.replace(/\\([A-Za-z]+)/g, (match, name) => GREEK[name] ?? match);
}

export function latexToReadableText(input) {
  if (!input) return "";
  let s = String(input);

  // Strip math-mode delimiters
  s = s.replace(/\$\$/g, "").replace(/\$/g, "");

  // \left( \right) etc. just add sizing — drop them, keep the bracket
  s = s.replace(/\\left/g, "").replace(/\\right/g, "");

  // Fractions before anything else touches braces
  s = replaceFractions(s);

  // Sum / product / integral / limit with sub/superscript ranges
  s = s.replace(/\\sum_\{([^{}]*)\}\^\{([^{}]*)\}/g, "Σ($1 to $2)");
  s = s.replace(/\\sum_\{([^{}]*)\}/g, "Σ($1)");
  s = s.replace(/\\prod_\{([^{}]*)\}\^\{([^{}]*)\}/g, "Π($1 to $2)");
  s = s.replace(/\\prod_\{([^{}]*)\}/g, "Π($1)");
  s = s.replace(/\\int_\{([^{}]*)\}\^\{([^{}]*)\}/g, "∫($1 to $2)");
  s = s.replace(/\\lim_\{([^{}]*)\}/g, "lim($1)");

  // Trig / log / other named functions — drop the backslash
  s = s.replace(TRIG_AND_FUNCS, "$1");

  // Greek letters and other named symbols (after functions, so e.g. \sin
  // isn't mistaken for a Greek-letter-style command)
  s = replaceGreek(s);

  // Square roots
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, "√($1)");

  // \text{...} -> plain content
  s = s.replace(/\\text\{([^{}]*)\}/g, "$1");

  // Superscripts / subscripts
  s = s.replace(/\^\{([^{}]*)\}/g, "^($1)");
  s = s.replace(/_\{([^{}]*)\}/g, "_($1)");

  // Common operators/relations/arrows
  s = s
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\mp/g, "∓")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\\equiv/g, "≡")
    .replace(/\\to/g, "→")
    .replace(/\\rightarrow/g, "→")
    .replace(/\\Rightarrow/g, "⇒")
    .replace(/\\in/g, "∈")
    .replace(/\\forall/g, "∀")
    .replace(/\\exists/g, "∃")
    .replace(/\\partial/g, "∂")
    .replace(/\\nabla/g, "∇");

  // Any remaining unknown \command -> strip the backslash, keep the word
  s = s.replace(/\\([A-Za-z]+)/g, "$1");

  // Leftover braces from constructs we didn't specially handle
  s = s.replace(/[{}]/g, "");

  // Collapse extra whitespace left behind by all the substitutions
  s = s.replace(/[ \t]+/g, " ").trim();

  return s;
}
