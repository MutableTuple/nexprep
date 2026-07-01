import React from "react";
import StatCard from "./StatCard";
import { Flame, Target, Trophy } from "lucide-react";

export default function HeroSection() {
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
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={<Flame size={20} />}
              label="Current Streak"
              value="18 Days"
            />
            <StatCard
              icon={<Target size={20} />}
              label="Solved"
              value="1,248"
            />
            <StatCard icon={<Trophy size={20} />} label="XP" value="18,420" />
          </div>
        </div>
      </div>
    </div>
  );
}
