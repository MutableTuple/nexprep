const jeeMathQuestions = [
  {
    id: "math-001",
    subject: "Mathematics",
    chapter: "Quadratic Equations",
    topic: "Roots of Quadratic Equation",
    difficulty: "Easy",
    exam: "JEE Main",
    marks: 4,
    negativeMarks: -1,
    estimatedTime: 90,
    question: "If α and β are the roots of x² − 5x + 6 = 0, then find α² + β².",

    options: [
      { id: "A", text: "11" },
      { id: "B", text: "13" },
      { id: "C", text: "15" },
      { id: "D", text: "17" },
    ],

    correctOption: "B",

    formula: "α² + β² = (α + β)² − 2αβ",

    hint: "First calculate α + β and αβ using Vieta's Formula.",

    explanation:
      "For x² − 5x + 6 = 0, α + β = 5 and αβ = 6. Therefore α² + β² = 25 − 12 = 13.",

    solutionSteps: [
      "α + β = 5",
      "αβ = 6",
      "(α + β)² = 25",
      "α² + β² = 25 − 12 = 13",
    ],

    tags: ["Quadratic", "Roots", "Algebra"],
  },

  {
    id: "math-002",
    subject: "Mathematics",
    chapter: "Limits",
    topic: "Standard Limits",
    difficulty: "Easy",
    exam: "JEE Main",
    marks: 4,
    negativeMarks: -1,
    estimatedTime: 60,

    question: "Evaluate lim(x→0) (sin x)/x.",

    options: [
      { id: "A", text: "0" },
      { id: "B", text: "∞" },
      { id: "C", text: "1" },
      { id: "D", text: "-1" },
    ],

    correctOption: "C",

    formula: "lim(x→0) sinx/x = 1",

    hint: "This is one of the most important standard limits.",

    explanation: "Using the standard trigonometric limit, the value equals 1.",

    solutionSteps: ["Recognize standard limit.", "Apply lim(x→0) sinx/x = 1."],

    tags: ["Calculus", "Limits"],
  },

  {
    id: "math-003",
    subject: "Mathematics",
    chapter: "Differentiation",
    topic: "Basic Derivatives",
    difficulty: "Easy",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 75,

    question: "Find the derivative of x³ + 2x² − 5x + 1.",

    options: [
      { id: "A", text: "3x² + 4x − 5" },
      { id: "B", text: "3x² + 2x − 5" },
      { id: "C", text: "x² + 4x" },
      { id: "D", text: "6x + 2" },
    ],

    correctOption: "A",

    formula: "d/dx(xⁿ)=nxⁿ⁻¹",

    hint: "Differentiate every term separately.",

    explanation: "Derivative = 3x² + 4x − 5.",

    solutionSteps: [
      "d(x³)=3x²",
      "d(2x²)=4x",
      "d(-5x)=-5",
      "Constant disappears.",
    ],

    tags: ["Calculus", "Derivative"],
  },

  {
    id: "math-004",
    subject: "Mathematics",
    chapter: "Probability",
    topic: "Basic Probability",
    difficulty: "Medium",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 90,

    question:
      "A die is thrown once. Find the probability of getting an even number.",

    options: [
      { id: "A", text: "1/6" },
      { id: "B", text: "1/2" },
      { id: "C", text: "2/3" },
      { id: "D", text: "5/6" },
    ],

    correctOption: "B",

    formula: "Probability = Favorable Outcomes / Total Outcomes",

    hint: "Even numbers are 2,4,6.",

    explanation:
      "3 favorable outcomes out of 6 total outcomes. Therefore probability = 3/6 = 1/2.",

    solutionSteps: [
      "Even numbers: 2,4,6",
      "Total outcomes:6",
      "Probability=3/6=1/2",
    ],

    tags: ["Probability"],
  },

  {
    id: "math-005",
    subject: "Mathematics",
    chapter: "Matrices",
    topic: "Determinants",
    difficulty: "Medium",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 120,

    question: "Find determinant of [[2,3],[4,5]].",

    options: [
      { id: "A", text: "-2" },
      { id: "B", text: "2" },
      { id: "C", text: "10" },
      { id: "D", text: "22" },
    ],

    correctOption: "A",

    formula: "|A| = ad − bc",

    hint: "Multiply diagonals.",

    explanation: "2×5 − 3×4 =10−12=-2.",

    solutionSteps: ["ad=10", "bc=12", "10−12=-2"],

    tags: ["Matrices", "Determinants"],
  },

  {
    id: "math-006",
    subject: "Mathematics",
    chapter: "Trigonometry",
    topic: "Standard Values",
    difficulty: "Easy",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 60,

    question: "The value of sin 30° is",

    options: [
      { id: "A", text: "1/2" },
      { id: "B", text: "√3/2" },
      { id: "C", text: "1" },
      { id: "D", text: "0" },
    ],

    correctOption: "A",

    formula: "sin30°=1/2",

    hint: "Memorize standard trigonometric values.",

    explanation: "sin30°=1/2.",

    solutionSteps: ["Use standard trigonometric table."],

    tags: ["Trigonometry"],
  },

  {
    id: "math-007",
    subject: "Mathematics",
    chapter: "Complex Numbers",
    topic: "Imaginary Unit",
    difficulty: "Medium",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 90,

    question: "The value of i⁸ is",

    options: [
      { id: "A", text: "-1" },
      { id: "B", text: "1" },
      { id: "C", text: "i" },
      { id: "D", text: "-i" },
    ],

    correctOption: "B",

    formula: "i⁴=1",

    hint: "Break the exponent into multiples of 4.",

    explanation: "i⁸=(i⁴)²=1²=1.",

    solutionSteps: ["i⁴=1", "(i⁴)²=1"],

    tags: ["Complex Numbers"],
  },

  {
    id: "math-008",
    subject: "Mathematics",
    chapter: "Coordinate Geometry",
    topic: "Distance Formula",
    difficulty: "Medium",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 100,

    question: "Distance between (1,2) and (4,6) is",

    options: [
      { id: "A", text: "4" },
      { id: "B", text: "5" },
      { id: "C", text: "6" },
      { id: "D", text: "7" },
    ],

    correctOption: "B",

    formula: "√[(x₂-x₁)²+(y₂-y₁)²]",

    hint: "Apply distance formula directly.",

    explanation: "√[(3²)+(4²)] = √25 = 5.",

    solutionSteps: ["Δx=3", "Δy=4", "√(9+16)=5"],

    tags: ["Coordinate Geometry"],
  },

  {
    id: "math-009",
    subject: "Mathematics",
    chapter: "Permutation & Combination",
    topic: "Factorial",
    difficulty: "Medium",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 90,

    question: "The value of 5! is",

    options: [
      { id: "A", text: "24" },
      { id: "B", text: "60" },
      { id: "C", text: "120" },
      { id: "D", text: "240" },
    ],

    correctOption: "C",

    formula: "n!=n×(n−1)...1",

    hint: "Multiply numbers from 5 to 1.",

    explanation: "5×4×3×2×1 =120.",

    solutionSteps: ["5×4=20", "20×3=60", "60×2=120"],

    tags: ["Permutation", "Factorial"],
  },

  {
    id: "math-010",
    subject: "Mathematics",
    chapter: "Integration",
    topic: "Basic Integration",
    difficulty: "Medium",
    exam: "JEE Main",

    marks: 4,
    negativeMarks: -1,
    estimatedTime: 120,

    question: "Evaluate ∫2x dx.",

    options: [
      { id: "A", text: "x² + C" },
      { id: "B", text: "2x² + C" },
      { id: "C", text: "x + C" },
      { id: "D", text: "4x + C" },
    ],

    correctOption: "A",

    formula: "∫xⁿdx = xⁿ⁺¹/(n+1)+C",

    hint: "Take the constant outside the integral.",

    explanation: "2∫x dx = 2(x²/2)=x²+C.",

    solutionSteps: ["2∫x dx", "=2(x²/2)", "=x²+C"],

    tags: ["Integration", "Calculus"],
  },
];

export default jeeMathQuestions;
