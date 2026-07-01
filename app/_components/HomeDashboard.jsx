"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Flame, Brain, BookOpen, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const dashboardVariant = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
};

// ─── SideCard ─────────────────────────────────────────────────────────────────

function SideCard({
  icon: Icon,
  iconClass,
  bob = 3,
  bobDuration = 3,
  children,
}) {
  return (
    <motion.div variants={cardVariant} whileHover={{ y: -8, scale: 1.03 }}>
      <Card className="rounded-3xl shadow-xl">
        <CardContent className="p-5 sm:p-6">
          <motion.div
            animate={{ y: [0, -bob, 0] }}
            transition={{ repeat: Infinity, duration: bobDuration }}
          >
            <Icon className={cn("mb-3 h-5 w-5", iconClass)} />
          </motion.div>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── StatTile ─────────────────────────────────────────────────────────────────

function StatTile({ icon: Icon, iconClass, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.05 }}
      className="rounded-2xl bg-white/8 p-3 sm:p-4 lg:p-5"
    >
      <Icon className={cn("mb-2 h-4 w-4 sm:h-5 sm:w-5", iconClass)} />
      <p className="text-xs sm:text-sm text-white/50">{label}</p>
      <h3 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold text-white">
        {value}
      </h3>
    </motion.div>
  );
}

// ─── HomeDashboard ────────────────────────────────────────────────────────────

export default function HomeDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-12 sm:mt-16 lg:mt-24 w-full max-w-sm sm:max-w-2xl lg:max-w-5xl xl:max-w-7xl"
    >
      <div className="grid items-center gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-[220px_1fr_220px]">
        {/* LEFT */}
        <div className="hidden xl:flex flex-col gap-5">
          <SideCard
            icon={Brain}
            iconClass="text-violet-500"
            bob={5}
            bobDuration={3}
          >
            <h3 className="text-base font-semibold text-foreground">
              Today's Challenge
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Solve 15 Physics questions to earn 300 XP.
            </p>
          </SideCard>

          <SideCard
            icon={Target}
            iconClass="text-green-500"
            bob={4}
            bobDuration={3.4}
          >
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <h2 className="mt-1.5 text-3xl font-bold text-foreground">92%</h2>
            <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-100 border-0 text-xs">
              +8% This Week
            </Badge>
          </SideCard>
        </div>

        {/* MAIN — always dark, never inherits theme */}
        <motion.div
          variants={dashboardVariant}
          whileHover={{ y: -4, scale: 1.01 }}
          className="rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] bg-zinc-950 p-5 sm:p-6 lg:p-8 shadow-[0_35px_80px_rgba(0,0,0,0.28)]"
        >
          <div className="mb-6 sm:mb-8 lg:mb-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm text-white/40">Current Rank</p>
              <h2 className="mt-1 sm:mt-2 text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                #142
              </h2>
            </div>
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="rounded-2xl sm:rounded-3xl bg-white/10 p-3 sm:p-4 lg:p-5 shrink-0"
            >
              <Trophy className="h-7 w-7 sm:h-9 sm:w-9 lg:h-11 lg:w-11 text-yellow-400" />
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-5">
            <StatTile icon={BookOpen} label="Questions" value="1,248" />
            <StatTile
              icon={Flame}
              iconClass="text-orange-400"
              label="Streak"
              value="34"
            />
            <StatTile
              icon={Star}
              iconClass="text-yellow-400"
              label="XP"
              value="18.2K"
            />
          </div>

          {/* Mobile-only summary row (xl side cards are hidden on mobile) */}
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between xl:hidden">
            {[
              { label: "Accuracy", value: "92%" },
              { label: "Leaderboard", value: "Top 6%" },
              { label: "Streak", value: "🔥 34" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[10px] text-white/40">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <div className="hidden xl:flex flex-col gap-5">
          <SideCard
            icon={Trophy}
            iconClass="text-yellow-500"
            bob={5}
            bobDuration={3.2}
          >
            <h3 className="text-base font-semibold text-foreground">
              National Leaderboard
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              You're ahead of
            </p>
            <h2 className="mt-1.5 text-3xl font-bold text-foreground">94%</h2>
            <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-100 border-0 text-xs">
              Keep going 🚀
            </Badge>
          </SideCard>

          <SideCard
            icon={Flame}
            iconClass="text-red-500"
            bob={4}
            bobDuration={2.8}
          >
            <p className="text-sm text-muted-foreground">Daily Streak</p>
            <h2 className="mt-1.5 text-3xl font-bold text-foreground">🔥 34</h2>
            <Badge className="mt-2 bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 hover:bg-orange-100 border-0 text-xs">
              Don't miss today!
            </Badge>
          </SideCard>
        </div>
      </div>
    </motion.div>
  );
}
