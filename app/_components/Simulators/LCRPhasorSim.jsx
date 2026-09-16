"use client";

import { useMemo, useState } from "react";
import MarkdownRenderer from "../MarkdownRenderer";

// Series LCR — two panels stacked:
//   1. Circuit schematic — AC source → R (zigzag) → L (coils) → C (plates)
//      All drawn in one SVG so it scales with the modal.
//   2. Phasor diagram — V_R along +x, V_L up, V_C down, resultant + φ.
//
// Physics (per unit current):
//   V_R = R,   V_L = X_L,   V_C = X_C
//   |V| = √(R² + (X_L - X_C)²)
//   tan φ = (X_L - X_C)/R,   cos φ = R/|V| = power factor.

export default function LCRPhasorSim({ R = 100, XL = 100, XC = 100 }) {
  const [r, setR] = useState(R);
  const [xl, setXL] = useState(XL);
  const [xc, setXC] = useState(XC);

  const derived = useMemo(() => {
    const net = xl - xc;
    const Z = Math.hypot(r, net);
    const phi = Math.atan2(net, r);
    const cosPhi = Z > 0 ? r / Z : 1;
    return { Z, phi, phiDeg: (phi * 180) / Math.PI, cosPhi, net };
  }, [r, xl, xc]);

  return (
    <div className="w-full flex flex-col gap-4">
      <CircuitSchematic R={r} XL={xl} XC={xc} />
      <PhasorDiagram R={r} XL={xl} XC={xc} derived={derived} />

      {/* Sliders */}
      <div className="grid grid-cols-3 gap-3 text-[11px]">
        <MiniSlider label="R (Ω)" value={r} min={0} max={300} onChange={setR} />
        <MiniSlider
          label="X_L (Ω)"
          value={xl}
          min={0}
          max={300}
          onChange={setXL}
        />
        <MiniSlider
          label="X_C (Ω)"
          value={xc}
          min={0}
          max={300}
          onChange={setXC}
        />
      </div>

      {/* Live readout strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
        <Chip label="Impedance |Z|" value={`${derived.Z.toFixed(2)} Ω`} />
        <Chip label="Phase φ" value={`${derived.phiDeg.toFixed(2)}°`} />
        <Chip
          label="cos φ (power factor)"
          value={derived.cosPhi.toFixed(3)}
          highlight
        />
        <Chip
          label="Regime"
          value={
            Math.abs(derived.net) < 0.5
              ? "Resonance"
              : derived.net > 0
                ? "Inductive"
                : "Capacitive"
          }
        />
      </div>

      {/* Formulas — general form, then live substitution with the current
          slider values so the student can trace the arithmetic. */}
      <FormulasPanel R={r} XL={xl} XC={xc} derived={derived} />
    </div>
  );
}

