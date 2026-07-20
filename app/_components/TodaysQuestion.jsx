"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  ChevronRight,
  Clock3,
  Flame,
  Target,
  Trophy,
  Play,
  X,
  Lock,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MotionButton = motion(Button);

const CORRECT_INDEX = 1;
const TOTAL_SECONDS = 90;

// Question type: "text" | "image"
const QUESTION = {
  type: "text", // change to "image" for image-based questions
  subject: "Physics",
  topic: "Modern Physics",
  difficulty: "Medium",
  // For text questions
  text: "What is the speed of light in vacuum according to modern physics?",
  // For image questions — swap type to "image" and provide imageUrl
  // imageUrl: "/questions/q1.png",
  // imageAlt: "Circuit diagram showing resistors in parallel",
  xp: 25,
  correctIndex: 1,
  options: [
    { label: "A", value: "3.14 × 10⁸ m/s" },
    { label: "B", value: "2.99 × 10⁸ m/s" },
    { label: "C", value: "1.50 × 10⁸ m/s" },
    { label: "D", value: "4.00 × 10⁸ m/s" },
  ],
  explanation:
    "The speed of light in vacuum is exactly 299,792,458 m/s ≈ 2.99 × 10⁸ m/s, as defined by the BIPM in 1983.",
};

const kpis = [
  {
    icon: <Clock3 size={13} />,
    label: "Avg time",
    value: "42s",
    sub: "8s faster",
    subColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: <Target size={13} />,
    label: "Accuracy",
    value: "87%",
    sub: "Top 15%",
    subColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: <Trophy size={13} />,
    label: "Rank",
    value: "#142",
    sub: "↑ 18 today",
    subColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: <Flame size={13} className="text-orange-500" />,
    label: "Streak",
    value: "34",
    sub: "Best: 51",
    subColor: "text-orange-500",
  },
];

const INITIAL_LEADERBOARD = [
  { name: "Rahul S.", score: 2980, time: "18s", you: false },
  { name: "Priya M.", score: 2750, time: "22s", you: false },
  { name: "Aarav K.", score: 2600, time: "31s", you: false },
  { name: "Sneha R.", score: 2400, time: "44s", you: false },
  { name: "You", score: null, time: null, you: true },
  { name: "Dev P.", score: 2100, time: "58s", you: false },
  { name: "Anjali T.", score: 1980, time: "1m 4s", you: false },
  { name: "Karan B.", score: 1750, time: "1m 18s", you: false },
];

// ── Confetti ──────────────────────────────────────────────────────────────────
function useConfetti() {
  const canvasRef = useRef(null);
  const launch = (originEl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const rect = originEl
      ? originEl.getBoundingClientRect()
      : { left: canvas.width / 2, top: canvas.height * 0.7, width: 0 };
    const ox = rect.left + rect.width / 2;
    const oy = rect.top;
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#3f51b5",
      "#2196f3",
      "#00bcd4",
      "#4caf50",
      "#ffeb3b",
      "#ff9800",
    ];
    const pieces = Array.from({ length: 130 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        w: Math.random() * 9 + 4,
        h: Math.random() * 5 + 3,
        rot: Math.random() * 360,
        rotV: Math.random() * 7 - 3.5,
        life: 0,
      };
    });
    let raf;
    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach((p) => {
        p.life++;
        p.vy += 0.28;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        const alpha = Math.max(0, 1 - p.life / 75);
        if (alpha > 0) alive = true;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  };
  return { canvasRef, launch };
}

