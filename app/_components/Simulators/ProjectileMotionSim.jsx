"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Eraser } from "lucide-react";

// Projectile motion — with real air resistance and a full free-body
// diagram overlay. Drag is quadratic (F_d = -½ ρ C_d A |v| v), which
// breaks the closed-form parabola, so when drag > 0 we integrate the
// motion numerically (semi-implicit Euler at 1 kHz) and cache the
// samples for both rendering and metrics.
//
// Coordinates: physical y is UP-positive, ground at y = 0. We flip to
// canvas coordinates only at draw time.

const GRAVITY = { earth: 9.81, moon: 1.62, mars: 3.71 };
const CANVAS_MARGIN = 24;
const RHO = 1.225; // kg/m³, sea-level air density
const AIR_AREA = 0.01; // m² — a cricket-ball-ish cross-section

export default function ProjectileMotionSim() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);

  // Physics inputs
  const [velocity, setVelocity] = useState(30); // m/s
  const [angleDeg, setAngleDeg] = useState(45); // °
  const [gravityKey, setGravityKey] = useState("earth");
  const [mass, setMass] = useState(1.0); // kg
  const [dragCoeff, setDragCoeff] = useState(0); // C_d, 0 = no air resistance

  // UI toggles
  const [playing, setPlaying] = useState(true);
  const [showTrace, setShowTrace] = useState(true);
  const [showFBD, setShowFBD] = useState(true);

  // User annotations (chess-style right-click drawing)
  // Each entry: { start:{x,y}, end:{x,y}, kind: "arrow" | "dot" }
  // Coordinates are in canvas pixel space, not physics units.
  const [annotations, setAnnotations] = useState([]);
  const [pendingAnn, setPendingAnn] = useState(null);

  const g = GRAVITY[gravityKey];
  const theta = (angleDeg * Math.PI) / 180;
  // b = ½ ρ C_d A  →  drag force magnitude = b · |v|²
  const b = 0.5 * RHO * dragCoeff * AIR_AREA;

  // Numerically integrate the trajectory once whenever the inputs
  // change. Cheap enough at 1 kHz for ≤ 20s flights.
  const sim = useMemo(() => {
    const dt = 0.001;
    const maxT = 30;
    const samples = [];
    let x = 0;
    let y = 0;
    let vx = velocity * Math.cos(theta);
    let vy = velocity * Math.sin(theta);
    samples.push({ t: 0, x, y, vx, vy });

    for (let step = 1; step * dt <= maxT; step++) {
      const speed = Math.hypot(vx, vy);
      // F_drag = -b |v| v (vector); a_drag = F/m
      const axDrag = speed > 0 ? (-b * speed * vx) / mass : 0;
      const ayDrag = speed > 0 ? (-b * speed * vy) / mass : 0;
      const ax = axDrag;
      const ay = ayDrag - g;
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
      const t = step * dt;
      // Landed — interpolate the crossing so we don't overshoot below y=0.
      if (y < 0) {
        const prev = samples[samples.length - 1];
        const frac = prev.y / (prev.y - y);
        const xLand = prev.x + frac * (x - prev.x);
        const tLand = prev.t + frac * (t - prev.t);
        samples.push({ t: tLand, x: xLand, y: 0, vx, vy });
        break;
      }
      // Downsample: only push every ~5 ms to keep the buffer small.
      if (step % 5 === 0) samples.push({ t, x, y, vx, vy });
    }

    // Derived aggregates over the numeric run
    let maxH = 0;
    for (const s of samples) if (s.y > maxH) maxH = s.y;
    const last = samples[samples.length - 1];
    return {
      samples,
      T: last.t,
      R: last.x,
      H: maxH,
    };
  }, [velocity, theta, g, mass, b]);

  // Query the sim at time t (linear interp between samples).
  const stateAt = useCallback(
    (t) => {
      const s = sim.samples;
      if (s.length === 0) return { x: 0, y: 0, vx: 0, vy: 0 };
      if (t <= 0) return s[0];
      if (t >= sim.T) return s[s.length - 1];
      // binary search
      let lo = 0;
      let hi = s.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (s[mid].t <= t) lo = mid;
        else hi = mid;
      }
      const a = s[lo];
      const c = s[hi];
      const f = (t - a.t) / (c.t - a.t || 1);
      return {
        x: a.x + f * (c.x - a.x),
        y: a.y + f * (c.y - a.y),
        vx: a.vx + f * (c.vx - a.vx),
        vy: a.vy + f * (c.vy - a.vy),
      };
    },
    [sim],
  );

  // Render loop — draws one canvas frame given the current animation
  // time. Depends only on already-computed data + toggles.
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

    const worldW = Math.max(sim.R * 1.15, 10);
    const worldH = Math.max(sim.H * 1.4, 10);
    const scaleX = (W - CANVAS_MARGIN * 2) / worldW;
    const scaleY = (H - CANVAS_MARGIN * 2) / worldH;
    const scale = Math.min(scaleX, scaleY);
    const groundY = H - CANVAS_MARGIN;

    const toCanvas = (x, y) => ({
      cx: CANVAS_MARGIN + x * scale,
      cy: groundY - y * scale,
    });

    function drawArrow(x0, y0, x1, y1, color, thickness = 2, headSize = 8) {
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
    }

    const drawFrame = (t) => {
      ctx.clearRect(0, 0, W, H);

      // Ground
      ctx.strokeStyle = "rgba(120, 120, 120, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.stroke();

      // Range marker at landing
      const rEnd = toCanvas(sim.R, 0);
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(rEnd.cx, groundY - 4);
      ctx.lineTo(rEnd.cx, groundY + 4);
      ctx.stroke();
      ctx.setLineDash([]);

      // Full trajectory preview
      if (showTrace) {
        ctx.strokeStyle = "rgba(234, 88, 12, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < sim.samples.length; i++) {
          const s = sim.samples[i];
          const c = toCanvas(s.x, s.y);
          if (i === 0) ctx.moveTo(c.cx, c.cy);
          else ctx.lineTo(c.cx, c.cy);
        }
        ctx.stroke();
      }

      const tc = Math.min(t, sim.T);
      const st = stateAt(tc);
      const cc = toCanvas(st.x, Math.max(0, st.y));

      // Trail up to now
      ctx.strokeStyle = "hsl(20, 91%, 48%)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      for (const s of sim.samples) {
        if (s.t > tc) break;
        const p = toCanvas(s.x, s.y);
        if (first) {
          ctx.moveTo(p.cx, p.cy);
          first = false;
        } else {
          ctx.lineTo(p.cx, p.cy);
        }
      }
      ctx.lineTo(cc.cx, cc.cy);
      ctx.stroke();

      // Projectile dot
      ctx.fillStyle = "hsl(20, 91%, 48%)";
      ctx.beginPath();
      ctx.arc(cc.cx, cc.cy, 7, 0, Math.PI * 2);
      ctx.fill();

      // FREE-BODY DIAGRAM. All forces + kinematic vectors, scaled to
      // pixel lengths so they read at a glance. Colors kept distinct
      // to match the legend below the canvas.
      if (showFBD) {
        const speed = Math.hypot(st.vx, st.vy);
        // Forces
        const Fg = mass * g; // weight
        const Fd = b * speed * speed; // drag magnitude
        // Direction of drag = -v̂
        const vhx = speed > 0 ? st.vx / speed : 0;
        const vhy = speed > 0 ? st.vy / speed : 0;

        // Net acceleration components (physical, y up)
        const axDrag = speed > 0 ? (-b * speed * st.vx) / mass : 0;
        const ayDrag = speed > 0 ? (-b * speed * st.vy) / mass : 0;
        const ax = axDrag;
        const ay = ayDrag - g;
        const aMag = Math.hypot(ax, ay);

        // Common length scales — we normalize each vector by its "reference"
        // so the arrow lengths are readable regardless of the SI numbers.
        const forceLen = (F, ref) =>
          ref > 0 ? Math.min(90, 30 + (F / ref) * 50) : 30;
        const velRef = Math.max(velocity, 1);
        const accRef = Math.max(g * 2, 1);

        // Weight (mg) — always down in canvas y+
        const wLen = forceLen(Fg, mass * g);
        drawArrow(cc.cx, cc.cy, cc.cx, cc.cy + wLen, "hsl(0, 74%, 51%)", 2.5);
        labelAt(ctx, cc.cx + 8, cc.cy + wLen / 2, "mg", "hsl(0, 74%, 51%)");

        // Drag force (opposite to velocity, canvas-y flipped)
        if (Fd > 1e-4) {
          const dLen = forceLen(Fd, mass * g);
          drawArrow(
            cc.cx,
            cc.cy,
            cc.cx - vhx * dLen,
            cc.cy + vhy * dLen, // + because canvas y flipped
            "hsl(210, 80%, 50%)",
            2.5,
          );
          labelAt(
            ctx,
            cc.cx - vhx * dLen - 20,
            cc.cy + vhy * dLen,
            "F_d",
            "hsl(210, 80%, 50%)",
          );
        }

        // Velocity vector (green)
        if (speed > 1e-4) {
          const vLen = 40 + (speed / velRef) * 40;
          drawArrow(
            cc.cx,
            cc.cy,
            cc.cx + (st.vx / speed) * vLen,
            cc.cy - (st.vy / speed) * vLen,
            "hsl(150, 65%, 40%)",
            2,
          );
          labelAt(
            ctx,
            cc.cx + (st.vx / speed) * vLen + 8,
            cc.cy - (st.vy / speed) * vLen - 8,
            "v",
            "hsl(150, 65%, 40%)",
          );
        }

        // Net acceleration (orange, dashed to distinguish from force arrows)
        if (aMag > 1e-4) {
          const aLen = 30 + (aMag / accRef) * 40;
          ctx.setLineDash([5, 3]);
          drawArrow(
            cc.cx,
            cc.cy,
            cc.cx + (ax / aMag) * aLen,
            cc.cy - (ay / aMag) * aLen,
            "hsl(35, 95%, 45%)",
            2,
          );
          ctx.setLineDash([]);
          labelAt(
            ctx,
            cc.cx + (ax / aMag) * aLen + 8,
            cc.cy - (ay / aMag) * aLen + 8,
            "a",
            "hsl(35, 95%, 45%)",
          );
        }
      }

      // Launch marker + initial-velocity arrow
      const origin = toCanvas(0, 0);
      ctx.fillStyle = "rgba(80, 80, 80, 0.7)";
      ctx.beginPath();
      ctx.arc(origin.cx, origin.cy - 2, 4, 0, Math.PI * 2);
      ctx.fill();
      const arrowLen = 40;
      const nx = Math.cos(theta);
      const ny = Math.sin(theta);
      ctx.strokeStyle = "rgba(80, 80, 80, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(origin.cx, origin.cy);
      ctx.lineTo(origin.cx + nx * arrowLen, origin.cy - ny * arrowLen);
      ctx.stroke();

      // User annotations on top of everything
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
      const displayT = elapsed % (sim.T + 0.6);
      drawFrame(displayT);
      rafRef.current = requestAnimationFrame(loop);
    };

    if (playing) {
      startTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    } else {
      drawFrame(sim.T);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [
    playing,
    showTrace,
    showFBD,
    sim,
    stateAt,
    velocity,
    theta,
    mass,
    g,
    b,
    annotations,
    pendingAnn,
  ]);

  function reset() {
    startTimeRef.current = 0;
    setPlaying(true);
  }

  // ── Right-click drawing (chess-style) ─────────────────────────────
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
  const clearAnnotations = () => setAnnotations([]);

  // ── Live readouts ─────────────────────────────────────────────────
  const now = playing ? null : sim.T;
  const currentState = stateAt(now ?? 0);
  const speedNow = Math.hypot(currentState.vx, currentState.vy);
  const dragForceNow = b * speedNow * speedNow;
  const weightForce = mass * g;

  return (
    <div className="flex flex-col gap-4">
      {/* Canvas */}
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
          aria-label="Projectile motion with FBD"
        />

        {/* Live physics readout */}
        <div className="absolute top-3 left-3 rounded-xl bg-background/90 backdrop-blur px-3 py-2 text-[11px] font-mono leading-relaxed shadow-sm space-y-0.5">
          <Row label="Range R" value={`${sim.R.toFixed(1)} m`} />
          <Row label="Max height H" value={`${sim.H.toFixed(1)} m`} />
          <Row label="Time T" value={`${sim.T.toFixed(2)} s`} />
          <div className="border-t border-border my-1" />
          <Row label="Gravity g" value={`${g} m/s²`} />
          <Row label="Mass m" value={`${mass.toFixed(2)} kg`} />
          <Row label="Weight mg" value={`${weightForce.toFixed(2)} N`} />
          <Row label="Drag Cd" value={dragCoeff.toFixed(2)} />
          <Row label="|F_d| now" value={`${dragForceNow.toFixed(2)} N`} />
          <Row label="|v| now" value={`${speedNow.toFixed(1)} m/s`} />
        </div>

        {/* Legend for FBD colors */}
        {showFBD && (
          <div className="absolute top-3 right-3 rounded-xl bg-background/90 backdrop-blur px-3 py-2 text-[11px] leading-relaxed shadow-sm space-y-1">
            <Legend color="hsl(0, 74%, 51%)" label="mg (weight)" />
            <Legend color="hsl(210, 80%, 50%)" label="F_d (drag)" />
            <Legend color="hsl(150, 65%, 40%)" label="v (velocity)" />
            <Legend color="hsl(35, 95%, 45%)" label="a (net accel)" dashed />
          </div>
        )}

        {/* Play controls */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={clearAnnotations}
            className="h-9 w-9 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-background"
            aria-label="Clear annotations"
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

        {/* Right-click hint */}
        <div className="absolute bottom-3 left-3 text-[10.5px] text-muted-foreground bg-background/75 backdrop-blur px-2 py-1 rounded-md">
          Right-click drag = draw arrow · single-click = mark
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border bg-background p-5">
        <Slider
          label="Launch angle"
          value={angleDeg}
          unit="°"
          min={5}
          max={85}
          step={1}
          onChange={setAngleDeg}
        />
        <Slider
          label="Initial speed"
          value={velocity}
          unit="m/s"
          min={5}
          max={100}
          step={1}
          onChange={setVelocity}
        />
        <Slider
          label="Mass"
          value={mass}
          unit="kg"
          min={0.1}
          max={10}
          step={0.1}
          onChange={setMass}
        />
        <Slider
          label="Drag coeff Cd"
          value={dragCoeff}
          unit=""
          min={0}
          max={2}
          step={0.05}
          onChange={setDragCoeff}
        />

        <div className="col-span-full">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Gravity
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(GRAVITY).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setGravityKey(k)}
                className={
                  gravityKey === k
                    ? "rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold capitalize"
                    : "rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold capitalize"
                }
              >
                {k} · {v} m/s²
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-full flex flex-wrap items-center gap-4 pt-1">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={showTrace}
              onChange={(e) => setShowTrace(e.target.checked)}
              className="rounded"
            />
            Show full trajectory preview
          </label>
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
            <span
              className={
                showFBD
                  ? "inline-block h-1.5 w-1.5 rounded-full bg-white"
                  : "inline-block h-1.5 w-1.5 rounded-full bg-[hsl(0,74%,51%)]"
              }
            />
            {showFBD ? "Hide FBD" : "Show FBD"}
          </button>
        </div>
      </div>
    </div>
  );
}

function labelAt(ctx, x, y, text, color) {
  ctx.font = "italic bold 12px ui-serif, Georgia, 'Cambria Math', serif";
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Legend({ color, label, dashed = false }) {
  return (
    <div className="flex items-center gap-2 font-mono">
      <span
        className="inline-block h-[3px] w-5 align-middle"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`
            : color,
        }}
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
