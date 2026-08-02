"use client";

// Shared confetti helpers — canvas-confetti wrappers used by both the goal
// celebration (GoalsProgress.jsx) and the badge-unlock modal.
import confetti from "canvas-confetti";

// Thin bar shape so pieces read as falling ribbons/streamers rather than
// plain confetti squares. Built lazily on first actual use (not at module
// load) — this file gets imported by client components that also render on
// the server for the initial HTML, and canvas-confetti's shape builder
// needs a browser canvas to work.
let ribbonShape = null;
function getRibbonShape() {
  if (!ribbonShape && typeof window !== "undefined") {
    ribbonShape = confetti.shapeFromPath({ path: "M0 0h4v18H0z" });
  }
  return ribbonShape;
}

// A few seconds of ribbons raining down from above the viewport, drifting
// side to side as they fall — not a single burst from one point. Used for
// the biggest moments (weekly/daily goals, diamond-tier badges).
export function fireRibbonRain(colors = ["#22c55e", "#16a34a", "#4ade80", "#facc15", "#38bdf8"]) {
  const shapes = [getRibbonShape() ?? "square", "square"];
  const end = Date.now() + 2800;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 90,
      spread: 45,
      startVelocity: 20,
      gravity: 0.5,
      drift: (Math.random() - 0.5) * 2,
      ticks: 300,
      scalar: 1.1,
      shapes,
      colors,
      origin: { x: Math.random(), y: -0.1 },
      zIndex: 9999,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

const TIER_CONFETTI = {
  bronze: { particleCount: 60, colors: ["#b45309", "#f59e0b", "#fcd34d"] },
  silver: { particleCount: 90, colors: ["#94a3b8", "#e2e8f0", "#cbd5e1"] },
  gold: { particleCount: 130, colors: ["#eab308", "#fde047", "#facc15"] },
};

// A single celebratory burst centered on the unlock modal, intensity
// scaling with badge rarity. Diamond gets the full ribbon rain instead —
// the rarest tier should feel like the biggest moment.
export function fireBadgeCelebration(tier) {
  if (tier === "diamond") {
    fireRibbonRain(["#22d3ee", "#a5f3fc", "#e879f9", "#f0abfc"]);
    return;
  }

  const preset = TIER_CONFETTI[tier] ?? TIER_CONFETTI.bronze;
  confetti({
    particleCount: preset.particleCount,
    spread: 75,
    startVelocity: 35,
    origin: { y: 0.45 },
    colors: preset.colors,
    zIndex: 9999,
  });
}
