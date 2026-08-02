"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock3,
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserId } from "@/app/_lib/AuthProvider";
import { trackEvent } from "@/app/_lib/analytics";
import InlineAnswerPanel from "./InlineAnswerPanel";

const DIFFICULTY_STYLES = {
  Easy: "bg-muted text-muted-foreground hover:bg-muted",
  Medium: "bg-primary text-primary-foreground hover:bg-primary",
  Hard: "bg-foreground text-background hover:bg-foreground",
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
  question,
  options,
  correctOption,
  correctValue,
  tolerance,
  unit,
  questionType,
  defaultExpanded = false,
}) {
  const { userId } = useUserId();
  const [expanded, setExpanded] = useState(defaultExpanded);

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    trackEvent("question_card_expand_toggled", {
      question_id: id,
      subject,
      difficulty,
      expanded: next,
    });
  }

  // Optimistic override so the header badge/footer reflect an inline solve
  // immediately, without waiting on the parent list to refetch.
  const [override, setOverride] = useState(null);

  const effectiveSolved = override ? true : solved;
  const effectiveSolvedCorrect = override ? override.isCorrect : solvedCorrect;
  const effectiveXpEarned = override ? override.xpEarned : xpEarned;
  const effectiveAttemptsCount = override ? override.attempts : attemptsCount;

  const fallbackHref = `/problems/solve/${title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;
  const resolvedHref = href ?? fallbackHref;

  return (
    <Card className="rounded-3xl border-border p-0 shadow-none transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <Link href={resolvedHref} className="group block w-full text-left">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Badge
                className={cn(
                  "rounded-full text-[11px] font-semibold",
                  DIFFICULTY_STYLES[difficulty],
                )}
              >
                {difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground">{subject}</span>
            </div>

            <div className="flex items-center gap-2">
              {effectiveSolved &&
                (effectiveSolvedCorrect ? (
                  <CheckCircle2 size={17} className="text-green-500" />
                ) : (
                  <XCircle size={17} className="text-red-500" />
                ))}
              {bookmarked && (
                <Bookmark
                  size={17}
                  className="fill-foreground text-foreground"
                />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {title}
          </h2>

          {/* Chapter */}
          <p className="mt-2 text-sm text-muted-foreground">{chapter}</p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              {time}
            </div>
            <span className="font-semibold text-foreground">
              +{effectiveSolved ? effectiveXpEarned : xp} XP
            </span>
            {effectiveSolved ? (
              <span>
                {effectiveAttemptsCount} attempt
                {effectiveAttemptsCount === 1 ? "" : "s"}
              </span>
            ) : (
              <span>
                {totalAttempts > 0
                  ? `${totalAttempts} attempt${totalAttempts === 1 ? "" : "s"}`
                  : "Be the first to solve"}
              </span>
            )}
          </div>
        </Link>

        <Separator className="mt-6" />
        <div className="flex items-center justify-between pt-5">
          <Link
            href={resolvedHref}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {effectiveSolved ? (
              effectiveSolvedCorrect ? (
                <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 size={18} />
                  Solved correctly
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-500 dark:text-red-400">
                  <XCircle size={18} />
                  Attempted · Incorrect
                </span>
              )
            ) : (
              "Start Challenge"
            )}
            <ChevronRight size={18} />
          </Link>

          <button
            onClick={toggleExpanded}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {expanded ? "Hide" : "Solve here"}
            <ChevronDown
              size={16}
              className={cn("transition-transform", expanded && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t px-6 py-6">
          <InlineAnswerPanel
            question={question}
            userId={userId}
            questionId={id}
            subject={subject}
            difficulty={difficulty}
            questionType={questionType}
            options={options}
            correctOption={correctOption}
            correctValue={correctValue}
            tolerance={tolerance}
            unit={unit}
            xp={xp}
            attemptsCount={effectiveAttemptsCount}
            alreadySolved={effectiveSolved}
            alreadyCorrect={effectiveSolvedCorrect}
            onSolved={setOverride}
          />
        </div>
      )}
    </Card>
  );
}
