"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Eraser } from "lucide-react";

// Block on an inclined plane. All physics done in world coordinates
// with the incline's foot at the origin and gravity pointing in -y.
// Coordinate mapping to canvas happens at draw time only.
//
// Motion regime:
//   If tan θ ≤ μ_s → block stays put, a = 0, static friction balances mg sinθ.
//   Else → block slides, a = g(sinθ - μ_k cosθ) along the incline (down).
//
// We integrate distance s along the incline with a simple s = ½ a t²
// (starts from rest, kinetic friction is constant), which is exact
// for this problem — no need for an ODE.

const G = 9.81;

export default function WedgeSim() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);

  const [angleDeg, setAngleDeg] = useState(30);
  const [mass, setMass] = useState(2);
  const [muS, setMuS] = useState(0.2);
  const [muK, setMuK] = useState(0.15);

  const [playing, setPlaying] = useState(true);
  const [showFBD, setShowFBD] = useState(true);

  const [annotations, setAnnotations] = useState([]);
  const [pendingAnn, setPendingAnn] = useState(null);

  const theta = (angleDeg * Math.PI) / 180;
  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);

  // Physics — kept as raw scalars in world units.
  const weight = mass * G;
  const N = weight * cosT;
  const gravAlong = weight * sinT; // pulling block down the incline
  const willSlide = Math.tan(theta) > muS + 1e-9;
  const kineticFriction = willSlide ? muK * N : 0;
  // static friction only balances gravity component up to μ_s N
  const staticFriction = willSlide
    ? 0
    : Math.min(gravAlong, muS * N);
  const accel = willSlide ? G * (sinT - muK * cosT) : 0;

  const sAt = useCallback(
    (t) => Math.max(0, 0.5 * accel * t * t),
    [accel],
  );

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

    // Wedge geometry — the incline runs from foot (bottom-right) up to
    // the apex (top-left) at angle θ. Length is picked to fit the canvas.
    const pad = 30;
    const rise = H - 2 * pad;
    const run = rise / Math.tan(theta);
    const availableRun = W - 2 * pad;
    const scale = run > availableRun ? availableRun / run : 1;
    const rise2 = rise * scale;
    const run2 = run * scale;
    const foot = { x: pad + run2, y: H - pad }; // ground contact right
    const apex = { x: pad, y: H - pad - rise2 }; // top of incline left
    const inclineLen = Math.hypot(run2, rise2);

    // Unit vectors — along the incline (from foot toward apex, i.e. up the ramp)
    // and perpendicular (outward normal, into the block).
    const upIncX = (apex.x - foot.x) / inclineLen;
    const upIncY = (apex.y - foot.y) / inclineLen;
    const outNormX = -upIncY; // rotate 90° CCW
    const outNormY = upIncX;

    // Block starts at the apex (top of the incline), slides down toward foot.
    const s = Math.min(sAt(0), 1); // placeholder — filled per frame
    void s;

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

    // World-length distance the block has travelled → pixel offset
    // along the incline. We're using canvas pixels ≈ meters × pxPerM.
    const pxPerM = inclineLen / 5; // treat incline as 5 m long
    const maxSliding = inclineLen - 30; // stop when block reaches foot

    const drawFrame = (elapsed) => {
      ctx.clearRect(0, 0, W, H);

      // Wedge
      ctx.fillStyle = "hsl(210, 15%, 88%)";
      ctx.strokeStyle = "hsl(210, 20%, 55%)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(foot.x, foot.y);
      ctx.lineTo(apex.x, apex.y);
      ctx.lineTo(foot.x - run2, foot.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ground hatching
      ctx.strokeStyle = "hsl(210, 15%, 65%)";
      ctx.lineWidth = 1;
      for (let x = foot.x - run2; x < foot.x + 10; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, foot.y);
        ctx.lineTo(x - 6, foot.y + 8);
        ctx.stroke();
      }
      // Angle arc
      ctx.strokeStyle = "hsl(210, 20%, 45%)";
      ctx.beginPath();
      ctx.arc(foot.x, foot.y, 26, Math.PI + theta, Math.PI, false);
      ctx.stroke();
      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.fillStyle = "hsl(210, 20%, 35%)";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`θ = ${angleDeg}°`, foot.x - 60, foot.y - 8);

      // Block position along incline (0 = at apex, maxSliding = at foot).
      // Offset outward along the normal by half the block size so the
      // block's BASE sits on the incline surface (center is at +size/2
      // from the surface).
      const blockSize = 34;
      let displaceM = sAt(elapsed);
      let displacePx = Math.min(displaceM * pxPerM, maxSliding);
      const blockCX =
        apex.x + upIncX * -displacePx + outNormX * (blockSize / 2);
      const blockCY =
        apex.y + upIncY * -displacePx + outNormY * (blockSize / 2);

      // Rotate square block so its base sits flat on the incline.
      // The incline surface points from apex → foot; its angle in the
      // canvas frame (y-down) is atan2(rise2, run2) = atan2(-upIncY, -upIncX).
      // Rotating by that angle tilts the block by exactly θ — no extra
      // ±π/2 term needed.
      ctx.save();
      ctx.translate(blockCX, blockCY);
      ctx.rotate(Math.atan2(-upIncY, -upIncX));
      ctx.fillStyle = "hsl(20, 91%, 48%)";
      ctx.strokeStyle = "hsla(20, 91%, 30%, 0.5)";
      ctx.lineWidth = 1;
      ctx.fillRect(-blockSize / 2, -blockSize / 2, blockSize, blockSize);
      ctx.strokeRect(-blockSize / 2, -blockSize / 2, blockSize, blockSize);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${mass} kg`, 0, 0);
      ctx.restore();

      if (showFBD) {
        // Reference lengths — normalize to weight so the strongest force
        // is always full-length.
        const refLen = 80;
        const arrowFrom = (Fmag, dx, dy, color, txt) => {
          const scaleF = (Fmag / weight) * refLen;
          if (scaleF < 4) return;
          drawArrow(
            blockCX,
            blockCY,
            blockCX + dx * scaleF,
            blockCY + dy * scaleF,
            color,
            2.5,
          );
          label(
            blockCX + dx * scaleF + 6,
            blockCY + dy * scaleF,
            txt,
            color,
          );
        };

        // Weight — always straight down in canvas
        arrowFrom(weight, 0, 1, "hsl(0, 74%, 51%)", "mg");
        // Normal — along outward normal
        arrowFrom(N, outNormX, outNormY, "hsl(210, 80%, 50%)", "N");
        // Friction — along incline; direction opposes motion (or gravity
        // component if static).
        const fMag = willSlide ? kineticFriction : staticFriction;
        // Friction points UP the incline (toward apex) when block slides down,
        // or resists the gravity component when static.
        arrowFrom(fMag, upIncX, upIncY, "hsl(275, 55%, 55%)", "f");
        // mg sinθ (component of gravity along incline, DOWN the slope)
        arrowFrom(
          gravAlong,
          -upIncX,
          -upIncY,
          "hsla(0, 74%, 51%, 0.5)",
          "mg sinθ",
        );
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
          drawArrow(
            a.start.x,
            a.start.y,
            a.end.x,
            a.end.y,
            "hsl(50, 95%, 50%)",
            3,
            10,
          );
        }
        ctx.globalAlpha = 1;
      };
      annotations.forEach((a) => drawAnn(a, 1));
      if (pendingAnn) drawAnn(pendingAnn, 0.55);
    };

    const loop = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      // Slide until the block reaches the foot; then hold.
      const maxT = accel > 0 ? Math.sqrt((2 * (maxSliding / pxPerM)) / accel) : 3;
      const cycleT = maxT + 0.8;
      drawFrame(willSlide ? elapsed % cycleT : 0);
      rafRef.current = requestAnimationFrame(loop);
    };

    if (playing) {
      startTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    } else {
      drawFrame(0);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [
    playing,
    showFBD,
    theta,
    angleDeg,
    mass,
    weight,
    N,
    gravAlong,
    kineticFriction,
    staticFriction,
    willSlide,
    accel,
    sAt,
    annotations,
    pendingAnn,
  ]);

  function reset() {
    startTimeRef.current = 0;
    setPlaying(true);
  }

  // Right-click drawing
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
          style={{ height: "min(60vh, 420px)" }}
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Block on inclined plane"
        />

        {/* FBD legend — kept as a floating chip because it's small
            enough not to hide the incline. */}
        {showFBD && (
          <div className="absolute top-3 right-3 rounded-xl bg-background/90 backdrop-blur px-3 py-2 text-[11px] leading-relaxed shadow-sm space-y-1">
            <Legend color="hsl(0, 74%, 51%)" label="mg (weight)" />
            <Legend color="hsl(210, 80%, 50%)" label="N (normal)" />
            <Legend color="hsl(275, 55%, 55%)" label="f (friction)" />
            <Legend color="hsla(0, 74%, 51%, 0.5)" label="mg sinθ" />
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

      {/* Live physics strip — below the canvas so nothing hides the incline.
          Each chip is a labelled scalar the FBD refers to; the last cell
          calls out whether the block is sliding or held by static friction. */}
      <div className="rounded-2xl border border-border bg-background p-4 grid grid-cols-3 sm:grid-cols-5 gap-3 text-[11px] font-mono">
        <Chip label="θ" value={`${angleDeg}°`} />
        <Chip label="m" value={`${mass.toFixed(2)} kg`} />
        <Chip label="mg" value={`${weight.toFixed(2)} N`} />
        <Chip label="N = mg cosθ" value={`${N.toFixed(2)} N`} />
        <Chip label="mg sinθ" value={`${gravAlong.toFixed(2)} N`} />
        <Chip label="μ_s / μ_k" value={`${muS.toFixed(2)} / ${muK.toFixed(2)}`} />
        <Chip
          label="Friction f"
          value={`${(willSlide ? kineticFriction : staticFriction).toFixed(2)} N`}
        />
        <Chip
          label="Accel a"
          value={willSlide ? `${accel.toFixed(2)} m/s²` : "0"}
        />
        <div
          className={
            "col-span-3 sm:col-span-2 rounded-lg px-3 py-2 text-[11px] font-semibold flex items-center justify-center text-center " +
            (willSlide
              ? "bg-[hsl(20,91%,48%)]/10 text-[hsl(20,91%,40%)]"
              : "bg-muted text-muted-foreground")
          }
        >
          {willSlide ? "Sliding — tanθ > μ_s" : "Static — tanθ ≤ μ_s"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border bg-background p-5">
        <Slider label="Incline angle" value={angleDeg} unit="°" min={5} max={80} step={1} onChange={setAngleDeg} />
        <Slider label="Mass" value={mass} unit="kg" min={0.5} max={20} step={0.5} onChange={setMass} />
        <Slider label="Static μ_s" value={muS} unit="" min={0} max={1.5} step={0.05} onChange={setMuS} />
        <Slider label="Kinetic μ_k" value={muK} unit="" min={0} max={1.5} step={0.05} onChange={setMuK} />

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
