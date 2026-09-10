// The 7 Millennium Prize Problems — canonical source for the
// /millennium-prize-problems section.
//
// Each entry has:
//   slug         — URL segment, kebab-case
//   title        — full formal name (used in <title>, H1, cards)
//   shortTitle   — compact form for breadcrumbs / cards
//   field        — mathematical discipline
//   status       — "open" or "solved"
//   solvedBy     — string when status is "solved"
//   posedYear    — canonical year of formulation (not always the Clay year)
//   claySince    — 2000 for all seven (Clay Institute list)
//   prize        — always "$1,000,000 USD"
//   tldr         — ~180-220 words, plain English, no formulas
//   statement    — formal one-sentence statement (LaTeX ok)
//   whyItMatters — 1 short paragraph, concrete stakes
//   history      — chronological narrative, ~350-450 words
//   progress     — current state of research, what's been ruled out
//   attempts     — famous failed / partial attempts
//   whatWouldFollow — practical consequences of a proof
//   diagram      — key into MillenniumDiagrams
//   metaDesc     — <=158 chars, search-optimised
//   keywords     — comma-joined string, for meta + JSON-LD

export const MILLENNIUM_PROBLEMS = [
  {
    slug: "p-vs-np",
    title: "The P vs NP Problem",
    shortTitle: "P vs NP",
    field: "Computer Science · Complexity Theory",
    status: "open",
    posedYear: 1971,
    posedBy: "Stephen Cook · Leonid Levin",
    claySince: 2000,
    prize: "$1,000,000 USD",
    diagram: "pvsnp",
    keywords:
      "P vs NP problem, P versus NP, millennium prize problem, computational complexity, NP-complete, Stephen Cook, Cook–Levin theorem",
    metaDesc:
      "The P vs NP problem asks whether every problem whose solution can be checked quickly can also be solved quickly. Full explainer, current status, prize $1M.",
    tldr: `P vs NP asks one deceptively simple question: if a computer can *verify* a solution quickly, can it also *find* one quickly? "Quickly" here means in polynomial time — the size of the input matters, but tractably so. A sudoku puzzle is the classic intuition: given a filled grid, checking whether it's a valid solution takes a glance. But finding the solution from an empty grid, in the worst case, seems to require trying combinatorially many possibilities.

The class **P** contains problems solvable quickly. The class **NP** contains problems whose solutions can be verified quickly. Every P problem is trivially in NP (solving it is a way of verifying). The open question is the reverse: does NP ⊆ P? Almost every complexity theorist believes P ≠ NP, but nobody has proved it.

If P = NP, cryptography collapses (every RSA key becomes forgeable in polynomial time), protein folding becomes tractable, and mathematical theorem-proving is automated. If P ≠ NP, we get formal proof that certain problems are unavoidably hard, and modern cryptography stands on solid ground rather than "we haven't cracked it yet".`,
    statement:
      "Is $\\mathbf{P} = \\mathbf{NP}$? That is, for every decision problem whose solution can be verified in polynomial time by a deterministic Turing machine, does there exist an algorithm that solves it in polynomial time on a deterministic Turing machine?",
    whyItMatters: `P vs NP is the deepest question in computer science. Its resolution would either unlock a golden age of algorithmic breakthroughs (P = NP) or vindicate the entire foundation of modern cryptography, blockchain, and secure communication (P ≠ NP).`,
    history: `Stephen Cook introduced the concept of NP-completeness in his 1971 paper "The Complexity of Theorem-Proving Procedures," proving that Boolean satisfiability (SAT) is NP-complete — meaning every problem in NP can be reduced to SAT in polynomial time. Independently, Soviet mathematician Leonid Levin arrived at the same result around the same period. The pair of results is now called the Cook–Levin theorem.

Within a year, Richard Karp's 1972 paper "Reducibility Among Combinatorial Problems" showed 21 well-known problems were all NP-complete — vertex cover, Hamiltonian cycle, integer programming, and more. This exploded interest in the field. Suddenly, thousands of practical problems across biology, logistics, scheduling, and physics were revealed to be equivalent: solve any one in polynomial time and you solve them all.

The Clay Mathematics Institute listed P vs NP as one of its seven Millennium Prize Problems in 2000, with a $1,000,000 reward. Despite the attention, essentially no progress has been made on either direction.`,
    progress: `A 2002 poll of complexity theorists showed 61% believed P ≠ NP. A 2019 update put that at 88%. But belief is not proof.

Known barriers rule out entire families of proof techniques:
- **Relativization** (Baker, Gill, Solovay, 1975): oracle proofs cannot resolve P vs NP.
- **Natural proofs** (Razborov, Rudich, 1994): a large class of "combinatorial" lower-bound proofs cannot work without breaking widely-believed cryptographic assumptions.
- **Algebrization** (Aaronson, Wigderson, 2008): a further barrier beyond relativization.

Any successful proof must sidestep all three barriers. This is why serious mathematicians consider P vs NP possibly the hardest open problem in mathematics — not because it's obscure, but because we don't even have candidate techniques.`,
    attempts: `Dozens of proof announcements have circulated since 2000; none have survived peer review. Vinay Deolalikar's 2010 preprint claiming P ≠ NP briefly captured public attention before flaws were identified within weeks by the online mathematics community. The pattern is instructive: the problem attracts wave after wave of talented mathematicians whose attempts fail against known barriers.`,
    whatWouldFollow: `If P = NP with a small polynomial: modern cryptography (RSA, ECDSA, most blockchain security) collapses overnight. Optimization problems currently solved by heuristics get exact polynomial-time solutions. Automated theorem proving becomes feasible. Machine learning approaches change fundamentally.

If P ≠ NP: cryptography's foundations are formally secured. We know for certain that certain problems require exponential work in the worst case, and we can build systems on that certainty rather than empirical evidence.

Most likely outcome — a proof that P ≠ NP, decades from now, using a technique that doesn't exist yet.`,
  },

  {
    slug: "riemann-hypothesis",
    title: "The Riemann Hypothesis",
    shortTitle: "Riemann Hypothesis",
    field: "Number Theory · Complex Analysis",
    status: "open",
    posedYear: 1859,
    posedBy: "Bernhard Riemann",
    claySince: 2000,
    prize: "$1,000,000 USD",
    diagram: "riemann",
    keywords:
      "Riemann Hypothesis, zeta function, prime number theorem, critical line, Bernhard Riemann, millennium prize problem",
    metaDesc:
      "The Riemann Hypothesis conjectures that every non-trivial zero of the Riemann zeta function lies on the critical line Re(s) = 1/2. Full explainer, $1M prize.",
    tldr: `The Riemann Hypothesis is a conjecture about the distribution of prime numbers. Primes look random up close — 2, 3, 5, 7, 11, 13, 17… — but zoom out and they follow a stunning pattern, described by the prime number theorem. The Riemann zeta function ζ(s) is the mathematical object that captures this pattern.

Riemann noticed that the "non-trivial zeros" of ζ(s) — the complex numbers where ζ(s) = 0, other than at negative even integers — all seemed to have real part exactly ½. He conjectured this holds for every such zero, along a vertical line in the complex plane called the critical line.

If true, this pins down the primes with extraordinary precision. Hundreds of theorems in number theory begin "Assuming the Riemann Hypothesis…" — they'd become unconditional overnight if it were proved. Trillions of zeros have been computed numerically and every single one lies on the critical line. But numerical evidence is not proof, and the hypothesis has stood open for more than 165 years.`,
    statement:
      "Every non-trivial zero of the Riemann zeta function $\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}$ has real part equal to $\\frac{1}{2}$.",
    whyItMatters: `The distribution of primes underlies cryptography, random number generation, and vast swathes of pure mathematics. RH is the deepest statement we have about that distribution — and its resolution would either confirm an entire framework of number-theoretic reasoning, or shatter it.`,
    history: `Bernhard Riemann introduced the hypothesis in a single 1859 paper titled "On the Number of Primes Less Than a Given Magnitude" — his only paper on number theory. In 8 pages he sketched the connection between ζ(s) and prime counting, made his conjecture almost in passing, and moved on.

Hilbert placed the Riemann Hypothesis at #8 on his famous list of 23 problems in 1900. He is quoted as saying that if he awoke after sleeping for 500 years, his first question would be whether the Riemann Hypothesis had been proved.

Godfrey Hardy proved in 1914 that infinitely many zeros lie on the critical line — but that leaves open the possibility that some don't. Atle Selberg strengthened this in 1942 by showing a positive proportion of zeros are on the line. In 1974, Norman Levinson pushed the proportion to over one-third. Brian Conrey improved it to 40% in 1989. That's roughly where we are today: we know a large chunk of zeros are on the critical line, but not all.

Numerical verification has exhausted the first 10 trillion zeros. All on the line.`,
    progress: `Deep connections have been established between RH and:
- **Random matrix theory** — the statistical distribution of ζ zeros matches the eigenvalues of large random Hermitian matrices (Montgomery, 1972; Odlyzko's numerical confirmation).
- **Explicit formulae** — the primes and the zeros are Fourier duals of each other.
- **The Selberg trace formula** — an analog for hyperbolic surfaces suggests a deeper geometric interpretation might exist.

The Hilbert–Pólya conjecture posits that the zeros correspond to eigenvalues of some self-adjoint operator, which would automatically force them onto the real line (and hence, after a shift, the critical line). Finding such an operator would prove RH — but no candidate has been constructed.`,
    attempts: `Louis de Branges has announced proofs multiple times; none have been accepted. Michael Atiyah announced a proof at the 2018 Heidelberg Laureate Forum; it was widely dismissed by specialists within days. The pattern reflects the problem's depth — every generation produces sincere attempts, none succeed.`,
    whatWouldFollow: `A proof would unconditionally confirm hundreds of number-theoretic results currently conditional on RH: sharpest possible bounds on prime gaps, estimates for arithmetic progressions of primes, the largest known lower bounds on class numbers of imaginary quadratic fields, and much more.

A disproof — finding even one zero off the critical line — would be equally revolutionary, invalidating a century of conditional results and forcing a complete reconstruction of analytic number theory.`,
  },

  {
    slug: "poincare-conjecture",
    title: "The Poincaré Conjecture",
    shortTitle: "Poincaré Conjecture",
    field: "Topology · Geometric Analysis",
    status: "solved",
    solvedBy: "Grigori Perelman (2002–2003)",
    posedYear: 1904,
    posedBy: "Henri Poincaré",
    claySince: 2000,
    prize: "$1,000,000 USD (declined)",
    diagram: "poincare",
    keywords:
      "Poincaré Conjecture, Grigori Perelman, Ricci flow, 3-manifold, topology, Fields Medal declined, millennium prize",
    metaDesc:
      "The Poincaré Conjecture — the only Millennium Prize Problem solved. Grigori Perelman's 2003 proof using Ricci flow revolutionized topology. Full explainer.",
    tldr: `The Poincaré Conjecture asks a question about the shape of the universe — or more precisely, about the shape of any three-dimensional object without boundary.

Imagine a rubber band around an apple: you can always shrink it to a point without cutting the band or lifting it off the surface. That property is called "simply connected." Now imagine the band around a donut, threaded through the hole: no matter what you do, you can't shrink it. The donut is not simply connected.

Poincaré conjectured that in three dimensions, the sphere is the *only* simply connected, closed manifold — every other such shape must, topologically, be a sphere. The 2D and higher-dimensional versions were proved decades earlier; the 3D case turned out to be the hardest.

Grigori Perelman posted three papers to arXiv in 2002–2003 that proved not just the Poincaré Conjecture but the more general Geometrization Conjecture. He was awarded the Fields Medal in 2006 and the Clay Millennium Prize in 2010. He declined both — declaring the prize belonged to Richard Hamilton, whose Ricci flow program he had completed.`,
    statement:
      "Every simply connected, closed 3-manifold is homeomorphic to the 3-sphere $S^3$.",
    whyItMatters: `The Poincaré Conjecture pinned down the topology of three-dimensional space itself. Its proof introduced Ricci flow with surgery as a fundamental tool that has since reshaped geometric analysis, differential geometry, and even parts of mathematical physics.`,
    history: `Henri Poincaré formulated the conjecture in 1904, in the last of his six-part series "Analysis Situs" — the founding work of algebraic topology. He initially believed the conjecture obvious, then posed it as an open question in the final installment.

For most of the 20th century, no useful attack existed. The higher-dimensional analogues fell first: Stephen Smale proved the conjecture for dimensions ≥ 5 in 1961 (Fields Medal 1966). Michael Freedman handled dimension 4 in 1982 (Fields Medal 1986). The 3-dimensional case — closest to physical intuition and seemingly simplest — remained.

Richard Hamilton introduced Ricci flow in 1982, a technique that smooths a manifold's geometry by evolving its metric via a heat-like PDE. Hamilton and his students showed Ricci flow works beautifully for certain manifolds but develops singularities in general — the equation blows up in finite time along thin necks.

Grigori Perelman spent nearly a decade in relative isolation at the Steklov Institute in St. Petersburg developing techniques to handle those singularities via "surgery": cutting out the pathological regions and continuing the flow. He posted his proof in three papers to arXiv between November 2002 and July 2003. Multiple independent teams verified the proof over the next three years.`,
    progress: `Solved. The proof is complete, verified, and published in expository form by Kleiner–Lott, Cao–Zhu, and Morgan–Tian. Ricci flow has since become a standard tool with applications well beyond the original conjecture.`,
    attempts: `Numerous prior attempts by respected mathematicians (Christos Papakyriakopoulos, Colin Rourke, Rob Kirby's students) claimed proofs at various points during the 20th century; all were retracted or found flawed. Perelman's success was possible only after decades of groundwork by Hamilton and others on Ricci flow.`,
    whatWouldFollow: `The full Geometrization Conjecture (which subsumes Poincaré) classifies all closed 3-manifolds — a milestone comparable to the classification of surfaces in dimension 2. Ricci flow is now applied to Kähler geometry, general relativity, and mathematical physics.`,
  },

  {
    slug: "navier-stokes-existence-smoothness",
    title: "Navier–Stokes Existence and Smoothness",
    shortTitle: "Navier–Stokes",
    field: "Partial Differential Equations · Fluid Dynamics",
    status: "open",
    posedYear: 1822,
    posedBy: "Claude-Louis Navier · George Gabriel Stokes",
    claySince: 2000,
    prize: "$1,000,000 USD",
    diagram: "navierstokes",
    keywords:
      "Navier-Stokes equations, fluid dynamics, existence and smoothness, turbulence, millennium prize, PDE",
    metaDesc:
      "Do smooth solutions to the Navier-Stokes equations always exist? The Millennium Prize problem at the heart of fluid dynamics and turbulence. Full explainer.",
    tldr: `The Navier–Stokes equations describe how fluids move — water in a pipe, air over a wing, blood through arteries. They're derived from Newton's second law applied to a fluid, plus the assumption that stress is proportional to strain (a Newtonian fluid). We've used them for nearly 200 years to design ships, airplanes, and weather models.

The problem: we don't actually know if they always work.

Given smooth initial conditions in three dimensions, does a smooth solution always exist for all time? Or can the equations produce a "singularity" — a finite point in space where the velocity becomes infinite, or the solution simply ceases to exist? Physically, this would mean the mathematical model of fluid motion breaks down for some perfectly ordinary starting configuration.

In two dimensions, existence and smoothness are known. In three dimensions — the world we actually live in — nobody knows. The Clay Prize asks for a proof of global existence and smoothness, or a specific counterexample. Turbulence, one of the deepest unsolved problems in physics, is intimately tied to this question.`,
    statement:
      "For any smooth, divergence-free initial velocity field $\\mathbf{u}_0$ on $\\mathbb{R}^3$ with rapidly decaying tails, prove that a smooth solution $\\mathbf{u}(x,t)$ to the incompressible Navier–Stokes equations exists for all $t \\geq 0$, with bounded energy — or provide a counterexample.",
    whyItMatters: `Almost all of computational fluid dynamics assumes the answer is yes. If it's no, our theoretical foundations for turbulence, weather prediction, and aerospace engineering rest on a mathematically unverified assumption. Either resolution transforms our understanding of continuum physics.`,
    history: `Claude-Louis Navier derived the equations in 1822, working from molecular arguments. George Gabriel Stokes gave them their modern form in 1845 using continuum mechanics. Together they've described fluid motion for almost two centuries with extraordinary empirical accuracy.

Jean Leray proved in 1934 that "weak solutions" always exist globally in three dimensions — but weak solutions may not be unique, and may develop singularities that render them non-smooth. Olga Ladyzhenskaya proved global existence and smoothness for the two-dimensional case in 1959.

Vladimir Scheffer (1976) and Luis Caffarelli–Robert Kohn–Louis Nirenberg (1982) proved that the set of possible singularities in 3D weak solutions has parabolic Hausdorff dimension ≤ 1 — meaning if singularities exist, they're constrained. Still, nobody has ruled them out.`,
    progress: `Recent developments have gone in a surprising direction. Terence Tao proposed a "supercriticality barrier" in 2007: standard PDE techniques appear intrinsically unable to solve the problem because the equation is supercritical at the natural energy scale. In 2016, Tao proved global regularity fails for a *modified* Navier–Stokes system, suggesting singularities in the true system may be possible in principle.

On the constructive side, Terence Tao and others continue to develop machinery for potential singularity formation. On the negative side, no convincing candidate for a singularity has been produced. The community is roughly split on which way the answer will go.`,
    attempts: `Mukhtarbay Otelbaev announced a proof in 2014; it was found flawed within a year. Numerous other attempts have followed the same pattern. The problem is considered one of the most difficult in analysis.`,
    whatWouldFollow: `A proof of global smoothness would justify centuries of engineering practice and open new tools for understanding turbulence. A proof of finite-time singularity formation would mean our continuum model of fluids is fundamentally incomplete — a physical singularity in a mathematical model would demand explanation, and probably lead to a new physical theory of fluid behaviour at the small scale.`,
  },

  {
    slug: "hodge-conjecture",
    title: "The Hodge Conjecture",
    shortTitle: "Hodge Conjecture",
    field: "Algebraic Geometry · Complex Geometry",
    status: "open",
    posedYear: 1950,
    posedBy: "William Vallance Douglas Hodge",
    claySince: 2000,
    prize: "$1,000,000 USD",
    diagram: "hodge",
    keywords:
      "Hodge Conjecture, algebraic cycles, complex algebraic variety, cohomology, W.V.D. Hodge, millennium prize",
    metaDesc:
      "The Hodge Conjecture asks when cohomology classes on a projective variety arise from algebraic subvarieties. One of the deepest open problems in algebraic geometry.",
    tldr: `The Hodge Conjecture is the most technical of the Millennium Problems — hard even to state without prerequisites. In essence, it's about which shapes inside a complex geometric object can be described using polynomial equations.

Complex projective varieties — the study space of algebraic geometry — carry both algebraic structure (they're defined by polynomials) and geometric structure (they're smooth spaces with cohomology). Hodge theory decomposes their cohomology into pieces indexed by two integers. A specific piece, the "Hodge classes," ought morally to correspond to actual geometric subshapes cut out by polynomials — called algebraic cycles.

The conjecture: every Hodge class on a smooth complex projective variety is a rational linear combination of the cohomology classes of algebraic cycles.

If true, it would say the algebraic and topological pictures of these varieties align in the deepest possible way — geometric invariants "know" about algebraic structure. If false, it would reveal a fundamental separation between two pillars of modern geometry.`,
    statement:
      "On a smooth complex projective variety, every Hodge class is a rational linear combination of cohomology classes of algebraic cycles.",
    whyItMatters: `The Hodge Conjecture sits at the intersection of algebraic geometry, complex analysis, and topology. A proof would validate the deepest connections between algebraic and topological methods and settle dozens of open questions across arithmetic geometry, string theory, and mirror symmetry.`,
    history: `W.V.D. Hodge developed the theory of harmonic integrals in the 1930s and 1940s, culminating in the Hodge decomposition theorem for compact Kähler manifolds. He stated the conjecture in his 1950 address to the International Congress of Mathematicians in Cambridge, Massachusetts.

Solomon Lefschetz had proved the conjecture for cohomology classes of type (1,1) — the "Lefschetz (1,1) theorem" — in the 1920s, which handles the case of divisors (codimension 1 subvarieties). This remains the strongest general result.

Alexander Grothendieck reformulated the conjecture in the language of motives and introduced generalizations. The Hodge Conjecture is now understood as one of several closely related conjectures about the interaction between algebraic and transcendental invariants — including the Tate Conjecture and the standard conjectures on algebraic cycles.`,
    progress: `Proven in restricted cases:
- Divisors (Lefschetz, 1920s).
- Abelian varieties of low dimension.
- Certain classes of varieties with lots of symmetry.

Otherwise open. The general case has resisted every attack. Attiyah–Hirzebruch showed in 1962 that a natural integral (rather than rational) refinement fails — the conjecture must be stated rationally to have any chance.

Deligne developed the theory of mixed Hodge structures in the 1970s, extending Hodge theory beyond the projective case and providing tools that have been essential for progress on related conjectures, if not the main one.`,
    attempts: `The Hodge Conjecture has attracted fewer public "proof attempts" than P vs NP or Riemann — the required background is prohibitive. Serious progress happens in small increments, often on specific classes of varieties, and typically at the level of PhD theses and specialised research papers rather than dramatic announcements.`,
    whatWouldFollow: `A proof would confirm that the Hodge decomposition is fundamentally algebraic in nature — a stunning bridge between topology and algebra. It would immediately imply parts of the Tate Conjecture (an arithmetic analog) and settle questions in mirror symmetry that are currently formulated conditionally.

A counterexample would force a re-examination of the boundary between algebraic and transcendental phenomena, potentially reshaping algebraic geometry.`,
  },

  {
    slug: "birch-swinnerton-dyer-conjecture",
    title: "The Birch and Swinnerton-Dyer Conjecture",
    shortTitle: "Birch–Swinnerton-Dyer",
    field: "Number Theory · Arithmetic Geometry",
    status: "open",
    posedYear: 1965,
    posedBy: "Bryan Birch · Peter Swinnerton-Dyer",
    claySince: 2000,
    prize: "$1,000,000 USD",
    diagram: "bsd",
    keywords:
      "Birch and Swinnerton-Dyer Conjecture, BSD conjecture, elliptic curves, rational points, L-function, millennium prize",
    metaDesc:
      "The BSD Conjecture predicts the number of rational points on an elliptic curve from the behaviour of its L-function. A cornerstone of modern number theory.",
    tldr: `An elliptic curve is a specific kind of cubic equation — for example, $y^2 = x^3 + ax + b$. The rational points on it (solutions with $x$ and $y$ both rational) form a group, and this group has been studied for centuries.

The finite part of this group is easy to describe; the infinite part is measured by the *rank*, a non-negative integer. Some elliptic curves have rank 0 (only finitely many rational points), some have rank 1, and higher ranks become progressively rare. Nobody currently knows an algorithm guaranteed to compute the rank of a given curve.

Attached to every elliptic curve is another mathematical object — its L-function, $L(E, s)$ — which encodes deep information about how the curve behaves modulo primes.

The Birch and Swinnerton-Dyer Conjecture asserts that the rank of the curve equals the *order of vanishing* of $L(E, s)$ at $s = 1$. If $L(E, 1) \\ne 0$, the rank is 0 (only finitely many points). If $L(E, s)$ has a simple zero, the rank is 1. And so on. Numerical evidence overwhelmingly supports the conjecture. A proof would give us the first algorithm to compute the rank in general.`,
    statement:
      "For an elliptic curve $E$ over $\\mathbb{Q}$, the rank of the group of rational points $E(\\mathbb{Q})$ equals the order of vanishing of the L-function $L(E, s)$ at $s = 1$.",
    whyItMatters: `Elliptic curves underpin modern public-key cryptography (elliptic curve cryptography secures HTTPS, blockchain, and much more) and appear throughout number theory, including in Andrew Wiles's proof of Fermat's Last Theorem. The BSD Conjecture is the central open question about their arithmetic.`,
    history: `Bryan Birch and Peter Swinnerton-Dyer stumbled onto the conjecture in the early 1960s while running numerical experiments on the EDSAC-2 computer at Cambridge. They noticed a striking pattern in the behaviour of L-functions of elliptic curves near $s = 1$ and formulated the conjecture in a 1965 paper.

Their work was one of the first significant conjectures in mathematics driven by computer experiment — a lineage that now includes many landmark results.`,
    progress: `Major partial results have been established:
- **Coates–Wiles (1977)**: BSD holds for elliptic curves with complex multiplication, when the L-function is non-vanishing at $s = 1$.
- **Gross–Zagier (1986) + Kolyvagin (1989)**: BSD holds for curves of analytic rank 0 or 1 over $\\mathbb{Q}$.
- **Skinner–Urban (2014)** and others have extended these results in various directions.

For rank 2 or higher, the conjecture remains completely open. Even the "full BSD" — including the precise formula for the leading coefficient of the L-function in terms of the regulator, Tamagawa numbers, and Sha (the Tate–Shafarevich group) — is unresolved except in low-rank cases.`,
    attempts: `The BSD conjecture is one of the most intensely studied problems in number theory. Progress happens in specialised subcases. No dramatic false-alarm proofs, but continuous incremental progress from a large community.`,
    whatWouldFollow: `A proof would give the first general algorithm to compute the rank of an elliptic curve — currently a fundamental problem in computational number theory. It would settle the precise arithmetic structure of solutions to cubic equations in two variables. It would likely be a stepping stone to broader conjectures (the Bloch–Kato conjecture, generalized to higher-dimensional varieties).`,
  },

  {
    slug: "yang-mills-existence-mass-gap",
    title: "Yang–Mills Existence and Mass Gap",
    shortTitle: "Yang–Mills Mass Gap",
    field: "Mathematical Physics · Quantum Field Theory",
    status: "open",
    posedYear: 1954,
    posedBy: "Chen Ning Yang · Robert Mills (theory) · Clay Institute (problem, 2000)",
    claySince: 2000,
    prize: "$1,000,000 USD",
    diagram: "yangmills",
    keywords:
      "Yang-Mills theory, mass gap, quantum field theory, gauge theory, quantum chromodynamics, millennium prize",
    metaDesc:
      "Prove that a rigorous quantum Yang-Mills theory exists on 4D space and predicts a mass gap. The Millennium Prize problem at the mathematical foundation of particle physics.",
    tldr: `The Standard Model of particle physics — the theory of the electromagnetic, weak, and strong forces — is a Yang–Mills theory. It has been tested to extraordinary precision. But mathematically, the Standard Model does not yet exist. Nobody has succeeded in defining it rigorously.

The problem: quantum field theories on continuous 4-dimensional spacetime require a mathematical procedure called "renormalization" to extract finite predictions from formally divergent quantities. Physicists have a working recipe. Mathematicians do not have a rigorous foundation that shows why the recipe should produce a consistent theory.

The Millennium Prize asks for two things: (1) construct a rigorous quantum Yang–Mills theory on 4-dimensional Euclidean space with any compact non-Abelian gauge group, and (2) prove that the theory has a "mass gap" — a positive lower bound on the energy of excitations above the vacuum.

The mass gap is what makes protons and neutrons heavy despite being built from nearly massless quarks. It explains why the strong force has short range (unlike the massless-photon-mediated electromagnetic force which reaches infinitely far). Every calculation and every experiment says the mass gap is there. Nobody has proved it from first principles.`,
    statement:
      "Prove that for any compact simple gauge group $G$, a non-trivial quantum Yang–Mills theory exists on $\\mathbb{R}^4$ and has a mass gap $\\Delta > 0$.",
    whyItMatters: `Yang–Mills theories are the mathematical language of the Standard Model. Making them rigorous would place particle physics on the same footing as, say, general relativity or statistical mechanics. It's arguably the most important open problem at the interface of mathematics and physics.`,
    history: `Chen Ning Yang and Robert Mills introduced non-Abelian gauge theory in 1954, generalising Maxwell's electromagnetism. Initially considered a curiosity, it was gradually recognised — through the work of 't Hooft, Veltman, Politzer, Wilczek, Gross, and others — as the correct framework for the strong and weak nuclear forces. By 1973, quantum chromodynamics (QCD, a Yang–Mills theory with gauge group SU(3)) was established as the theory of quarks and gluons.

Meanwhile, mathematical work on constructive quantum field theory made progress in low-dimensional cases. Glimm and Jaffe rigorously constructed certain quantum field theories in 2 and 3 dimensions in the 1970s. But the physically relevant case — 4 dimensions with non-Abelian gauge symmetry — has resisted all attempts.

The Clay Institute posed the problem in 2000 based largely on advice from Arthur Jaffe and Edward Witten.`,
    progress: `Lattice gauge theory (Wilson, 1974) gives a well-defined discrete approximation of Yang–Mills theory, and numerical simulations on the lattice provide strong evidence for the mass gap. But the continuum limit — taking the lattice spacing to zero — has not been made rigorous.

Various partial results exist in restricted settings. Balaban and others have constructed the theory in finite volume with an ultraviolet cutoff. The full infinite-volume, continuum limit remains open.

Some experts believe the required mathematics may not yet exist — new tools comparable to what Perelman needed for Poincaré might be required.`,
    attempts: `Compared to the other Millennium Problems, Yang–Mills has attracted fewer public "proof attempts" — the required expertise spans both hard analysis and mathematical physics, and the barriers to a naive proof are immediately visible.`,
    whatWouldFollow: `A rigorous construction would place the Standard Model on solid mathematical ground and likely yield new mathematical tools of independent interest — much as the constructive quantum field theory program did in 2 and 3 dimensions. A proof of the mass gap would confirm from first principles the phenomenon of confinement in QCD, one of the deepest features of the physical universe.`,
  },
];

// Slug → problem lookup, memoised at module load.
const BY_SLUG = new Map(MILLENNIUM_PROBLEMS.map((p) => [p.slug, p]));
export function getMillenniumProblemBySlug(slug) {
  return BY_SLUG.get(slug) ?? null;
}
