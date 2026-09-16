"use client";

import dynamic from "next/dynamic";

// Dispatcher — takes the `{kind, params}` spec from the matcher and
// renders the matching interactive simulator. Every child is a client
// component and canvas-heavy, so we load them lazily to keep the initial
// bundle for /problems small.

const LCRPhasorSim = dynamic(
  () => import("../Simulators/LCRPhasorSim"),
  { ssr: false },
);
const ProjectileMotionSim = dynamic(
  () => import("../Simulators/ProjectileMotionSim"),
  { ssr: false },
);
const WedgeSim = dynamic(() => import("../Simulators/WedgeSim"), {
  ssr: false,
});
const PulleySim = dynamic(() => import("../Simulators/PulleySim"), {
  ssr: false,
});
const RayOpticsSim = dynamic(() => import("../Simulators/RayOpticsSim"), {
  ssr: false,
});
const CoulombsLawSim = dynamic(
  () => import("../Simulators/CoulombsLawSim"),
  { ssr: false },
);
const FormulaStepperSim = dynamic(
  () => import("../Simulators/FormulaStepperSim"),
  { ssr: false },
);
// three.js + drei is ~700 KB — only loaded when a scene3d question is
// actually opened, not on every page.
const Scene3DSim = dynamic(() => import("../Simulators/Scene3DSim"), {
  ssr: false,
});

const REGISTRY = {
  "lcr-phasor": LCRPhasorSim,
  projectile: ProjectileMotionSim,
  wedge: WedgeSim,
  pulley: PulleySim,
  rayoptics: RayOpticsSim,
  coulomb: CoulombsLawSim,
  // Universal fallback — LLM emits {inputs, steps} for any numeric
  // question with a formula chain.
  "formula-stepper": FormulaStepperSim,
  // Opt-in interactive 3D scene — LLM emits a primitives DSL.
  scene3d: Scene3DSim,
};

export default function QuestionSimulator({ spec, fallback = null }) {
  if (!spec) return fallback;
  const Comp = REGISTRY[spec.kind];
  if (!Comp) return fallback;
  return <Comp {...(spec.params ?? {})} />;
}
