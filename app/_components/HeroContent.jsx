"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Zap,
  Trophy,
  Clock,
  Star,
  Calendar,
  Swords,
  Target,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const DIFFICULTY_STARS = { Easy: 2, Medium: 3, Hard: 5 };

const features = [
  {
    icon: Calendar,
    value: "Daily Challenge",
    label: "A new JEE question every day to test your skills",
  },
  {
    icon: Swords,
    value: "Compete & Rank",
    label: "See where you stand against aspirants across India",
  },
  {
    icon: Target,
    value: "Streaks & XP",
    label: "Build consistency, earn XP and unlock achievements",
  },
  {
    icon: Gift,
    value: "100% Free",
    label: "All features free forever. No credit card required",
  },
];

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

// The classic "who's here" overlapping avatar stack (Linear, Notion, Figma,
// ...) — each avatar overlaps the previous one, links to that person's
// profile, and shows their name on hover.
function SolversStack({ solvers, totalCount }) {
  if (!solvers?.length) return null;
  const extra = totalCount - solvers.length;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {solvers.map((s) =>
            s.username ? (
              <Tooltip key={s.userId}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/user/${s.username}/profile`}
                    className="transition-transform hover:z-10 hover:-translate-y-0.5"
                  >
                    <Avatar className="h-7 w-7 border-2 border-background">
                      <AvatarImage src={s.avatarUrl || undefined} alt={s.name} />
                      <AvatarFallback className="text-[10px] bg-muted">
                        {getInitials(s.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{s.name}</TooltipContent>
              </Tooltip>
            ) : (
              <Avatar
                key={s.userId}
                className="h-7 w-7 border-2 border-background"
              >
                <AvatarImage src={s.avatarUrl || undefined} alt={s.name} />
                <AvatarFallback className="text-[10px] bg-muted">
                  {getInitials(s.name)}
                </AvatarFallback>
              </Avatar>
            ),
          )}
          {extra > 0 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground">
              +{extra}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {totalCount === 1 ? "1 person has" : `${totalCount} people have`}{" "}
          solved this
        </span>
      </div>
    </TooltipProvider>
  );
}

function useCountdown(resetAt) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(resetAt).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("New question soon");
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setLabel(`${h}h ${m}m`);
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [resetAt]);

  return label;
}

export default function HeroContent({
  question,
  leaderboard,
  resetAt,
  questionCount,
  solvers,
  solversCount,
}) {
  const timeLeft = useCountdown(resetAt);

  // round down so the claim never overstates and rarely needs touching
  const questionsAvailable = Math.floor(questionCount / 50) * 50;

  const performers = (leaderboard ?? []).map((row) => ({
    name: row.profiles?.display_name || row.profiles?.username || "Anonymous",
    xp: row.xp ?? 0,
  }));

  return (
    <section className="bg-background pt-8 pb-16 sm:pt-16 sm:pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-6 sm:mb-8 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium gap-2 border-border bg-card h-auto"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            India's Most Gamified JEE Platform
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Solve 1 JEE Question Every Day.
          <span className="block mt-1 sm:mt-2">
            Compete. Improve. <span className="text-amber-400">Rank Up.</span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
        >
          Join thousands of JEE aspirants building consistency, earning XP and
          climbing the national leaderboard.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link href="/problems" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="rounded-full px-8 gap-2 h-12 text-base bg-amber-400 text-black hover:bg-amber-300 cursor-pointer w-full sm:w-auto"
            >
              Start Practicing
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/duel" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 gap-2 h-12 text-base w-full sm:w-auto"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Battle another JEE student live
              <Swords size={16} />
            </Button>
          </Link>
        </motion.div>

        {/* Honest framing row — no fake student counts, only real ones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-5 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground"
        >
          <span>
            🚀{" "}
            <span className="font-semibold text-foreground">Just launched</span>{" "}
            — be one of the first on the leaderboard
          </span>
          {questionsAvailable > 0 && (
            <>
              <span className="hidden sm:inline text-border">|</span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                {questionsAvailable}+ questions available. updated daily
              </span>
            </>
          )}
        </motion.div>

        {/* Today's Challenge + Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 text-left"
        >
          {/* Today's Challenge — real question, or hidden if none available */}
          {question ? (
            <Card className="border-amber-400/30 bg-amber-400/[0.03] overflow-hidden relative">
              <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                  <Flame className="h-3.5 w-3.5" />
                  TODAY'S CHALLENGE
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {question.subject}
                  </p>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">
                    {question.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                    <span>Difficulty:</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < (DIFFICULTY_STARS[question.difficulty] ?? 3)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }
                        />
                      ))}
                    </span>
                  </div>
                </div>

                {solvers?.length > 0 && (
                  <SolversStack solvers={solvers} totalCount={solversCount} />
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} />
                    <span>
                      <strong className="text-foreground">{question.xp}</strong>{" "}
                      XP reward
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>
                      <strong className="text-foreground">{timeLeft}</strong>{" "}
                      until next question
                    </span>
                  </span>
                </div>

                <Link href={question.href} className="self-start">
                  <Button className="rounded-xl gap-1.5 bg-amber-400 text-black hover:bg-amber-300">
                    Solve Now
                    <ArrowRight size={14} />
                  </Button>
                </Link>

                <Zap className="absolute right-4 bottom-4 h-16 w-16 text-amber-400/10 rotate-6 pointer-events-none" />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card flex items-center justify-center p-6">
              <p className="text-sm text-muted-foreground">
                Today's challenge is being set up — check back soon.
              </p>
            </Card>
          )}

          {/* Top Performers — real leaderboard, however sparse it is right now */}
          <Card className="border-amber-400/30 bg-amber-400/[0.03]">
            <CardContent className="p-5 sm:p-6 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                <Trophy className="h-3.5 w-3.5" />
                TOP PERFORMERS
              </div>
              {performers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-6">
                  <p className="text-sm text-muted-foreground text-center">
                    No one's on the board yet —{" "}
                    <Link
                      href="/question-of-the-day"
                      className="text-foreground underline underline-offset-4"
                    >
                      be the first
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {performers.map((p, i) => (
                    <div
                      key={p.name + i}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <span className="text-xs font-semibold text-muted-foreground w-4">
                        {i + 1}
                      </span>
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] bg-muted">
                          {getInitials(p.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground flex-1 truncate">
                        {p.name}
                      </span>
                      <span className="text-sm font-bold text-amber-500">
                        XP {p.xp.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 w-full"
        >
          <Card className="w-full border-border shadow-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {features.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={value}
                    className="flex flex-col items-center justify-center py-6 px-4 relative"
                  >
                    {i !== 0 && (
                      <div className="absolute left-0 top-1/4 h-1/2 w-px bg-border" />
                    )}
                    {i >= 2 && (
                      <div className="absolute top-0 left-1/4 w-1/2 h-px bg-border sm:hidden" />
                    )}
                    <Icon className="h-5 w-5 text-muted-foreground mb-2" />
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      {value}
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
