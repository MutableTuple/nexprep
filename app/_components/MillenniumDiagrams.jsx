// Inline SVG diagrams for each Millennium Prize Problem. All use
// currentColor so they auto-invert between light and dark themes,
// and viewBox-driven sizing so they scale without loading images.
// Alt text via <title>/<desc> for SEO and accessibility.

export default function MillenniumDiagram({ id, className }) {
  const D = DIAGRAMS[id];
  if (!D) return null;
  return (
    <div
      className={
        className ??
        "w-full max-w-[520px] mx-auto text-foreground [&_svg]:w-full [&_svg]:h-auto"
      }
    >
      {D}
    </div>
  );
}

// ─── P vs NP — nested complexity classes ─────────────────────────────
const PVSNP = (
  <svg
    viewBox="0 0 520 340"
    role="img"
    aria-labelledby="pvsnp-title pvsnp-desc"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="pvsnp-title">
      P vs NP — Venn diagram of complexity classes
    </title>
    <desc id="pvsnp-desc">
      Nested regions showing P inside NP, both inside NP-hard's intersection at
      NP-complete, all inside the universe of decision problems.
    </desc>
    {/* Universe */}
    <rect
      x="10"
      y="10"
      width="500"
      height="320"
      rx="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      opacity="0.4"
    />
    <text
      x="20"
      y="30"
      fill="currentColor"
      opacity="0.6"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
    >
      Decision problems
    </text>
    {/* NP */}
    <ellipse
      cx="200"
      cy="180"
      rx="170"
      ry="110"
      fill="hsl(20 91% 48% / 0.10)"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2"
    />
    <text
      x="70"
      y="105"
      fill="hsl(20 91% 48%)"
      fontSize="16"
      fontWeight="700"
      fontFamily="ui-sans-serif, system-ui"
    >
      NP
    </text>
    {/* P */}
    <ellipse
      cx="150"
      cy="200"
      rx="80"
      ry="55"
      fill="currentColor"
      opacity="0.15"
      stroke="currentColor"
      strokeWidth="2"
    />
    <text
      x="130"
      y="205"
      fill="currentColor"
      fontSize="18"
      fontWeight="700"
      fontFamily="ui-sans-serif, system-ui"
    >
      P
    </text>
    {/* NP-hard */}
    <ellipse
      cx="340"
      cy="180"
      rx="160"
      ry="100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.6"
    />
    <text
      x="440"
      y="105"
      fill="currentColor"
      opacity="0.7"
      fontSize="14"
      fontWeight="700"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="end"
    >
      NP-hard
    </text>
    {/* NP-complete = intersection */}
    <text
      x="288"
      y="185"
      fill="currentColor"
      fontSize="11"
      fontWeight="600"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      NP-complete
    </text>
    <text
      x="288"
      y="200"
      fill="currentColor"
      opacity="0.55"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      (SAT, TSP…)
    </text>
    {/* Caption */}
    <text
      x="260"
      y="315"
      fill="currentColor"
      opacity="0.6"
      fontSize="11"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Does P = NP collapse both circles into one?
    </text>
  </svg>
);

// ─── Riemann Hypothesis — critical strip + zeros on Re(s) = 1/2 ─────
const RIEMANN = (
  <svg
    viewBox="0 0 520 340"
    role="img"
    aria-labelledby="riemann-title riemann-desc"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="riemann-title">
      Riemann Hypothesis — non-trivial zeros on the critical line
    </title>
    <desc id="riemann-desc">
      Complex plane with the critical strip 0 &lt; Re(s) &lt; 1 shaded, the
      critical line Re(s) = 1/2 highlighted, and non-trivial zeros marked as
      dots along the line.
    </desc>
    {/* Axes */}
    <line
      x1="40"
      y1="170"
      x2="500"
      y2="170"
      stroke="currentColor"
      opacity="0.4"
      strokeWidth="1"
    />
    <line
      x1="260"
      y1="30"
      x2="260"
      y2="310"
      stroke="currentColor"
      opacity="0.4"
      strokeWidth="1"
    />
    {/* Critical strip */}
    <rect
      x="220"
      y="30"
      width="80"
      height="280"
      fill="hsl(20 91% 48% / 0.08)"
      stroke="hsl(20 91% 48% / 0.4)"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    {/* Critical line Re(s) = 1/2 */}
    <line
      x1="260"
      y1="30"
      x2="260"
      y2="310"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2.5"
    />
    {/* Zeros — schematic heights matching first few Riemann zero imaginary parts */}
    {[70, 92, 118, 140, 168, 195, 218, 245, 268, 295].map((y, i) => (
      <g key={i}>
        <circle
          cx="260"
          cy={y}
          r="4.5"
          fill="hsl(20 91% 48%)"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </g>
    ))}
    {/* Labels */}
    <text
      x="260"
      y="22"
      fill="currentColor"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Im(s)
    </text>
    <text
      x="505"
      y="165"
      fill="currentColor"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="end"
    >
      Re(s)
    </text>
    <text
      x="205"
      y="170"
      fill="currentColor"
      opacity="0.6"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="end"
      dy="12"
    >
      0
    </text>
    <text
      x="315"
      y="170"
      fill="currentColor"
      opacity="0.6"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      dy="12"
    >
      1
    </text>
    <text
      x="260"
      y="325"
      fill="hsl(20 91% 48%)"
      fontSize="11"
      fontWeight="600"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Re(s) = 1/2 · critical line
    </text>
  </svg>
);

