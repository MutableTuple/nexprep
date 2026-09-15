"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Plus, Minus } from "lucide-react";

// Coulomb's law — 2D electrostatics playground. Charges are point
// entities the user drags around; we render:
//   - A grid of small field-vector arrows (E-field, direction only,
//     length ∝ log magnitude to keep them visible near AND far)
//   - The force vector on each charge from every other charge
// All math in "sim units" — k = 1, distances in canvas pixels, so
// the visual has a physical shape without pretending to be SI-scaled.

const K = 20000; // scaled constant so forces render at reasonable pixel lengths

const START_CHARGES = () => [
  { id: 1, x: 200, y: 200, q: 1 },
  { id: 2, x: 400, y: 200, q: -1 },
];

export default function CoulombsLawSim() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const [charges, setCharges] = useState(START_CHARGES);
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetY }
  const [showField, setShowField] = useState(true);

  // Convert client (page-space) coords to canvas-local coords.
  const clientToCanvas = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // Pointer down — pick up the topmost charge under the cursor.
  const onPointerDown = (e) => {
    e.preventDefault();
    const { x, y } = clientToCanvas(e.clientX, e.clientY);
    for (let i = charges.length - 1; i >= 0; i--) {
      const c = charges[i];
      const dx = x - c.x;
      const dy = y - c.y;
      if (dx * dx + dy * dy <= 22 * 22) {
        setDragging({ id: c.id, offsetX: dx, offsetY: dy });
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
      }
    }
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const { x, y } = clientToCanvas(e.clientX, e.clientY);
    setCharges((prev) =>
      prev.map((c) =>
        c.id === dragging.id
          ? { ...c, x: x - dragging.offsetX, y: y - dragging.offsetY }
          : c,
      ),
    );
  };

  const onPointerUp = (e) => {
    setDragging(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Recompute force on a charge from all others. Returns {fx, fy}
  // in sim units (pixel-space vector).
  function forceOn(i) {
    const a = charges[i];
    let fx = 0;
    let fy = 0;
    for (let j = 0; j < charges.length; j++) {
      if (j === i) continue;
      const b = charges[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const r2 = dx * dx + dy * dy + 1; // +1 avoids division blow-up when overlapping
      const r = Math.sqrt(r2);
      const mag = (K * a.q * b.q) / r2; // + means repulsion (push a away from b)
      fx += (mag * dx) / r;
      fy += (mag * dy) / r;
    }
    return { fx, fy };
  }

  // Render — pure function of charges + toggles; drawn every frame so
  // drags feel smooth. Not expensive at this grid density.
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

    function drawArrow(x0, y0, x1, y1, color, thickness = 1.5) {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      const ang = Math.atan2(y1 - y0, x1 - x0);
      const ah = 6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - ah * Math.cos(ang - 0.4), y1 - ah * Math.sin(ang - 0.4));
      ctx.lineTo(x1 - ah * Math.cos(ang + 0.4), y1 - ah * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
    }

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // Field vectors on a coarse grid
      if (showField) {
        const step = 36;
        for (let x = step / 2; x < W; x += step) {
          for (let y = step / 2; y < H; y += step) {
            let ex = 0;
            let ey = 0;
            let skip = false;
            for (const c of charges) {
              const dx = x - c.x;
              const dy = y - c.y;
              const r2 = dx * dx + dy * dy;
              if (r2 < 400) {
                skip = true;
                break;
              }
              const r = Math.sqrt(r2);
              const mag = (K * c.q) / r2;
              ex += (mag * dx) / r;
              ey += (mag * dy) / r;
            }
            if (skip) continue;
            const m = Math.sqrt(ex * ex + ey * ey);
            if (m < 1e-5) continue;
            // Log-compressed length: keeps distant arrows visible
            const len = Math.min(20, 6 + Math.log10(1 + m) * 6);
            drawArrow(
              x,
              y,
              x + (ex / m) * len,
              y + (ey / m) * len,
              "rgba(120, 120, 120, 0.55)",
              1,
            );
          }
        }
      }

      // Force vectors on each charge (red)
      charges.forEach((c, i) => {
        const { fx, fy } = forceOn(i);
        const m = Math.sqrt(fx * fx + fy * fy);
        if (m > 1e-3) {
          const len = Math.min(80, 20 + Math.log10(1 + m) * 15);
          drawArrow(
            c.x,
            c.y,
            c.x + (fx / m) * len,
            c.y + (fy / m) * len,
            "hsl(0, 74%, 51%)",
            2,
          );
        }
      });

      // Charges themselves
      charges.forEach((c) => {
        const fill =
          c.q > 0 ? "hsl(20, 91%, 48%)" : "hsl(210, 80%, 55%)";
        ctx.fillStyle = fill;
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.q > 0 ? "+" : "−", c.x, c.y);
      });
    };

    render();
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charges, showField]);

  function reset() {
    setCharges(START_CHARGES());
  }

  function addCharge(sign) {
    setCharges((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 120 + Math.random() * 400,
        y: 120 + Math.random() * 200,
        q: sign,
      },
    ]);
  }

  function removeLast() {
    setCharges((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function flipCharge(id) {
    setCharges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, q: -c.q } : c)),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-2xl border border-border bg-muted/25 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none select-none"
          style={{ height: "min(60vh, 400px)" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Coulomb's law electric field playground"
        />
        <div className="absolute top-3 left-3 rounded-xl bg-background/90 backdrop-blur px-3 py-2 text-xs leading-relaxed shadow-sm">
          <div className="font-mono">
            <span className="inline-block h-2 w-4 bg-[hsl(0,74%,51%)] mr-1.5 align-middle" />
            Force
            <span className="inline-block h-[1.5px] w-4 bg-gray-500 ml-3 mr-1.5 align-middle" />
            Field
          </div>
          <div className="mt-1 text-muted-foreground">
            Drag charges. Tap +/− to flip sign.
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => addCharge(1)}
            className="rounded-full bg-[hsl(20,91%,48%)] text-white px-3 py-1.5 text-xs font-semibold gap-1 inline-flex items-center"
          >
            <Plus size={12} /> Positive
          </button>
          <button
            onClick={() => addCharge(-1)}
            className="rounded-full bg-[hsl(210,80%,55%)] text-white px-3 py-1.5 text-xs font-semibold gap-1 inline-flex items-center"
          >
            <Minus size={12} /> Negative
          </button>
          <button
            onClick={removeLast}
            className="rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold"
          >
            Remove last
          </button>
          <button
            onClick={reset}
            className="ml-auto rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Charges ({charges.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {charges.map((c) => (
              <button
                key={c.id}
                onClick={() => flipCharge(c.id)}
                className={
                  c.q > 0
                    ? "rounded-full bg-[hsl(20,91%,48%)] text-white px-3 py-1 text-xs font-mono"
                    : "rounded-full bg-[hsl(210,80%,55%)] text-white px-3 py-1 text-xs font-mono"
                }
                title="Click to flip sign"
              >
                {c.q > 0 ? "+" : "−"}q
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={showField}
            onChange={(e) => setShowField(e.target.checked)}
            className="rounded"
          />
          Show electric field vectors
        </label>
      </div>
    </div>
  );
}
