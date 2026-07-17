"use client";

import Link from "next/link";
import {
  Clock3,
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DIFFICULTY_STYLES = {
  Easy: "bg-muted text-muted-foreground hover:bg-muted",
  Medium: "bg-primary text-primary-foreground hover:bg-primary",
  Hard: "bg-foreground text-background hover:bg-foreground",
};

export default function QuestionCard({
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
  questions = 18,
}) {
  const fallbackHref = `/problems/solve/${title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

  return (
    <Card className="rounded-3xl border-border p-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={href ?? fallbackHref}
        className="group block w-full p-6 text-left"
      >
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
            {solved &&
              (solvedCorrect ? (
                <CheckCircle2 size={17} className="text-green-500" />
              ) : (
                <XCircle size={17} className="text-red-500" />
              ))}
            {bookmarked && (
              <Bookmark size={17} className="fill-foreground text-foreground" />
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
            +{solved ? xpEarned : xp} XP
          </span>
          {solved ? (
            <span>
              {attemptsCount} attempt{attemptsCount === 1 ? "" : "s"}
            </span>
          ) : (
            <span>{questions} attempts</span>
          )}
        </div>

        {/* Footer */}
        <Separator className="mt-6" />
        <div className="flex items-center justify-between pt-5">
          {solved ? (
            solvedCorrect ? (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 size={18} />
                Solved correctly
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-red-500 dark:text-red-400">
                <XCircle size={18} />
                Attempted · Incorrect
              </div>
            )
          ) : (
            <span className="text-sm text-muted-foreground">
              Start Challenge
            </span>
          )}
          <ChevronRight
            size={18}
            className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </Link>
    </Card>
  );
}
