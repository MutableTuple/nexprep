"use client";

import Link from "next/link";
import {
  Clock3,
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
import { useUserId } from "@/app/_lib/AuthProvider";
import MarkdownRenderer from "../MarkdownRenderer";

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
        {/* ── Left: hero copy + CTAs ── */}
        <div className="p-6 lg:p-8 flex flex-col">
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

          {/* Meta strip — accuracy is more meaningful than raw
              attempt count. Hidden entirely when nobody's tried yet. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="fill-orange-400 text-orange-400" />
              <span className="font-semibold text-foreground">
                +{solved ? xpEarned : xp} XP
              </span>
            </span>
            {totalAttempts > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 size={14} />
                {Math.round((correctAttempts / totalAttempts) * 100)}% solve rate
              </span>
            )}
          </div>

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

        {/* ── Right: rendered preview ── */}
        <div className="border-t lg:border-t-0 lg:border-l border-border bg-muted/25 p-6 lg:p-8 flex items-center min-h-[220px]">
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
      </div>
    </Card>
  );
}
