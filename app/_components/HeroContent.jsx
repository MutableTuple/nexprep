"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Caveat } from "next/font/google";
import {
  ArrowRight,
  Zap,
  Clock,
  Swords,
  FileText,
  BarChart3,
  GraduationCap,
  ArrowRightLeft,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import MarkdownRenderer from "./MarkdownRenderer";
import SolversStack from "./SolversStack";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

const DIFFICULTY_TONE = {
  Easy: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Medium:
    "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
  Hard: "text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
};

// Real, live features only — every card here links straight to the actual
// page, most of them usable without even signing in first.
const exploreCards = [
  {
    icon: FileText,
    title: "Practice Problems",
    label: "Chapter-wise questions, PYQs and custom practice sets.",
    href: "/problems",
  },
  {
    icon: GraduationCap,
    title: "College Predictor",
    label: "See which IITs, NITs and IIITs you can realistically get, based on real JoSAA data.",
    href: "/college-predictor",
  },
  {
    icon: ArrowRightLeft,
    title: "Percentile to Rank",
    label: "Convert your JEE Main percentile into an estimated rank instantly.",
    href: "/percentile-to-rank",
  },
  {
    icon: Swords,
    title: "Challenges & Duels",
    label: "Challenge another aspirant to a live 1-on-1 question battle.",
    href: "/duel",
  },
];


// Urgent inside the last hour — the display switches to m/s precision
// there so the banner visibly ticks down rather than sitting on one value.
const URGENT_MS = 60 * 60 * 1000;

function useCountdown(resetAt) {
  const [state, setState] = useState({ label: "", urgent: false });

  useEffect(() => {
    function update() {
      const diff = new Date(resetAt).getTime() - Date.now();
      if (diff <= 0) {
        setState({ label: "New question soon", urgent: true });
        return;
      }
      const urgent = diff < URGENT_MS;
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setState({
        label: urgent ? `${m}m ${s}s` : `${h}h ${m}m`,
        urgent,
      });
    }
    // Ticking every second is cheap for a single homepage timer, and it's
    // what makes the last hour actually feel like it's counting down
    // instead of just occasionally jumping.
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, [resetAt]);

  return state;
}

export default function HeroContent({ question, resetAt, solvers, solversCount }) {
  const { label: timeLeft, urgent: timeUrgent } = useCountdown(resetAt);

  // Describes what the product does, not a headcount we don't have yet.
  const featureRow = [
    {
      icon: Zap,
      title: "Real JEE questions",
      label: "PYQs & high-quality practice",
    },
    {
      icon: BarChart3,
      title: "Track your progress",
      label: "See real improvement",
    },
    {
      icon: Target,
      title: "Build exam confidence",
      label: "One question at a time",
    },
    {
      icon: Users,
      title: "Compete & climb",
      label: "Leaderboards & duels",
    },
  ];

  return (
    <section className="bg-background pt-8 pb-16 sm:pt-16 sm:pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 sm:mb-6 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-amber-500"
        >
          Built for JEE Main & JEE Advanced Aspirants
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Ace Your Next JEE Attempt.
          <span className="block mt-1 sm:mt-2">
            <span className="text-amber-400">Rank Up.</span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
        >
          Practice real questions, get instant feedback, and track your
          progress with a platform built by JEE aspirants, for JEE aspirants.
        </motion.p>

        {/* The live daily question, front and center — this is the product,
            not a screenshot of it. Hand-drawn callouts point at the two
            halves (question / answer+solve) on wide screens only, since
            they're positioned relative to space this card doesn't have on
            mobile. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mt-10 sm:mt-12 w-full max-w-3xl mx-auto text-left"
        >
          {question ? (
            <Card className="border-amber-400/30 bg-card overflow-hidden p-0">
              {/* Tags + countdown */}
              <div className="flex items-center justify-between gap-3 px-5 sm:px-6 pt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-border bg-background text-foreground">
                    {question.subject}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      DIFFICULTY_TONE[question.difficulty] ??
                      "text-muted-foreground bg-muted border-border"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </div>
                <span
                  className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold whitespace-nowrap ${
                    timeUrgent
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <Clock
                    size={14}
                    className={timeUrgent ? "animate-pulse" : ""}
                  />
                  Expires in {timeLeft}
                </span>
              </div>

              {/* Question | Options */}
              <div
                className={`grid grid-cols-1 gap-5 sm:gap-6 px-5 sm:px-6 py-5 ${
                  question.options?.length > 0 ? "lg:grid-cols-[1fr_260px]" : ""
                }`}
              >
                <MarkdownRenderer className="text-sm">
                  {question.question}
                </MarkdownRenderer>

                {question.options?.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {question.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground"
                      >
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-background border border-border text-[11px] font-bold shrink-0">
                          {opt.id}
                        </span>
                        <MarkdownRenderer inline>{opt.text}</MarkdownRenderer>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Solved by / Solve */}
              <div className="flex items-center justify-between gap-3 px-5 sm:px-6 pb-5">
                <div>
                  {solvers?.length > 0 && (
                    <SolversStack
                      solvers={solvers}
                      totalCount={solversCount}
                    />
                  )}
                </div>
                <Link
                  href={question.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-bold text-amber-500 hover:text-amber-400 shrink-0"
                >
                  Solve
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="border-border bg-card flex items-center justify-center p-6">
              <p className="text-sm text-muted-foreground">
                Today's challenge is being set up — check back soon.
              </p>
            </Card>
          )}

          {question && (
            <>
              <div
                className={`hidden xl:block absolute -left-40 top-16 w-32 text-amber-500 ${caveat.className}`}
              >
                <svg
                  width="70"
                  height="50"
                  viewBox="0 0 70 50"
                  fill="none"
                  className="mb-1"
                >
                  <path
                    d="M5 5 Q 10 40 60 42"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M50 34 L61 43 L48 47"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-xl leading-snug">Real JEE questions</p>
              </div>

              <div
                className={`hidden xl:block absolute -right-36 top-1/3 w-32 text-amber-500 ${caveat.className}`}
              >
                <svg
                  width="60"
                  height="50"
                  viewBox="0 0 60 50"
                  fill="none"
                  className="mb-1"
                >
                  <path
                    d="M55 5 Q 50 30 8 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M18 30 L7 41 L20 46"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-xl leading-snug">
                  Practice
                  <br />
                  Get better
                  <br />
                  Rank up
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Feature row — what the product does, not a headcount */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 sm:mt-20 w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featureRow.map(({ icon: Icon, title, label }) => (
              <div
                key={title}
                className="flex items-center gap-3 justify-center sm:justify-start"
              >
                <div className="flex items-center justify-center h-11 w-11 rounded-full bg-amber-400/10 border border-amber-400/30 shrink-0">
                  <Icon size={18} className="text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA — after the demo and the feature row, not before them */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 sm:mt-12 w-full sm:w-auto"
        >
          <Link href="/problems" className="block w-full sm:w-auto">
            <Button
              size="lg"
              className="rounded-full px-8 gap-2 h-12 text-base bg-amber-400 text-black hover:bg-amber-300 cursor-pointer w-full sm:w-auto"
            >
              Start Solving Now
              <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>

        {/* Honest tagline — no invented headcount, just an invitation to be early */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground"
        >
          🚀 Just launched — be one of the first on the leaderboard
        </motion.p>

        {/* Everything you need — real features, every one of them a real link */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 sm:mt-24 w-full text-left"
        >
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500">
              How It Works
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Four Ways to Prepare for JEE.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md">
              Focused practice, real data and a leaderboard that keeps you
              honest — all in one place.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exploreCards.map(({ icon: Icon, title, label, href }, i) => (
              <Link
                key={title}
                href={href}
                className="group relative rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 transition-colors hover:border-amber-400/50"
              >
                <span className="absolute top-4 right-5 text-2xl font-bold text-muted-foreground/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="rounded-xl bg-amber-400/10 border border-amber-400/30 p-2.5 w-fit">
                  <Icon size={18} className="text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {label}
                </p>
                <span className="text-xs font-semibold text-amber-500 inline-flex items-center gap-1">
                  Explore
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA — honest framing, same rule as the row above: no
            invented headcounts, just an invitation to be early */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 sm:mt-16 w-full"
        >
          <div className="rounded-2xl sm:rounded-3xl border border-amber-400/30 bg-amber-400/[0.06] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                Your JEE journey starts here
              </p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Solve a question. Get one step closer.
              </h3>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-full px-8 gap-2 h-12 text-base bg-amber-400 text-black hover:bg-amber-300 cursor-pointer"
                >
                  Create Your Free Account
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                🚀 Just launched — be one of the first on the leaderboard
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
