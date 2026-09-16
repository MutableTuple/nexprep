"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Eraser } from "lucide-react";

// Atwood machine — two masses on either end of a light rope over a
// frictionless pulley. Classic constraint problem.
//
//   a = (m2 - m1)g / (m1 + m2)      (positive → m2 goes down)
//   T = 2 m1 m2 g / (m1 + m2)
//
// Motion is deterministic given (m1, m2, g, elapsed) — no ODE needed.
// We just clamp the vertical travel so the animation loops instead of
// running off the canvas.

const G = 9.81;

export default function PulleySim() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);

  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(3);
  const [playing, setPlaying] = useState(true);
  const [showFBD, setShowFBD] = useState(true);

  const [annotations, setAnnotations] = useState([]);
  const [pendingAnn, setPendingAnn] = useState(null);

  const total = m1 + m2;
  const accel = ((m2 - m1) * G) / total; // + means m2 falls
  const tension = (2 * m1 * m2 * G) / total;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = rect.width;
    const H = rect.height;

    // Geometry — pulley near the top, rope drops on either side.
    const pulley = { x: W / 2, y: 60, r: 26 };
    const gap = 90; // horizontal offset from pulley center to each hanging rope
    const leftX = pulley.x - gap;
    const rightX = pulley.x + gap;
    const ceiling = 10;

    // Vertical travel range for the animation. The heavier side falls,
    // so we let it fall by this much before looping.
    const travel = 90;

    const drawArrow = (x0, y0, x1, y1, color, thickness = 2, headSize = 8) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      const ang = Math.atan2(y1 - y0, x1 - x0);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(
        x1 - headSize * Math.cos(ang - 0.4),
        y1 - headSize * Math.sin(ang - 0.4),
      );
      ctx.lineTo(
        x1 - headSize * Math.cos(ang + 0.4),
        y1 - headSize * Math.sin(ang + 0.4),
      );
      ctx.closePath();
      ctx.fill();
    };

    const label = (x, y, text, color) => {
      ctx.font = "italic bold 12px ui-serif, Georgia, serif";
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x, y);
    };

    const drawFrame = (elapsed) => {
      ctx.clearRect(0, 0, W, H);

      // Ceiling
      ctx.strokeStyle = "hsl(210, 15%, 60%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pulley.x - 80, ceiling);
      ctx.lineTo(pulley.x + 80, ceiling);
      ctx.stroke();
      for (let x = pulley.x - 76; x < pulley.x + 80; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, ceiling);
        ctx.lineTo(x - 6, ceiling - 8);
        ctx.stroke();
      }
      // Ceiling → pulley axle
      ctx.beginPath();
      ctx.moveTo(pulley.x, ceiling);
      ctx.lineTo(pulley.x, pulley.y - pulley.r - 2);
      ctx.stroke();

      // Vertical positions of the two masses. m1 rises when a>0, m2 falls.
      // We use a triangle-wave over elapsed time so the animation loops
      // cleanly without physics blow-up.
      const period = 3; // seconds one direction
      const phase = ((elapsed % (period * 2)) - period) / period; // -1..1
      const disp =
        accel === 0 ? 0 : Math.sign(accel) * travel * (1 - Math.abs(phase));
      // + disp: right mass down; left mass up.
      const rightMassY = 220 + disp;
      const leftMassY = 220 - disp;

      // Rope on both sides
      ctx.strokeStyle = "hsl(30, 25%, 30%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftX, pulley.y);
      ctx.lineTo(leftX, leftMassY);
      ctx.moveTo(rightX, pulley.y);
      ctx.lineTo(rightX, rightMassY);
      ctx.stroke();
      // Rope arc over the pulley
      ctx.beginPath();
      ctx.arc(pulley.x, pulley.y, pulley.r + 2, Math.PI, 0);
      ctx.stroke();

      // Pulley wheel
      ctx.fillStyle = "hsl(210, 15%, 88%)";
      ctx.strokeStyle = "hsl(210, 20%, 50%)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pulley.x, pulley.y, pulley.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Axle
      ctx.fillStyle = "hsl(210, 15%, 40%)";
      ctx.beginPath();
      ctx.arc(pulley.x, pulley.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw a mass box
      const drawMass = (cx, cy, m, tag, colorHue) => {
        // Size scales gently with mass so a 10 kg block looks heavier
        // than a 1 kg one without dominating the canvas.
        const size = 30 + Math.min(28, m * 2.2);
        ctx.fillStyle = `hsl(${colorHue}, 91%, 48%)`;
        ctx.strokeStyle = `hsla(${colorHue}, 91%, 25%, 0.5)`;
        ctx.lineWidth = 1;
        ctx.fillRect(cx - size / 2, cy, size, size);
        ctx.strokeRect(cx - size / 2, cy, size, size);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${m} kg`, cx, cy + size / 2 - 6);
        ctx.font = "10px ui-sans-serif, system-ui";
        ctx.fillText(tag, cx, cy + size / 2 + 8);
        return size;
      };
      const s1 = drawMass(leftX, leftMassY, m1, "m₁", 200);
      const s2 = drawMass(rightX, rightMassY, m2, "m₂", 20);

      if (showFBD) {
        // Force reference scale — normalize by the heavier weight so the
        // longest arrow doesn't shoot off the canvas.
        const refF = Math.max(m1 * G, m2 * G);
        const refLen = 70;
        const forceArrow = (cx, cy, dx, dy, Fmag, color, txt) => {
          const len = (Fmag / refF) * refLen;
          if (len < 4) return;
          drawArrow(cx, cy, cx + dx * len, cy + dy * len, color, 2.5);
          label(cx + dx * len + 6, cy + dy * len, txt, color);
        };

        // Left mass (m1) FBD — origin is top-center of the block
        const l1cx = leftX;
        const l1cy = leftMassY;
        // Tension up
        forceArrow(l1cx, l1cy, 0, -1, tension, "hsl(150, 65%, 40%)", "T");
        // Weight down from the block's bottom
        forceArrow(
          l1cx,
          l1cy + s1,
          0,
          1,
          m1 * G,
          "hsl(0, 74%, 51%)",
          "m₁g",
        );

        // Right mass (m2)
        const r2cx = rightX;
        const r2cy = rightMassY;
        forceArrow(r2cx, r2cy, 0, -1, tension, "hsl(150, 65%, 40%)", "T");
        forceArrow(
          r2cx,
          r2cy + s2,
          0,
          1,
          m2 * G,
          "hsl(0, 74%, 51%)",
          "m₂g",
        );

        // Acceleration arrow — orange, on the heavier side pointing down,
        // lighter side pointing up.
        if (Math.abs(accel) > 1e-4) {
          const accColor = "hsl(35, 95%, 45%)";
          const aLen = 20 + Math.min(50, Math.abs(accel) * 4);
          ctx.setLineDash([5, 3]);
          const dir = accel > 0 ? 1 : -1;
          // right mass
          drawArrow(
            r2cx + s2 / 2 + 22,
            r2cy + s2 / 2,
            r2cx + s2 / 2 + 22,
            r2cy + s2 / 2 + dir * aLen,
            accColor,
            2,
          );
          label(
            r2cx + s2 / 2 + 26,
            r2cy + s2 / 2 + (dir * aLen) / 2,
            "a",
            accColor,
          );
          // left mass — opposite direction
          drawArrow(
            l1cx - s1 / 2 - 22,
            l1cy + s1 / 2,
            l1cx - s1 / 2 - 22,
            l1cy + s1 / 2 - dir * aLen,
            accColor,
            2,
          );
          label(
            l1cx - s1 / 2 - 34,
            l1cy + s1 / 2 - (dir * aLen) / 2,
            "a",
            accColor,
          );
          ctx.setLineDash([]);
        }
      }

      // User annotations
      const drawAnn = (a, alpha = 1) => {
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "hsl(50, 95%, 50%)";
        ctx.fillStyle = "hsl(50, 95%, 50%)";
        const dxA = a.end.x - a.start.x;
        const dyA = a.end.y - a.start.y;
        if (Math.hypot(dxA, dyA) < 6) {
          ctx.beginPath();
          ctx.arc(a.start.x, a.start.y, 8, 0, Math.PI * 2);
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          drawArrow(a.start.x, a.start.y, a.end.x, a.end.y, "hsl(50, 95%, 50%)", 3, 10);
        }
        ctx.globalAlpha = 1;
      };
      annotations.forEach((a) => drawAnn(a, 1));
      if (pendingAnn) drawAnn(pendingAnn, 0.55);
    };

    const loop = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      drawFrame(elapsed);
      rafRef.current = requestAnimationFrame(loop);
    };
    if (playing) {
      startTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    } else {
      drawFrame(0);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, showFBD, m1, m2, accel, tension, annotations, pendingAnn]);

  function reset() {
    startTimeRef.current = 0;
    setPlaying(true);
  }

  const canvasCoord = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onPointerDown = (e) => {
    if (e.button !== 2) return;
    e.preventDefault();
    const p = canvasCoord(e);
    setPendingAnn({ start: p, end: p });
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!pendingAnn) return;
    const p = canvasCoord(e);
    setPendingAnn((prev) => (prev ? { ...prev, end: p } : prev));
  };
  const onPointerUp = (e) => {
    if (!pendingAnn) return;
    setAnnotations((prev) => [...prev, pendingAnn]);
    setPendingAnn(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-2xl border border-border bg-muted/25 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none select-none"
          style={{ height: "min(65vh, 440px)" }}
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Atwood machine pulley simulation"
        />

        {showFBD && (
          <div className="absolute top-3 right-3 rounded-xl bg-background/90 backdrop-blur px-3 py-2 text-[11px] leading-relaxed shadow-sm space-y-1">
            <Legend color="hsl(150, 65%, 40%)" label="T (tension)" />
            <Legend color="hsl(0, 74%, 51%)" label="mg (weight)" />
            <Legend color="hsl(35, 95%, 45%)" label="a (accel)" />
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => setAnnotations([])}
            className="h-9 w-9 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-background"
            title="Clear drawings"
          >
            <Eraser size={14} />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="h-9 w-9 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-background"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={reset}
            className="h-9 w-9 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-background"
            aria-label="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 text-[10.5px] text-muted-foreground bg-background/75 backdrop-blur px-2 py-1 rounded-md">
          Right-click drag = draw arrow · single-click = mark
        </div>
      </div>

      {/* Live physics strip below the canvas — keeps the pulley visible. */}
      <div className="rounded-2xl border border-border bg-background p-4 grid grid-cols-3 sm:grid-cols-5 gap-3 text-[11px] font-mono">
        <Chip label="m₁" value={`${m1.toFixed(2)} kg`} />
        <Chip label="m₂" value={`${m2.toFixed(2)} kg`} />
        <Chip label="m₁g" value={`${(m1 * G).toFixed(2)} N`} />
        <Chip label="m₂g" value={`${(m2 * G).toFixed(2)} N`} />
        <Chip label="Tension T" value={`${tension.toFixed(2)} N`} />
        <Chip label="|a|" value={`${Math.abs(accel).toFixed(2)} m/s²`} />
        <div
          className={
            "col-span-3 sm:col-span-4 rounded-lg px-3 py-2 text-[11px] font-semibold flex items-center justify-center text-center " +
            (Math.abs(accel) < 0.01
              ? "bg-muted text-muted-foreground"
              : "bg-[hsl(20,91%,48%)]/10 text-[hsl(20,91%,40%)]")
          }
        >
          {accel > 0.01
            ? "m₂ accelerates down · m₁ rises"
            : accel < -0.01
              ? "m₁ accelerates down · m₂ rises"
              : "Balanced — no motion"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border bg-background p-5">
        <Slider label="Mass m₁ (left)" value={m1} unit="kg" min={0.5} max={20} step={0.5} onChange={setM1} />
        <Slider label="Mass m₂ (right)" value={m2} unit="kg" min={0.5} max={20} step={0.5} onChange={setM2} />

        <div className="col-span-full flex flex-wrap items-center gap-4 pt-1">
          <button
            type="button"
            onClick={() => setShowFBD((v) => !v)}
            className={
              showFBD
                ? "inline-flex items-center gap-2 rounded-full bg-[hsl(0,74%,51%)] text-white px-3 py-1.5 text-xs font-semibold"
                : "inline-flex items-center gap-2 rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold"
            }
            aria-pressed={showFBD}
          >
            {showFBD ? "Hide FBD" : "Show FBD"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2 flex flex-col gap-0.5 min-w-0">
      <span className="text-[9.5px] uppercase tracking-widest text-muted-foreground truncate">
        {label}
      </span>
      <b className="text-foreground truncate">{value}</b>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2 font-mono">
      <span
        className="inline-block h-[3px] w-5 align-middle"
        style={{ background: color }}
      />
      {label}
    </div>
  );
}

function Slider({ label, value, unit, min, max, step, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono normal-case tracking-normal text-foreground">
          {value}
          {unit}
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
