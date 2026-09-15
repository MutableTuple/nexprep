"use client";

import Link from "next/link";
import {
  Clock3,
  Timer,
  Bookmark,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BarChart3,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserId } from "@/app/_lib/AuthProvider";
import MarkdownRenderer from "../MarkdownRenderer";
import SolversStack from "../SolversStack";

// Split-layout question card — the whole thing works as one big
// "your next challenge" hero:
//   Left  = eyebrow label + tags + title + chapter + meta + CTAs
//   Right = rendered question preview + a small motivational line
// On mobile the two halves stack (preview under the CTA row).

// Monotone chip — same neutral surface for every subject / difficulty.
// A tiny colored dot in front of the difficulty text is the only hint
// of severity; subjects get no color at all. Keeps the card calm.
const CHIP_STYLE =
  "bg-muted text-foreground hover:bg-muted border border-border";
const DIFFICULTY_DOT = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

function formatAvgTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function QuestionCard({
  id,
  href,
  title = "Maximum Subarray Sum",
  difficulty = "Medium",
  subject = "Mathematics",
  chapter = "Sequences & Series",
  time = "4 min",
  xp = 150,
  solved = false,
  solvedCorrect = null,
  xpEarned = 0,
  attemptsCount = 0,
  bookmarked = false,
  totalAttempts = 0,
  correctAttempts = 0,
  question,
  // Fetched once for the whole page (see ProblemScreen), not per card —
  // solverStats is undefined until that batched call resolves.
  solverStats,
  statsLoading = false,
}) {
  const { userId } = useUserId();

  const fallbackHref = `/problems/solve/${(title ?? "question")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;
  const resolvedHref = href ?? fallbackHref;

  return (
    <Card className="overflow-hidden rounded-3xl border-border p-0 shadow-none transition-all duration-300 hover:shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ── Left: rendered preview ── */}
        <div className="bg-muted/25 p-6 lg:p-8 flex items-center min-h-[220px] order-1">
          <div className="text-[15px] leading-7 text-foreground italic max-h-[220px] overflow-hidden [&_p]:!my-0 [&_p]:!leading-7">
            {question ? (
              <MarkdownRenderer>{question}</MarkdownRenderer>
            ) : (
              <span className="text-muted-foreground not-italic">
                Preview unavailable — tap Solve to open the question.
              </span>
            )}
          </div>
        </div>

        {/* ── Right: hero copy + CTAs ── */}
        <div className="border-t lg:border-t-0 lg:border-l border-border p-6 lg:p-8 flex flex-col order-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Your next challenge
          </span>

          {/* Tag row — monotone chips, colored dot only for
              difficulty severity. */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "rounded-full text-[11px] font-semibold",
                CHIP_STYLE,
              )}
            >
              {subject}
            </Badge>
            <Badge
              className={cn(
                "rounded-full text-[11px] font-semibold gap-1.5",
                CHIP_STYLE,
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  DIFFICULTY_DOT[difficulty] ?? "bg-muted-foreground",
                )}
              />
              {difficulty}
            </Badge>
            {solved && (
              <Badge
                className={cn(
                  "rounded-full text-[11px] font-semibold gap-1",
                  CHIP_STYLE,
                )}
              >
                {solvedCorrect ? (
                  <CheckCircle2 size={11} className="text-emerald-500" />
                ) : (
                  <XCircle size={11} className="text-red-500" />
                )}
                {solvedCorrect ? "Solved" : "Attempted"}
              </Badge>
            )}
            {bookmarked && (
              <Bookmark
                size={13}
                className="fill-foreground text-foreground ml-1"
              />
            )}
          </div>

          {/* Title + chapter */}
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{chapter}</p>

          {/* Meta strip — accuracy and avg time are more meaningful than
              raw attempt count, and both are hidden until real data exists
              rather than showing a placeholder. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              Est. {time}
            </span>
            {statsLoading && !solverStats ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              solverStats?.avgTimeSeconds != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Timer size={14} />
                  Avg {formatAvgTime(solverStats.avgTimeSeconds)}/user
                </span>
              )
            )}
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="fill-orange-400 text-orange-400" />
              <span className="font-semibold text-foreground">
                +{solved ? xpEarned : xp} XP
              </span>
            </span>
            {totalAttempts > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 size={14} />
                {Math.round((correctAttempts / totalAttempts) * 100)}% accuracy
              </span>
            )}
          </div>

          {/* Real solvers only — renders nothing once loaded if nobody has */}
          {statsLoading && !solverStats ? (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                <Skeleton className="h-7 w-7 rounded-full border-2 border-background" />
                <Skeleton className="h-7 w-7 rounded-full border-2 border-background" />
              </div>
              <Skeleton className="h-3.5 w-28" />
            </div>
          ) : (
            solverStats?.solvers?.length > 0 && (
              <div className="mt-4">
                <SolversStack
                  solvers={solverStats.solvers}
                  totalCount={solverStats.totalCount}
                />
              </div>
            )
          )}

          {/* CTA */}
          <div className="mt-6">
            <Button
              asChild
              className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[13px] px-5 py-5 h-auto gap-2"
            >
              <Link href={resolvedHref}>
                SOLVE THIS QUESTION
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </Card>
  );
}