// ─── Poincaré — sphere vs torus, loop shrinking test ─────────────────
const POINCARE = (
  <svg
    viewBox="0 0 520 340"
    role="img"
    aria-labelledby="poincare-title poincare-desc"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="poincare-title">
      Poincaré Conjecture — the loop-shrinking test
    </title>
    <desc id="poincare-desc">
      A sphere with a loop that can be shrunk to a point (simply connected),
      next to a torus with a loop through the hole that cannot be shrunk.
    </desc>
    {/* Sphere */}
    <ellipse
      cx="140"
      cy="170"
      rx="90"
      ry="90"
      fill="hsl(20 91% 48% / 0.12)"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2"
    />
    <ellipse
      cx="140"
      cy="170"
      rx="90"
      ry="30"
      fill="none"
      stroke="hsl(20 91% 48%)"
      strokeWidth="1"
      opacity="0.4"
    />
    {/* Loop on sphere — small = "can shrink" */}
    <ellipse
      cx="140"
      cy="130"
      rx="35"
      ry="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="140" cy="130" r="3" fill="currentColor" opacity="0.4" />
    <text
      x="140"
      y="285"
      fill="currentColor"
      fontSize="12"
      fontWeight="600"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Sphere · simply connected
    </text>
    <text
      x="140"
      y="303"
      fill="currentColor"
      opacity="0.6"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Every loop shrinks to a point ✓
    </text>

    {/* Torus */}
    <ellipse
      cx="380"
      cy="170"
      rx="100"
      ry="55"
      fill="hsl(20 91% 48% / 0.12)"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2"
    />
    <path
      d="M 340 158 Q 380 178 420 158"
      fill="none"
      stroke="hsl(20 91% 48%)"
      strokeWidth="1.5"
      opacity="0.7"
    />
    <path
      d="M 350 165 Q 380 152 410 165"
      fill="none"
      stroke="hsl(20 91% 48%)"
      strokeWidth="1.5"
      opacity="0.7"
    />
    {/* Loop through the hole */}
    <ellipse
      cx="380"
      cy="170"
      rx="14"
      ry="55"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="3 3"
    />
    <text
      x="380"
      y="285"
      fill="currentColor"
      fontSize="12"
      fontWeight="600"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Torus · not simply connected
    </text>
    <text
      x="380"
      y="303"
      fill="currentColor"
      opacity="0.6"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Loop through the hole can't shrink ✗
    </text>
  </svg>
);

// ─── Navier–Stokes — velocity field with turbulent spiral ────────────
const NAVIERSTOKES = (
  <svg
    viewBox="0 0 520 340"
    role="img"
    aria-labelledby="ns-title ns-desc"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="ns-title">
      Navier–Stokes — smooth flow developing a vortex
    </title>
    <desc id="ns-desc">
      Grid of velocity arrows in a fluid flow spiraling into a turbulent vortex
      where a singularity might form.
    </desc>
    {/* Container */}
    <rect
      x="20"
      y="20"
      width="480"
      height="300"
      rx="12"
      fill="none"
      stroke="currentColor"
      opacity="0.3"
      strokeWidth="1"
    />
    {/* Arrow marker */}
    <defs>
      <marker
        id="ns-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
      <marker
        id="ns-arrow-accent"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(20 91% 48%)" />
      </marker>
    </defs>
    {/* Velocity field — flowing right */}
    {[60, 100, 140, 180, 220, 260].map((y) =>
      [50, 110, 170, 230, 290].map((x) => (
        <line
          key={`${x}-${y}`}
          x1={x}
          y1={y}
          x2={x + 25}
          y2={y}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.65"
          markerEnd="url(#ns-arrow)"
        />
      )),
    )}
    {/* Vortex spiral (using path) */}
    <path
      d="M 400 160
         m -30 0
         a 30 30 0 1 1 60 0
         a 30 30 0 1 1 -55 5
         a 25 25 0 1 1 48 -10
         a 20 20 0 1 1 -38 8
         a 15 15 0 1 1 28 -4"
      fill="none"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2"
      markerEnd="url(#ns-arrow-accent)"
    />
    <text
      x="400"
      y="230"
      fill="hsl(20 91% 48%)"
      fontSize="11"
      fontWeight="600"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Turbulent vortex
    </text>
    <text
      x="400"
      y="245"
      fill="currentColor"
      opacity="0.6"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      does a singularity form?
    </text>
    <text
      x="260"
      y="305"
      fill="currentColor"
      opacity="0.55"
      fontSize="11"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Velocity field in an incompressible fluid
    </text>
  </svg>
);