// ── Leaderboard Modal ─────────────────────────────────────────────────────────
function LeaderboardModal({ open, onClose, leaderboard }) {
  const sorted = [...leaderboard].sort(
    (a, b) => (b.score || 0) - (a.score || 0),
  );
  const yourRank = sorted.findIndex((p) => p.you) + 1;
  const medal = (i) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-0 sm:pb-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-sm rounded-t-3xl sm:rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex justify-center sm:hidden">
              <div className="h-1 w-10 rounded-full bg-muted" />
            </div>
            <div className="mb-4 flex items-center justify-between mt-3 sm:mt-0">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Trophy size={18} className="text-yellow-500" />
                Daily Leaderboard
              </h3>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label="Close leaderboard"
              >
                <X size={16} />
              </Button>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Your rank:{" "}
              <span className="font-semibold text-primary">
                #{yourRank} of {sorted.length}
              </span>
            </p>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {sorted.map((p, i) => (
                <div
                  key={p.name}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                    p.you
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="w-7 text-center text-sm">{medal(i)}</span>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className={`flex-1 text-sm font-medium ${p.you ? "text-primary" : "text-foreground"}`}
                  >
                    {p.name}
                    {p.you && (
                      <Badge
                        variant="secondary"
                        className="ml-1.5 bg-primary/15 text-primary"
                      >
                        You
                      </Badge>
                    )}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {p.score ? p.score.toLocaleString() : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {p.time || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Question Body (text or image) ─────────────────────────────────────────────
function QuestionBody({ question, blurred = false }) {
  return (
    <div
      className={`mb-4 rounded-2xl bg-muted/50 p-5 transition-all duration-300 ${blurred ? "select-none" : ""}`}
    >
      <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {question.type === "image" ? (
          <ImageIcon size={12} />
        ) : (
          <BrainCircuit size={12} />
        )}
        {question.topic}
      </div>

      {question.type === "image" ? (
        <div
          className={`relative rounded-xl overflow-hidden bg-muted ${blurred ? "blur-md" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={question.imageUrl}
            alt={
              blurred ? "Question image — start to reveal" : question.imageAlt
            }
            className="w-full object-contain max-h-64"
            draggable={false}
          />
          {/* Fallback placeholder when no image provided yet */}
          {!question.imageUrl && (
            <div className="flex flex-col items-center justify-center h-44 gap-2 text-muted-foreground">
              <ImageIcon size={32} />
              <span className="text-xs">Question image goes here</span>
            </div>
          )}
        </div>
      ) : (
        <h4
          className={`text-lg font-semibold leading-snug transition-all duration-300 ${
            blurred
              ? "blur-sm text-muted-foreground/50 pointer-events-none"
              : "text-foreground"
          }`}
        >
          {question.text}
        </h4>
      )}
    </div>
  );
}

// ── Options (blurred in reveal phase) ─────────────────────────────────────────
function OptionsList({
  question,
  selected,
  submitted,
  onSelect,
  blurred = false,
}) {
  return (
    <div
      className={`grid gap-2.5 transition-all duration-300 ${blurred ? "pointer-events-none" : ""}`}
    >
      {question.options.map((option, index) => {
        const isSelected = selected === index;
        const showCorrect = submitted && index === question.correctIndex;
        const showWrong =
          submitted && isSelected && index !== question.correctIndex;

        return (
          <motion.button
            key={index}
            whileHover={!submitted && !blurred ? { y: -1 } : {}}
            whileTap={!submitted && !blurred ? { scale: 0.99 } : {}}
            onClick={() => !submitted && !blurred && onSelect(index)}
            className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ${
              blurred
                ? "border-border bg-muted/50 blur-[2px]"
                : showCorrect
                  ? "border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-500"
                  : showWrong
                    ? "border-red-500 bg-red-500 text-white"
                    : isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-lg"
                      : "border-border bg-card hover:border-foreground/30 hover:shadow-sm"
            } ${submitted || blurred ? "cursor-default" : "cursor-pointer"}`}
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition ${
                showCorrect || showWrong || (isSelected && !blurred)
                  ? "bg-white/20 text-white"
                  : blurred
                    ? "bg-muted text-muted-foreground/50"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {option.label}
            </div>
            <span
              className={`text-sm font-medium ${
                blurred ? "text-muted-foreground/50" : ""
              }`}
            >
              {option.value}
            </span>
            {showCorrect && <span className="ml-auto text-white">✓</span>}
            {showWrong && <span className="ml-auto text-white">✗</span>}
            {!submitted && !blurred && (
              <ChevronRight
                size={15}
                className={`ml-auto transition-all ${
                  isSelected
                    ? "opacity-100"
                    : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TodaysQuestion() {
  const [phase, setPhase] = useState("reveal"); // "reveal" | "quiz" | "done"
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [timeTaken, setTimeTaken] = useState(null);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [resultType, setResultType] = useState(null);

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const lbBtnRef = useRef(null);
  const { canvasRef, launch } = useConfetti();

  useEffect(() => {
    if (phase !== "quiz" || submitted) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, submitted]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const startQuiz = () => {
    startTimeRef.current = Date.now();
    setPhase("quiz");
  };

  const handleTimeout = () => {
    setSubmitted(true);
    setResultType("timeout");
    setPhase("done");
    updateLeaderboard(300, "—");
  };

  const handleSkip = () => {
    if (submitted) return;
    clearInterval(timerRef.current);
    setSubmitted(true);
    setResultType("skip");
    setPhase("done");
    updateLeaderboard(300, "—");
  };

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    setTimeTaken(elapsed);
    setSubmitted(true);
    const correct = selected === QUESTION.correctIndex;
    setResultType(correct ? "correct" : "wrong");
    setPhase("done");
    const score = correct
      ? Math.max(2980, 3200 - elapsed * 8)
      : Math.max(500, 1200 - elapsed * 10);
    updateLeaderboard(score, elapsed + "s");
    if (correct) {
      setTimeout(() => launch(lbBtnRef.current), 80);
    }
  };

  const updateLeaderboard = (score, time) => {
    setLeaderboard((prev) =>
      prev.map((p) => (p.you ? { ...p, score, time } : p)),
    );
  };

  const resultBanner = () => {
    if (!resultType) return null;
    const explanationSuffix = ` ${QUESTION.explanation}`;
    if (resultType === "correct")
      return {
        bg: "bg-green-50 border border-green-200 dark:bg-green-500/10 dark:border-green-500/30",
        text: "text-green-800 dark:text-green-400",
        msg: `Correct! You answered in ${timeTaken}s. +${QUESTION.xp} XP earned 🎉${explanationSuffix}`,
      };
    if (resultType === "wrong")
      return {
        bg: "bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30",
        text: "text-red-800 dark:text-red-400",
        msg: `Not quite. The correct answer is option ${QUESTION.options[QUESTION.correctIndex].label}. ${QUESTION.explanation}`,
      };
    if (resultType === "timeout")
      return {
        bg: "bg-orange-50 border border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30",
        text: "text-orange-800 dark:text-orange-400",
        msg: `Time's up! The correct answer was option ${QUESTION.options[QUESTION.correctIndex].label}. ${QUESTION.explanation}`,
      };
    if (resultType === "skip")
      return {
        bg: "bg-muted border border-border",
        text: "text-foreground",
        msg: `Skipped. The correct answer was option ${QUESTION.options[QUESTION.correctIndex].label}.`,
      };
  };

  const banner = resultBanner();

  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[200]"
      />
      <LeaderboardModal
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        leaderboard={leaderboard}
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 px-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Today's Question
            </h2>
            <Badge
              variant="outline"
              className="ml-auto border-orange-200 bg-orange-100 text-orange-600 dark:border-orange-900 dark:bg-orange-500/15 dark:text-orange-400 whitespace-nowrap"
            >
              JEE 2025
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground pl-11">
            One question daily — answer fast, rank higher.
          </p>
          <div className="mt-3 h-px bg-border" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="w-full overflow-hidden rounded-[28px] border border-border bg-card"
        >
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  phase === "done" ? "100%" : phase === "quiz" ? "13%" : "0%",
              }}
              transition={{ duration: 0.8 }}
              className="h-full bg-primary rounded-r-full"
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* ── REVEAL PHASE ── */}
            <AnimatePresence mode="wait">
              {phase === "reveal" && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Subject + difficulty badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <Badge variant="secondary">📚 {QUESTION.subject}</Badge>
                    <Badge
                      variant="outline"
                      className="border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-900 dark:bg-orange-500/15 dark:text-orange-400"
                    >
                      {QUESTION.difficulty}
                    </Badge>
                    {QUESTION.type === "image" && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-500/15 dark:text-blue-400"
                      >
                        <ImageIcon size={10} /> Image Q
                      </Badge>
                    )}
                  </div>

                  {/* Blurred preview */}
                  <QuestionBody question={QUESTION} blurred={true} />
                  <OptionsList
                    question={QUESTION}
                    selected={null}
                    submitted={false}
                    onSelect={() => {}}
                    blurred={true}
                  />

                  {/* CTA overlay */}
                  <div className="mt-8 flex flex-col items-center text-center gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Lock size={12} />
                      Question hidden until you start
                    </div>
                    <MotionButton
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startQuiz}
                      size="lg"
                      className="gap-2 rounded-full px-8 h-12 text-sm shadow-lg mt-1"
                    >
                      <Play size={14} />
                      Start Challenge
                    </MotionButton>
                    <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                      ⏱ This starts a <strong>90-second countdown</strong>. Your
                      score depends on how fast you answer correctly.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── QUIZ & DONE PHASES ── */}
              {phase !== "reveal" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2.5">
                        <Badge variant="secondary">📚 {QUESTION.subject}</Badge>
                        <Badge
                          variant="outline"
                          className="border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-900 dark:bg-orange-500/15 dark:text-orange-400"
                        >
                          {QUESTION.difficulty}
                        </Badge>
                        {QUESTION.type === "image" && (
                          <Badge
                            variant="outline"
                            className="gap-1 border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-500/15 dark:text-blue-400"
                          >
                            <ImageIcon size={10} /> Image Q
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Question 1 of 1
                      </p>
                    </div>

                    {/* Timer */}
                    <div
                      className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 transition-colors ${
                        secondsLeft <= 10 && !submitted
                          ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
                          : "border-border bg-muted/50"
                      }`}
                    >
                      <Clock3
                        size={15}
                        className={
                          secondsLeft <= 10 && !submitted
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }
                      />
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Time left
                        </p>
                        <motion.p
                          key={secondsLeft}
                          animate={
                            secondsLeft <= 10 && !submitted
                              ? { scale: [1, 1.2, 1] }
                              : {}
                          }
                          transition={{ duration: 0.18 }}
                          className={`text-base font-semibold tabular-nums ${
                            secondsLeft <= 10 && !submitted
                              ? "text-red-600 dark:text-red-400"
                              : "text-foreground"
                          }`}
                        >
                          {formatTime(secondsLeft)}
                        </motion.p>
                      </div>
                    </div>
                  </div>

                  {/* Progress dot */}
                  <div className="mb-5">
                    <div
                      className={`h-[4px] w-full rounded-full transition-all ${
                        phase === "done" ? "bg-primary" : "bg-primary/25"
                      }`}
                    />
                  </div>

                  {/* KPI strip */}
                  <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border overflow-hidden rounded-2xl border border-border bg-muted/50">
                    {kpis.map((kpi) => (
                      <div key={kpi.label} className="px-4 py-3">
                        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          {kpi.icon}
                          {kpi.label}
                        </div>
                        <p className="text-lg font-bold leading-none text-foreground">
                          {kpi.value}
                        </p>
                        <p
                          className={`mt-1 text-[10px] font-medium ${kpi.subColor}`}
                        >
                          {kpi.sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Question */}
                  <QuestionBody question={QUESTION} blurred={false} />

                  {/* Options */}
                  <OptionsList
                    question={QUESTION}
                    selected={selected}
                    submitted={submitted}
                    onSelect={setSelected}
                    blurred={false}
                  />

                  {/* Result banner */}
                  {banner && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-5 rounded-2xl p-4 text-sm leading-relaxed ${banner.bg} ${banner.text}`}
                    >
                      {banner.msg}
                    </motion.div>
                  )}

                  {/* Actions */}
                  {!submitted ? (
                    <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full px-5"
                        onClick={handleSkip}
                      >
                        Skip
                      </Button>
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
                          ⚡ +{QUESTION.xp} XP
                        </Badge>
                        <MotionButton
                          whileHover={
                            selected !== null ? { scale: 1.02, y: -1 } : {}
                          }
                          whileTap={selected !== null ? { scale: 0.98 } : {}}
                          disabled={selected === null}
                          onClick={handleSubmit}
                          className="gap-1.5 rounded-full px-6 shadow-lg"
                        >
                          Submit
                          <ChevronRight size={15} />
                        </MotionButton>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      ref={lbBtnRef}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="mt-5 flex justify-center"
                    >
                      <MotionButton
                        variant="outline"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowLeaderboard(true)}
                        className="gap-2 rounded-full px-6"
                      >
                        <Trophy size={15} className="text-yellow-500" />
                        View Daily Leaderboard
                      </MotionButton>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