function FormulasPanel({ R, XL, XC, derived }) {
  const netSigned = XL - XC;
  // Format small helper so negative values still bracket properly in LaTeX.
  const n = (x) => (x < 0 ? `(${x})` : `${x}`);

  const rows = [
    {
      title: "Impedance",
      general: "Z = \\sqrt{R^{2} + (X_L - X_C)^{2}}",
      substituted: `Z = \\sqrt{${R}^{2} + (${XL} - ${XC})^{2}} = \\sqrt{${R * R + netSigned * netSigned}} = ${derived.Z.toFixed(2)}\\ \\Omega`,
    },
    {
      title: "Phase angle",
      general: "\\tan\\varphi = \\dfrac{X_L - X_C}{R}",
      substituted: `\\tan\\varphi = \\dfrac{${XL} - ${XC}}{${R}} = ${(netSigned / (R || 1)).toFixed(3)} \\;\\Rightarrow\\; \\varphi = ${derived.phiDeg.toFixed(2)}^{\\circ}`,
    },
    {
      title: "Power factor",
      general: "\\cos\\varphi = \\dfrac{R}{Z}",
      substituted: `\\cos\\varphi = \\dfrac{${R}}{${derived.Z.toFixed(2)}} = ${derived.cosPhi.toFixed(3)}`,
    },
    {
      title: "Resonance condition",
      general: "X_L = X_C \\;\\Rightarrow\\; \\omega = \\dfrac{1}{\\sqrt{LC}}",
      substituted:
        Math.abs(netSigned) < 0.5
          ? `X_L = X_C = ${XL}\\ \\Omega \\;\\Rightarrow\\; \\text{at resonance},\\ Z = R,\\ \\cos\\varphi = 1`
          : `X_L - X_C = ${n(netSigned)}\\ \\Omega \\;\\neq\\; 0 \\;\\Rightarrow\\; \\text{not at resonance}`,
    },
    {
      title: "Instantaneous voltages (per unit current)",
      general: "V_R = IR,\\ \\ V_L = IX_L,\\ \\ V_C = IX_C",
      substituted: `V_R : V_L : V_C = ${R} : ${XL} : ${XC}`,
    },
    {
      title: "Average power",
      general: "P_{avg} = V_{rms}\\,I_{rms}\\,\\cos\\varphi",
      substituted: `P_{avg} \\propto \\cos\\varphi = ${derived.cosPhi.toFixed(3)}`,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Formulas & live substitution
        </h4>
        <span className="text-[10px] text-muted-foreground">
          updates with sliders
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-muted/30 p-3 flex flex-col gap-1.5"
          >
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {row.title}
            </div>
            <div className="text-sm [&_p]:!my-0 [&_.katex]:text-[15px]">
              <MarkdownRenderer>{`$$${row.general}$$`}</MarkdownRenderer>
            </div>
            <div className="text-[13px] text-foreground/80 border-t border-border/50 pt-1.5 [&_p]:!my-0 [&_.katex]:text-[13px]">
              <MarkdownRenderer>{`$$${row.substituted}$$`}</MarkdownRenderer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircuitSchematic({ R, XL, XC }) {
  // Layout: rectangular loop, AC source on the left, three components
  // arranged along the top wire in the order R → L → C. Labels below.
  return (
    <svg
      viewBox="0 0 500 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-h-[220px] text-foreground"
    >
      {/* Outer loop wires */}
      <g stroke="currentColor" strokeWidth="1.8" fill="none">
        {/* left wire (source out) */}
        <line x1="60" y1="60" x2="60" y2="160" />
        {/* top wire — will be broken by components */}
        <line x1="60" y1="60" x2="110" y2="60" />
        <line x1="170" y1="60" x2="220" y2="60" />
        <line x1="280" y1="60" x2="330" y2="60" />
        <line x1="390" y1="60" x2="440" y2="60" />
        {/* right wire */}
        <line x1="440" y1="60" x2="440" y2="160" />
        {/* bottom wire */}
        <line x1="60" y1="160" x2="440" y2="160" />
      </g>

      {/* AC source — circle with sine wave */}
      <g stroke="currentColor" strokeWidth="1.8" fill="none">
        <circle cx="60" cy="110" r="18" />
        <path d="M 48 110 Q 54 100, 60 110 T 72 110" />
      </g>
      <text
        x="60"
        y="150"
        textAnchor="middle"
        fontSize="11"
        fill="currentColor"
        opacity="0.7"
      >
        AC
      </text>

      {/* Resistor R — zigzag */}
      <g stroke="#16a34a" strokeWidth="2.2" fill="none">
        <polyline points="110,60 118,50 128,70 138,50 148,70 158,50 165,60 170,60" />
      </g>
      <text
        x="140"
        y="42"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#16a34a"
      >
        R
      </text>
      <text
        x="140"
        y="82"
        textAnchor="middle"
        fontSize="10"
        fontStyle="italic"
        fill="#16a34a"
      >
        {R} Ω
      </text>

      {/* Inductor L — three humps */}
      <g stroke="#dc2626" strokeWidth="2.2" fill="none">
        <path d="M 220 60 Q 230 42, 240 60 Q 250 42, 260 60 Q 270 42, 280 60" />
      </g>
      <text
        x="250"
        y="34"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#dc2626"
      >
        L
      </text>
      <text
        x="250"
        y="82"
        textAnchor="middle"
        fontSize="10"
        fontStyle="italic"
        fill="#dc2626"
      >
        X_L = {XL} Ω
      </text>

      {/* Capacitor C — two parallel plates */}
      <g stroke="#2563eb" strokeWidth="2.2" fill="none">
        <line x1="330" y1="60" x2="352" y2="60" />
        <line x1="352" y1="45" x2="352" y2="75" />
        <line x1="368" y1="45" x2="368" y2="75" />
        <line x1="368" y1="60" x2="390" y2="60" />
      </g>
      <text
        x="360"
        y="34"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#2563eb"
      >
        C
      </text>
      <text
        x="360"
        y="82"
        textAnchor="middle"
        fontSize="10"
        fontStyle="italic"
        fill="#2563eb"
      >
        X_C = {XC} Ω
      </text>

      {/* Current direction arrow (bottom wire) */}
      <g fill="currentColor" opacity="0.55">
        <polygon points="240,155 250,160 240,165" />
        <text x="255" y="164" fontSize="10">
          I
        </text>
      </g>
    </svg>
  );
}

function PhasorDiagram({ R, XL, XC, derived }) {
  const maxMag = Math.max(R, XL, XC, derived.Z, 1);
  const scale = 90 / maxMag;
  const OX = 200;
  const OY = 130;

  const pR = { x: OX + R * scale, y: OY };
  const pL = { x: OX, y: OY - XL * scale };
  const pC = { x: OX, y: OY + XC * scale };
  const pNet = { x: OX + R * scale, y: OY - derived.net * scale };

  return (
    <svg
      viewBox="0 0 500 260"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-h-[260px] text-foreground"
    >
      <defs>
        <marker
          id="arrow-lcr"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>

      {/* Axes */}
      <line
        x1="30"
        y1={OY}
        x2="470"
        y2={OY}
        stroke="currentColor"
        strokeOpacity="0.25"
      />
      <line
        x1={OX}
        y1="20"
        x2={OX}
        y2="240"
        stroke="currentColor"
        strokeOpacity="0.25"
      />
      <text
        x="466"
        y={OY - 6}
        textAnchor="end"
        fontSize="10"
        fill="currentColor"
        opacity="0.55"
      >
        I (reference)
      </text>

      {/* V_R */}
      <line
        x1={OX}
        y1={OY}
        x2={pR.x}
        y2={pR.y}
        stroke="#16a34a"
        strokeWidth="2.5"
        markerEnd="url(#arrow-lcr)"
        style={{ color: "#16a34a" }}
      />
      <text
        x={pR.x + 4}
        y={OY + 14}
        fontSize="12"
        fontStyle="italic"
        fill="#16a34a"
      >
        V_R
      </text>

      {/* V_L */}
      <line
        x1={OX}
        y1={OY}
        x2={pL.x}
        y2={pL.y}
        stroke="#dc2626"
        strokeWidth="2.5"
        markerEnd="url(#arrow-lcr)"
        style={{ color: "#dc2626" }}
      />
      <text
        x={pL.x + 6}
        y={pL.y + 4}
        fontSize="12"
        fontStyle="italic"
        fill="#dc2626"
      >
        V_L
      </text>

      {/* V_C */}
      <line
        x1={OX}
        y1={OY}
        x2={pC.x}
        y2={pC.y}
        stroke="#2563eb"
        strokeWidth="2.5"
        markerEnd="url(#arrow-lcr)"
        style={{ color: "#2563eb" }}
      />
      <text
        x={pC.x + 6}
        y={pC.y - 4}
        fontSize="12"
        fontStyle="italic"
        fill="#2563eb"
      >
        V_C
      </text>

      {/* Resultant */}
      <line
        x1={OX}
        y1={OY}
        x2={pNet.x}
        y2={pNet.y}
        stroke="#ea580c"
        strokeWidth="3"
        markerEnd="url(#arrow-lcr)"
        style={{ color: "#ea580c" }}
      />
      <text
        x={pNet.x + 6}
        y={pNet.y - 6}
        fontSize="13"
        fontWeight="bold"
        fontStyle="italic"
        fill="#ea580c"
      >
        V
      </text>

      {/* Phase arc */}
      {Math.abs(derived.phi) > 0.02 && (
        <path
          d={`M ${OX + 30} ${OY} A 30 30 0 0 ${derived.phi > 0 ? 0 : 1} ${OX + 30 * Math.cos(-derived.phi)} ${OY + 30 * Math.sin(-derived.phi)}`}
          fill="none"
          stroke="#ea580c"
          strokeWidth="1.5"
          opacity="0.75"
        />
      )}
    </svg>
  );
}

function MiniSlider({ label, value, min, max, onChange }) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="flex items-center justify-between text-[9.5px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono normal-case tracking-normal text-foreground">
          {value}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
    </label>
  );
}

function Chip({ label, value, highlight = false }) {
  return (
    <div
      className={
        "rounded-lg px-3 py-2 flex flex-col gap-0.5 min-w-0 " +
        (highlight
          ? "bg-[hsl(20,91%,48%)]/10 text-[hsl(20,91%,45%)]"
          : "bg-muted/50")
      }
    >
      <span className="text-[9.5px] uppercase tracking-widest opacity-70 truncate">
        {label}
      </span>
      <b className="truncate">{value}</b>
    </div>
  );
}
