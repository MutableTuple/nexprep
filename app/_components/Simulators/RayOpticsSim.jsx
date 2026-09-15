"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

// Ray optics — thin lens. Everything is drawn on a single canvas,
// with the lens at x = W/2, the optical axis at y = H/2, and object
// distances measured in world units (pixels). Sign convention:
// - Object sits to the LEFT of the lens → u < 0 in Cartesian.
// - We work in "positive-u" form to keep the sliders intuitive, and
//   apply signs at the equation step: 1/v = 1/f + 1/u_signed.
// - Convex → f > 0. Concave → f < 0.
//
// Three principal rays are drawn from the arrow tip:
//   R1: parallel to axis, refracts through the (opposite-side) focus.
//   R2: through the optical center → straight line.
//   R3: through the near-side focus, emerges parallel to the axis.
// Their intersection past the lens is the image tip.

export default function RayOpticsSim() {
  const canvasRef = useRef(null);
  const [objectDist, setObjectDist] = useState(180); // px left of lens (positive value)
  const [objectHeight, setObjectHeight] = useState(60); // px above axis (positive → upright arrow)
  const [focal, setFocal] = useState(100); // px, positive
  const [lensType, setLensType] = useState("convex"); // convex | concave

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
    const cx = W / 2; // lens x
    const axisY = H / 2;

    const f = lensType === "convex" ? focal : -focal;
    const u = -objectDist; // Cartesian: object to the left → negative
    // Thin lens: 1/v - 1/u = 1/f  →  1/v = 1/f + 1/u
    const v = 1 / (1 / f + 1 / u);
    const magnification = v / u;
    const h = objectHeight; // object arrow tip y (in world units up)
    const hp = magnification * h; // image height (world units up)

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Optical axis
    ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(W, axisY);
    ctx.stroke();

    // Focal points (both sides)
    const drawFocal = (x, label) => {
      ctx.fillStyle = "rgba(120, 120, 120, 0.9)";
      ctx.beginPath();
      ctx.arc(x, axisY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, x, axisY + 16);
    };
    drawFocal(cx + focal, "F");
    drawFocal(cx - focal, "F'");
    drawFocal(cx + 2 * focal, "2F");
    drawFocal(cx - 2 * focal, "2F'");

    // Lens itself — a vertical ellipse whose shape hints convex/concave
    const lensH = Math.min(140, H * 0.6);
    ctx.strokeStyle = "hsl(200, 60%, 45%)";
    ctx.fillStyle = "hsla(200, 60%, 45%, 0.12)";
    ctx.lineWidth = 2;
    if (lensType === "convex") {
      ctx.beginPath();
      ctx.ellipse(cx, axisY, 12, lensH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Arrowheads at top/bottom to signal "converging"
      ctx.beginPath();
      ctx.moveTo(cx - 6, axisY - lensH / 2 + 8);
      ctx.lineTo(cx, axisY - lensH / 2 - 2);
      ctx.lineTo(cx + 6, axisY - lensH / 2 + 8);
      ctx.moveTo(cx - 6, axisY + lensH / 2 - 8);
      ctx.lineTo(cx, axisY + lensH / 2 + 2);
      ctx.lineTo(cx + 6, axisY + lensH / 2 - 8);
      ctx.stroke();
    } else {
      // Draw concave lens as two arcs bowing inward
      ctx.beginPath();
      ctx.moveTo(cx - 8, axisY - lensH / 2);
      ctx.quadraticCurveTo(cx + 2, axisY, cx - 8, axisY + lensH / 2);
      ctx.lineTo(cx + 8, axisY + lensH / 2);
      ctx.quadraticCurveTo(cx - 2, axisY, cx + 8, axisY - lensH / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Object arrow (green)
    const objX = cx - objectDist;
    const objTipY = axisY - h;
    ctx.strokeStyle = "hsl(150, 60%, 40%)";
    ctx.fillStyle = "hsl(150, 60%, 40%)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(objX, axisY);
    ctx.lineTo(objX, objTipY);
    ctx.stroke();
    // arrowhead
    ctx.beginPath();
    ctx.moveTo(objX, objTipY - 8);
    ctx.lineTo(objX - 5, objTipY + 2);
    ctx.lineTo(objX + 5, objTipY + 2);
    ctx.closePath();
    ctx.fill();

    // Ray tracing. Each ray starts at the object arrow tip (objX, objTipY).
    // We draw them in two segments: object → lens, then lens → far right.
    //
    // For the segment past the lens, we compute the direction analytically:
    //   R1: after lens goes toward (cx + f, axisY)  — the focal point on far side
    //       (for concave/f<0, it "appears to come from" cx + f, so we extrapolate)
    //   R2: through center → same line continues
    //   R3: after lens is parallel to axis
    //
    // We then extend each ray to x = W (real image side) or backward to
    // where they intersect virtually (dashed) if v turned out negative.

    const rayColors = ["hsl(20, 91%, 48%)", "hsl(270, 60%, 55%)", "hsl(200, 80%, 45%)"];

    // Solve intersection of two lines given point+dir
    function drawRayPair(preFromX, preFromY, preToX, preToY, postDirX, postDirY, color) {
      // Segment 1: object tip → lens (solid)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(preFromX, preFromY);
      ctx.lineTo(preToX, preToY);
      ctx.stroke();

      // Segment 2: from lens onward (solid to right edge). If v<0, we
      // dash the projection because the image is virtual (rays diverge).
      const norm = Math.hypot(postDirX, postDirY) || 1;
      const dx = postDirX / norm;
      const dy = postDirY / norm;
      // extend far past the right edge
      const farX = preToX + dx * (W + 200);
      const farY = preToY + dy * (W + 200);
      ctx.setLineDash(v < 0 ? [6, 4] : []);
      ctx.beginPath();
      ctx.moveTo(preToX, preToY);
      ctx.lineTo(farX, farY);
      ctx.stroke();

      // For virtual image (v<0), also project BACKWARD through the lens
      // so the dashed lines actually converge on the object side.
      if (v < 0) {
        const backX = preToX - dx * (W + 200);
        const backY = preToY - dy * (W + 200);
        ctx.beginPath();
        ctx.moveTo(preToX, preToY);
        ctx.lineTo(backX, backY);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // R1: parallel-to-axis from tip → hits lens at (cx, objTipY), then
    // heads toward focal point on far side of lens at (cx + f, axisY).
    {
      const preToY = objTipY;
      const dirX = cx + f - cx;
      const dirY = axisY - preToY;
      drawRayPair(objX, objTipY, cx, preToY, dirX, dirY, rayColors[0]);
    }

    // R2: through optical center — passes undeviated. So the "after" direction
    // is the same as the "before" direction.
    {
      const dirX = cx - objX;
      const dirY = axisY - objTipY;
      drawRayPair(objX, objTipY, cx, axisY, dirX, dirY, rayColors[1]);
    }

    // R3: through near-side focus (at cx - f, axisY), emerges parallel to axis.
    {
      // Find where this ray crosses the lens plane (x = cx).
      // Line from (objX, objTipY) through (cx - f, axisY):
      const nearFocalX = cx - f;
      const nearFocalY = axisY;
      const slope =
        (nearFocalY - objTipY) / (nearFocalX - objX || 1e-6);
      const yAtLens = objTipY + slope * (cx - objX);
      drawRayPair(objX, objTipY, cx, yAtLens, 1, 0, rayColors[2]);
    }

    // Image arrow — solid if real (v > 0), dashed if virtual (v < 0)
    const imgX = cx + v;
    const imgTipY = axisY - hp;
    if (Number.isFinite(imgX) && Math.abs(imgX - cx) < W) {
      ctx.strokeStyle = "hsl(0, 74%, 51%)";
      ctx.fillStyle = "hsl(0, 74%, 51%)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash(v < 0 ? [5, 4] : []);
      ctx.beginPath();
      ctx.moveTo(imgX, axisY);
      ctx.lineTo(imgX, imgTipY);
      ctx.stroke();
      ctx.setLineDash([]);
      // arrowhead pointing toward the tip
      const dir = imgTipY < axisY ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(imgX, imgTipY + dir * 8);
      ctx.lineTo(imgX - 5, imgTipY - dir * 2);
      ctx.lineTo(imgX + 5, imgTipY - dir * 2);
      ctx.closePath();
      ctx.fill();
    }
  }, [objectDist, objectHeight, focal, lensType]);

  // Derived readouts
  const f = lensType === "convex" ? focal : -focal;
  const u = -objectDist;
  const v = 1 / (1 / f + 1 / u);
  const mag = v / u;
  const imageType =
    !Number.isFinite(v) || Math.abs(v) > 1e6
      ? "At infinity"
      : v > 0
        ? "Real, inverted"
        : "Virtual, upright";

  function reset() {
    setObjectDist(180);
    setObjectHeight(60);
    setFocal(100);
    setLensType("convex");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-2xl border border-border bg-muted/25 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ height: "min(60vh, 420px)" }}
          aria-label="Thin lens ray tracing"
        />
        {/* Readouts */}
        <div className="absolute top-3 left-3 rounded-xl bg-background/90 backdrop-blur px-3 py-2 text-xs font-mono leading-relaxed shadow-sm">
          <div>u = <b>{Math.abs(u).toFixed(0)}</b> px</div>
          <div>
            v ={" "}
            <b>
              {Number.isFinite(v) && Math.abs(v) < 1e6
                ? v.toFixed(0)
                : "∞"}
            </b>{" "}
            px
          </div>
          <div>m = <b>{Number.isFinite(mag) ? mag.toFixed(2) : "—"}</b></div>
          <div className="mt-1 text-muted-foreground text-[10.5px] normal-case">
            {imageType}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLensType("convex")}
            className={
              lensType === "convex"
                ? "rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold"
                : "rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold"
            }
          >
            Convex (converging)
          </button>
          <button
            onClick={() => setLensType("concave")}
            className={
              lensType === "concave"
                ? "rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold"
                : "rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold"
            }
          >
            Concave (diverging)
          </button>
          <button
            onClick={reset}
            className="ml-auto rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Slider
            label="Object distance"
            value={objectDist}
            min={40}
            max={260}
            step={1}
            unit="px"
            onChange={setObjectDist}
          />
          <Slider
            label="Object height"
            value={objectHeight}
            min={20}
            max={100}
            step={1}
            unit="px"
            onChange={setObjectHeight}
          />
          <Slider
            label="Focal length |f|"
            value={focal}
            min={40}
            max={200}
            step={1}
            unit="px"
            onChange={setFocal}
          />
        </div>
      </div>
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
