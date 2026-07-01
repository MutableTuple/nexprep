"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Flame, Zap } from "lucide-react";
import { useState } from "react";

const PERIODS = ["This week", "This month", "All time"];

const USERS = [
  {
    rank: 1,
    init: "AR",
    name: "Arjun Reddy",
    college: "IIT Bombay",
    xp: 6150,
    streak: 14,
  },
  {
    rank: 2,
    init: "PK",
    name: "Priya Krishnan",
    college: "BITS Pilani",
    xp: 4820,
    streak: 9,
  },
  {
    rank: 3,
    init: "SM",
    name: "Sneha Mehta",
    college: "NIT Trichy",
    xp: 3990,
    streak: 7,
  },
  {
    rank: 4,
    init: "VN",
    name: "Vivek Nair",
    college: "IIT Delhi",
    xp: 3540,
    streak: 5,
  },
  {
    rank: 5,
    init: "RP",
    name: "Rohan Patel",
    college: "VIT Vellore",
    xp: 3210,
    streak: 12,
  },
  {
    rank: 6,
    init: "AS",
    name: "Ananya Singh",
    college: "IIT Madras",
    xp: 2980,
    streak: 3,
  },
  {
    rank: 7,
    init: "KG",
    name: "Karan Gupta",
    college: "NIT Surathkal",
    xp: 2750,
    streak: 6,
  },
  {
    rank: 8,
    init: "YS",
    name: "You",
    college: "Your College",
    xp: 2480,
    streak: 4,
    me: true,
  },
  {
    rank: 9,
    init: "DM",
    name: "Dev Malhotra",
    college: "BITS Goa",
    xp: 2200,
    streak: 2,
  },
  {
    rank: 10,
    init: "TP",
    name: "Tanvi Pillai",
    college: "IIT Hyderabad",
    xp: 1980,
    streak: 8,
  },
];

const AVATAR_COLORS = [
  "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  "bg-pink-50 text-pink-800 dark:bg-pink-950/40 dark:text-pink-300",
  "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  "bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  "bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
  "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
];

const RANK_MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };
const PODIUM_ORDER = [1, 0, 2];
const podiumHeight = { 0: "h-20", 1: "h-14", 2: "h-10" };

export default function LeaderboardPage() {
  const [period, setPeriod] = useState(0);
  const top3 = USERS.slice(0, 3);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Top solvers ranked by XP earned
          </p>
        </div>

        {/* Period tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit mb-8">
          {PERIODS.map((p, i) => (
            <button
              key={p}
              onClick={() => setPeriod(i)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === i
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {PODIUM_ORDER.map((idx) => {
            const u = top3[idx];
            const isFirst = idx === 0;
            return (
              <div key={u.rank} className="flex flex-col items-center gap-2">
                {isFirst && <span className="text-2xl">👑</span>}
                <div
                  className={`rounded-full flex items-center justify-center font-semibold border-2 ${AVATAR_COLORS[idx]} ${
                    isFirst
                      ? "w-16 h-16 text-lg border-amber-300"
                      : "w-12 h-12 text-sm border-border"
                  }`}
                >
                  {u.init}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold truncate max-w-[76px]">
                    {u.name.split(" ")[0]}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {u.xp.toLocaleString()} XP
                  </p>
                </div>
                <div
                  className={`w-20 rounded-t-xl flex items-center justify-center font-bold text-sm ${podiumHeight[idx]} ${
                    isFirst
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1">
            Rankings
          </p>

          {USERS.map((u, i) => (
            <Card
              key={u.rank}
              className={`px-4 py-3.5 ${u.me ? "border-primary/30 bg-primary/[0.03]" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-7 shrink-0 flex items-center justify-center">
                  {u.rank <= 3 ? (
                    <span className="text-base leading-none">
                      {RANK_MEDAL[u.rank]}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {u.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${AVATAR_COLORS[i]}`}
                >
                  {u.init}
                </div>

                {/* Name + college */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold leading-tight">
                      {u.name}
                    </span>
                    {u.me && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 px-1.5 py-0 text-primary border-primary/30 leading-none"
                      >
                        you
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {u.college}
                  </p>
                </div>

                {/* Streak */}
                {u.streak >= 4 && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 rounded-lg px-2.5 py-1 shrink-0">
                    <Flame size={12} />
                    {u.streak}
                  </div>
                )}

                {/* XP */}
                <div className="flex items-center gap-1 text-sm font-bold tabular-nums shrink-0">
                  <Zap size={14} className="text-yellow-500 shrink-0" />
                  {u.xp.toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