// ─── Hodge — cohomology decomposition grid ───────────────────────────
const HODGE = (
  <svg
    viewBox="0 0 520 340"
    role="img"
    aria-labelledby="hodge-title hodge-desc"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="hodge-title">
      Hodge Conjecture — decomposition of cohomology into (p,q) pieces
    </title>
    <desc id="hodge-desc">
      Triangular grid of Hodge numbers, with a highlighted diagonal indicating
      the (p,p) classes that the conjecture predicts come from algebraic cycles.
    </desc>
    {/* Axes */}
    <line
      x1="80"
      y1="280"
      x2="440"
      y2="280"
      stroke="currentColor"
      opacity="0.4"
      strokeWidth="1"
    />
    <line
      x1="80"
      y1="280"
      x2="80"
      y2="60"
      stroke="currentColor"
      opacity="0.4"
      strokeWidth="1"
    />
    <text
      x="450"
      y="285"
      fill="currentColor"
      opacity="0.6"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
    >
      p
    </text>
    <text
      x="72"
      y="55"
      fill="currentColor"
      opacity="0.6"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="end"
    >
      q
    </text>
    {/* Grid of (p,q) points — 5x5 */}
    {Array.from({ length: 5 }).map((_, p) =>
      Array.from({ length: 5 }).map((__, q) => {
        const cx = 100 + p * 60;
        const cy = 260 - q * 45;
        const onDiagonal = p === q;
        return (
          <g key={`${p}-${q}`}>
            <circle
              cx={cx}
              cy={cy}
              r={onDiagonal ? 8 : 5}
              fill={onDiagonal ? "hsl(20 91% 48%)" : "currentColor"}
              opacity={onDiagonal ? 1 : 0.4}
            />
            <text
              x={cx}
              y={cy + (onDiagonal ? -14 : 20)}
              fill="currentColor"
              opacity={onDiagonal ? 0.9 : 0.5}
              fontSize="10"
              fontFamily="ui-serif, Georgia"
              textAnchor="middle"
            >
              ({p},{q})
            </text>
          </g>
        );
      }),
    )}
    {/* Highlight diagonal */}
    <line
      x1="100"
      y1="260"
      x2="340"
      y2="80"
      stroke="hsl(20 91% 48%)"
      strokeWidth="1.5"
      opacity="0.6"
      strokeDasharray="4 4"
    />
    <text
      x="260"
      y="40"
      fill="hsl(20 91% 48%)"
      fontSize="11"
      fontWeight="600"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Hodge classes: (p,p) diagonal ← ought to come from algebraic cycles
    </text>
    <text
      x="260"
      y="315"
      fill="currentColor"
      opacity="0.55"
      fontSize="11"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Hodge decomposition Hⁿ = ⊕ Hᵖʴᵍ
    </text>
  </svg>
);

// ─── Birch–Swinnerton-Dyer — elliptic curve with rational points ─────
const BSD = (
  <svg
    viewBox="0 0 520 340"
    role="img"
    aria-labelledby="bsd-title bsd-desc"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="bsd-title">
      Birch–Swinnerton-Dyer — an elliptic curve with rational points
    </title>
    <desc id="bsd-desc">
      Plot of an elliptic curve y-squared equals x-cubed minus x, with several
      rational points marked. The rank counts independent infinite-order points.
    </desc>
    {/* Axes */}
    <line
      x1="30"
      y1="170"
      x2="490"
      y2="170"
      stroke="currentColor"
      opacity="0.4"
      strokeWidth="1"
    />
    <line
      x1="260"
      y1="30"
      x2="260"
      y2="310"
      stroke="currentColor"
      opacity="0.4"
      strokeWidth="1"
    />
    <text
      x="495"
      y="165"
      fill="currentColor"
      opacity="0.6"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="end"
    >
      x
    </text>
    <text
      x="252"
      y="22"
      fill="currentColor"
      opacity="0.6"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="end"
    >
      y
    </text>
    {/* Curve y² = x³ - x — two components:
        * an "oval" between x = -1 and x = 0
        * an unbounded branch for x >= 1 */}
    <path
      d="M 210 170 Q 210 130 235 130 Q 260 130 260 170 Q 260 210 235 210 Q 210 210 210 170 Z"
      fill="none"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2.5"
    />
    <path
      d="M 285 170
         C 300 120, 380 60, 470 40
         M 285 170
         C 300 220, 380 280, 470 300"
      fill="none"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2.5"
    />
    {/* Rational points (schematic) */}
    {[
      { x: 210, y: 170, label: "(-1, 0)" },
      { x: 260, y: 170, label: "(0, 0)" },
      { x: 285, y: 170, label: "(1, 0)" },
      { x: 335, y: 125, label: "P" },
      { x: 385, y: 105, label: "2P" },
    ].map((pt) => (
      <g key={pt.label}>
        <circle
          cx={pt.x}
          cy={pt.y}
          r="5"
          fill="currentColor"
          stroke="hsl(20 91% 48%)"
          strokeWidth="1.5"
        />
        <text
          x={pt.x + 10}
          y={pt.y - 8}
          fill="currentColor"
          fontSize="10"
          fontFamily="ui-serif, Georgia"
        >
          {pt.label}
        </text>
      </g>
    ))}
    <text
      x="260"
      y="325"
      fill="currentColor"
      opacity="0.6"
      fontSize="11"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      y² = x³ − x · rank = order of vanishing of L(E, s) at s = 1
    </text>
  </svg>
);

