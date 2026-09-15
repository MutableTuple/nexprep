// Registry of interactive physics simulators. Each entry has enough
// content to fully populate a detail page — SEO metadata, a short
// intro, the governing equations (LaTeX), one worked example, and
// tags to cross-link with relevant chapters / questions.
//
// The actual interactive component is loaded dynamically in
// /simulators/[slug]/page.js via a componentKey lookup — so this
// module stays server-safe.

export const SIMULATORS = [
  {
    slug: "projectile-motion",
    componentKey: "projectile",
    title: "Projectile Motion Simulator",
    shortTitle: "Projectile Motion",
    chapter: "Kinematics",
    subject: "Physics",
    tagline:
      "Change the angle, the speed, or the gravity and watch the trajectory update in real time.",
    intro: `Projectile motion is the classic first-year physics setup: a body launched near the surface of a planet, moving under gravity alone. Two axes, one constant acceleration, and a surprisingly rich set of behaviours.

Use the sliders below to change the launch angle, initial speed, and gravity. The trajectory, range, maximum height, and time of flight update live.`,
    equations: [
      { label: "Range", latex: "R = \\dfrac{u^2 \\sin(2\\theta)}{g}" },
      { label: "Max height", latex: "H = \\dfrac{u^2 \\sin^2\\theta}{2g}" },
      { label: "Time of flight", latex: "T = \\dfrac{2u \\sin\\theta}{g}" },
      {
        label: "Trajectory",
        latex: "y = x\\tan\\theta - \\dfrac{g x^2}{2u^2\\cos^2\\theta}",
      },
    ],
    keyIdeas: [
      "Horizontal velocity is constant; vertical velocity is what changes.",
      "Range is maximized at $\\theta = 45°$ — for a fixed speed on flat ground.",
      "Trajectory is a parabola in $x$–$y$ (once you eliminate $t$).",
      "On the Moon ($g \\approx 1.6$ m/s²), the same throw goes ~6× further.",
    ],
    relatedTopics: ["Kinematics", "Newton's Laws", "Circular Motion"],
    metaTitle:
      "Projectile Motion Simulator — Interactive JEE Physics | RankGrind",
    metaDesc:
      "Free interactive projectile motion simulator. Adjust angle, velocity, and gravity — see range, max height, and time of flight update live. With equations + worked example.",
    keywords: [
      "projectile motion simulator",
      "projectile motion interactive",
      "projectile motion calculator",
      "range formula",
      "maximum height projectile",
      "JEE physics simulator",
      "kinematics simulator",
    ],
  },
  {
    slug: "coulombs-law",
    componentKey: "coulomb",
    title: "Coulomb's Law Simulator",
    shortTitle: "Coulomb's Law",
    chapter: "Electrostatics",
    subject: "Physics",
    tagline:
      "Drag charges around the field. Watch the force vectors and field arrows update.",
    intro: `Coulomb's law is the electrostatic analog of Newton's law of gravitation: two point charges attract or repel with a force proportional to the product of their charges and inversely proportional to the square of the distance between them.

Drag the charges below to move them. Change the sign or magnitude with the controls. The arrows in the background show the electric field; the red arrows show the force on each charge.`,
    equations: [
      {
        label: "Force between two charges",
        latex: "F = k\\dfrac{|q_1 q_2|}{r^2}",
      },
      { label: "Coulomb's constant", latex: "k = 8.99 \\times 10^9 \\, \\text{N·m}^2/\\text{C}^2" },
      {
        label: "Electric field of a point charge",
        latex: "\\vec{E} = k\\dfrac{q}{r^2}\\,\\hat{r}",
      },
      {
        label: "Force on a test charge",
        latex: "\\vec{F} = q\\vec{E}",
      },
    ],
    keyIdeas: [
      "Like signs repel, opposite signs attract — the force vector always lies along the line joining the charges.",
      "The field of a point charge falls off as $1/r^2$; the potential falls off as $1/r$.",
      "Superposition: total field is the vector sum of contributions from every charge.",
      "A dipole (equal and opposite charges close together) produces a distinct 'figure-eight' field pattern.",
    ],
    relatedTopics: ["Electrostatics", "Electric Field", "Gauss's Law"],
    metaTitle:
      "Coulomb's Law Simulator — Interactive Electric Field | RankGrind",
    metaDesc:
      "Free interactive Coulomb's law simulator. Drag charges, adjust magnitude and sign, and see electric field vectors + forces update live. Formulas + worked example.",
    keywords: [
      "coulombs law simulator",
      "electric field simulator",
      "coulomb's law interactive",
      "point charge field",
      "electrostatics simulator",
      "JEE electrostatics",
      "physics simulator online",
    ],
  },
  {
    slug: "ray-optics",
    componentKey: "rayoptics",
    title: "Ray Optics Simulator — Thin Lens",
    shortTitle: "Ray Optics",
    chapter: "Optics",
    subject: "Physics",
    tagline:
      "Move the object, swap between convex and concave, change the focal length. See the image form via three principal rays.",
    intro: `The thin-lens equation predicts where an image forms and how large it is, given an object's position and the lens's focal length. This simulator draws the three principal rays for you — the parallel-then-through-focus ray, the through-center ray, and the through-focus-then-parallel ray — and shows where they converge (or appear to diverge from) to form the image.

Drag the object left-right, or the object arrowhead up-down. Toggle between convex and concave lenses. Move the focal-length slider to see how the image changes.`,
    equations: [
      {
        label: "Thin lens equation",
        latex:
          "\\dfrac{1}{v} - \\dfrac{1}{u} = \\dfrac{1}{f}",
      },
      { label: "Linear magnification", latex: "m = \\dfrac{v}{u} = \\dfrac{h'}{h}" },
      {
        label: "Sign convention (Cartesian)",
        latex:
          "\\text{Distances measured from lens; against light} < 0, \\text{along light} > 0",
      },
    ],
    keyIdeas: [
      "For a real object in front of a convex lens: object beyond $2f$ → real, inverted, smaller image between $f$ and $2f$.",
      "Object at $f$ → image at infinity (rays emerge parallel).",
      "Object between $f$ and lens → virtual, upright, magnified image on the same side as the object.",
      "Concave lens always makes a virtual, upright, diminished image regardless of object position.",
    ],
    relatedTopics: ["Optics", "Wave Optics", "Refraction"],
    metaTitle:
      "Ray Optics Simulator — Thin Lens Image Formation | RankGrind",
    metaDesc:
      "Interactive thin lens simulator: drag the object, switch between convex and concave, adjust focal length. See principal rays and image formation live. Thin lens equation + rules.",
    keywords: [
      "ray optics simulator",
      "thin lens simulator",
      "lens image formation",
      "convex lens simulator",
      "concave lens simulator",
      "optics simulator online",
      "JEE optics simulator",
    ],
  },
  {
    slug: "inclined-plane-wedge",
    componentKey: "wedge",
    title: "Inclined Plane Simulator — Block on a Wedge with Friction",
    shortTitle: "Wedge & Friction",
    chapter: "Laws of Motion",
    subject: "Physics",
    tagline:
      "Adjust the incline angle, mass, and friction. See the full free-body diagram and watch the block slide.",
    intro: `A block on an inclined plane is the workhorse of Newtonian mechanics — every friction and equilibrium problem eventually reduces to one. Decompose gravity along and perpendicular to the surface, add the normal reaction, add friction if the block wants to move, and Newton's second law along the incline gives the acceleration.

Slide the angle, mass, and coefficient of friction. Toggle the FBD to see the four forces (mg, N, mg sinθ, f) drawn on the block.`,
    equations: [
      {
        label: "Along the incline",
        latex: "ma = mg\\sin\\theta - \\mu_k mg\\cos\\theta",
      },
      {
        label: "Perpendicular to the incline",
        latex: "N = mg\\cos\\theta",
      },
      {
        label: "Condition for sliding",
        latex: "\\tan\\theta > \\mu_s",
      },
      {
        label: "Acceleration down the incline",
        latex: "a = g(\\sin\\theta - \\mu_k \\cos\\theta)",
      },
    ],
    keyIdeas: [
      "Decompose gravity into two components: $mg\\sin\\theta$ along the incline (drives motion) and $mg\\cos\\theta$ into the incline (balanced by $N$).",
      "The block stays at rest as long as $\\tan\\theta \\le \\mu_s$ — geometry alone, no numbers needed.",
      "On a frictionless incline, acceleration is $g\\sin\\theta$ regardless of mass — same result Galileo used on his ramps.",
      "Kinetic friction acts opposite to motion, so it flips sign if the block is pushed up the incline instead of released from rest.",
    ],
    relatedTopics: ["Laws of Motion", "Friction", "Work and Energy"],
    metaTitle:
      "Inclined Plane & Wedge Simulator — Friction, FBD | RankGrind",
    metaDesc:
      "Interactive inclined plane simulator. Adjust angle, mass, and friction coefficient; see the free-body diagram, normal force, friction, and acceleration live. JEE & NEET mechanics.",
    keywords: [
      "inclined plane simulator",
      "wedge simulator",
      "friction simulator",
      "block on incline",
      "free body diagram simulator",
      "newtons laws simulator",
      "JEE mechanics simulator",
    ],
  },
  {
    slug: "pulley-atwood-machine",
    componentKey: "pulley",
    title: "Pulley Simulator — Atwood Machine",
    shortTitle: "Pulley (Atwood)",
    chapter: "Laws of Motion",
    subject: "Physics",
    tagline:
      "Two masses, one rope, one ideal pulley. Change the masses and see the tension and acceleration update.",
    intro: `The Atwood machine — two masses connected by a light rope over a frictionless pulley — is the simplest system where constraint forces really matter. The rope forces both masses to move together, so a single acceleration governs the whole system. Once you write $F = ma$ for each mass, tension pops out algebraically.

Adjust the two masses. The heavier side falls, the lighter one rises, and the tension is always between the two weights.`,
    equations: [
      {
        label: "Acceleration",
        latex: "a = \\dfrac{(m_2 - m_1)\\,g}{m_1 + m_2}",
      },
      {
        label: "Tension",
        latex: "T = \\dfrac{2 m_1 m_2 g}{m_1 + m_2}",
      },
      {
        label: "For mass 1 (going up)",
        latex: "T - m_1 g = m_1 a",
      },
      {
        label: "For mass 2 (going down)",
        latex: "m_2 g - T = m_2 a",
      },
    ],
    keyIdeas: [
      "The constraint (inextensible rope, ideal pulley) forces both masses to share one acceleration magnitude — opposite in direction.",
      "Tension is the same everywhere along a massless rope — that's why a single $T$ appears in both equations.",
      "If $m_1 = m_2$: $a = 0$ and $T = mg$. The system is in equilibrium regardless of position.",
      "Tension always lies strictly between the two weights: $m_1 g < T < m_2 g$ (when $m_1 < m_2$).",
    ],
    relatedTopics: ["Laws of Motion", "Constraint Relations", "Tension"],
    metaTitle:
      "Pulley Simulator — Atwood Machine, Tension & Acceleration | RankGrind",
    metaDesc:
      "Free interactive Atwood-machine simulator. Change the two masses, see tension and acceleration compute live, with a full FBD on each block. JEE & NEET mechanics.",
    keywords: [
      "pulley simulator",
      "atwood machine simulator",
      "tension simulator",
      "atwood machine calculator",
      "pulley physics",
      "JEE pulley problems",
      "constraint motion simulator",
    ],
  },
];

const BY_SLUG = new Map(SIMULATORS.map((s) => [s.slug, s]));
export function getSimulatorBySlug(slug) {
  return BY_SLUG.get(slug) ?? null;
}
