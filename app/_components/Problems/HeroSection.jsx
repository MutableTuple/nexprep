"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/button";
import { Flame, Target, Trophy, LogIn } from "lucide-react";
import { useUserId } from "@/app/_lib/AuthProvider";
import { getUserStats } from "@/app/_lib/data-service";

export default function HeroSection() {
  const { userId, loading: authLoading } = useUserId();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setStats(null);
      setStatsLoading(false);
      return;
    }

    let cancelled = false;
    setStatsLoading(true);

    getUserStats(userId)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        console.error("Failed to load user stats:", err);
        if (!cancelled) setStats(null);
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  const isLoading = authLoading || statsLoading;
  const streak = stats?.streak ?? 0;
  const solved = stats?.solved_questions ?? 0;
  const xp = stats?.xp ?? 0;

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Practice
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Problems
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-sm sm:text-base">
              Master JEE by solving curated questions from every chapter. Build
              streaks, earn XP and improve your rank.
            </p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                icon={<Flame size={20} />}
                label="Current Streak"
                value="…"
              />
              <StatCard icon={<Target size={20} />} label="Solved" value="…" />
              <StatCard icon={<Trophy size={20} />} label="XP" value="…" />
            </div>
          ) : userId ? (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                icon={<Flame size={20} />}
                label="Current Streak"
                value={`${streak} Day${streak === 1 ? "" : "s"}`}
              />
              <StatCard
                icon={<Target size={20} />}
                label="Solved"
                value={solved.toLocaleString()}
              />
              <StatCard
                icon={<Trophy size={20} />}
                label="XP"
                value={xp.toLocaleString()}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 px-5 py-4">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  Track your streak, XP, and rank
                </p>
                <p className="text-xs text-muted-foreground">
                  Sign in to save your progress as you solve.
                </p>
              </div>
              <Button
                size="sm"
                className="ml-2 gap-1.5 rounded-xl shrink-0"
                asChild
              >
                <Link href="/login">
                  <LogIn size={14} />
                  Log in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