// ─── Yang–Mills — energy spectrum with mass gap ──────────────────────
const YANGMILLS = (
  <svg
    viewBox="0 0 520 340"
    role="img"
    aria-labelledby="ym-title ym-desc"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="ym-title">
      Yang–Mills mass gap — energy spectrum with a positive lower bound above
      vacuum
    </title>
    <desc id="ym-desc">
      Horizontal energy axis showing a vacuum state at zero and a gap of size
      Delta before the next allowed excitation energy.
    </desc>
    {/* Energy axis */}
    <line
      x1="60"
      y1="200"
      x2="480"
      y2="200"
      stroke="currentColor"
      opacity="0.6"
      strokeWidth="1.5"
    />
    <text
      x="485"
      y="205"
      fill="currentColor"
      opacity="0.7"
      fontSize="12"
      fontFamily="ui-sans-serif, system-ui"
    >
      E
    </text>
    {/* Vacuum */}
    <line
      x1="90"
      y1="180"
      x2="90"
      y2="220"
      stroke="currentColor"
      strokeWidth="3"
    />
    <text
      x="90"
      y="240"
      fill="currentColor"
      fontSize="11"
      fontWeight="600"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Vacuum
    </text>
    <text
      x="90"
      y="255"
      fill="currentColor"
      opacity="0.6"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      E = 0
    </text>

    {/* Mass gap */}
    <line
      x1="90"
      y1="140"
      x2="230"
      y2="140"
      stroke="hsl(20 91% 48%)"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <text
      x="160"
      y="128"
      fill="hsl(20 91% 48%)"
      fontSize="14"
      fontWeight="700"
      fontFamily="ui-serif, Georgia"
      textAnchor="middle"
    >
      Δ &gt; 0
    </text>
    <text
      x="160"
      y="112"
      fill="hsl(20 91% 48%)"
      fontSize="10"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      mass gap
    </text>

    {/* Excited states */}
    {[
      { x: 230, label: "m", h: 3 },
      { x: 280, label: "", h: 3 },
      { x: 320, label: "2m", h: 3 },
      { x: 360, label: "", h: 3 },
      { x: 400, label: "", h: 3 },
    ].map((s) => (
      <g key={s.x}>
        <line
          x1={s.x}
          y1="180"
          x2={s.x}
          y2="220"
          stroke="currentColor"
          strokeWidth={s.h}
        />
        {s.label && (
          <text
            x={s.x}
            y="240"
            fill="currentColor"
            opacity="0.7"
            fontSize="10"
            fontFamily="ui-serif, Georgia"
            textAnchor="middle"
          >
            {s.label}
          </text>
        )}
      </g>
    ))}
    <text
      x="330"
      y="270"
      fill="currentColor"
      opacity="0.6"
      fontSize="11"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Discrete excitations start at energy m &gt; 0
    </text>
    <text
      x="260"
      y="305"
      fill="currentColor"
      opacity="0.55"
      fontSize="11"
      fontFamily="ui-sans-serif, system-ui"
      textAnchor="middle"
    >
      Yang–Mills predicts a positive gap Δ — no massless excitations
    </text>
  </svg>
);

const DIAGRAMS = {
  pvsnp: PVSNP,
  riemann: RIEMANN,
  poincare: POINCARE,
  navierstokes: NAVIERSTOKES,
  hodge: HODGE,
  bsd: BSD,
  yangmills: YANGMILLS,
};
