"use client";

import { useCallback, useEffect, useState } from "react";
import { Target, CalendarDays, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserGoals, getStudyProgress } from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";
import { fireRibbonRain } from "@/app/_lib/confetti";
import {
  hasCelebratedGoal,
  markGoalCelebrated,
} from "@/app/_lib/goal-celebration";

const DEFAULT_DAILY_GOAL = 20; // matches user_goals.daily_questions column default
const DEFAULT_WEEKLY_GOAL = 150; // matches user_goals.weekly_questions column default

// Temporary debug hook — open DevTools console on /problems and run
// window.__testRibbonRain() to fire the effect directly, bypassing goal
// data entirely. Confirms whether it's a rendering issue vs a data issue.
if (typeof window !== "undefined") {
  window.__testRibbonRain = fireRibbonRain;
}

function GoalRow({ icon: Icon, label, done, target, reached }) {
  const pct = target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0;
  return (
    <div className="flex-1">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Icon size={14} className="text-muted-foreground" />
          {label}
        </span>
        <span
          className={cn(
            "flex items-center gap-1 font-medium",
            reached
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground",
          )}
        >
          {reached && <PartyPopper size={13} />}
          {done} / {target}
        </span>
      </div>
      <Progress
        value={pct}
        className={reached ? "[&>div]:bg-green-500" : undefined}
      />
    </div>
  );
}

export default function GoalsProgress({ userId }) {
  const [goals, setGoals] = useState(null);
  const [progress, setProgress] = useState(null);

  const refresh = useCallback((forUserId) => {
    if (!forUserId) return;
    Promise.all([getUserGoals(forUserId), getStudyProgress(forUserId)]).then(
      ([goalsData, progressData]) => {
        setGoals(goalsData);
        setProgress(progressData);
      },
    );
  }, []);

  // Fetch on mount, and again whenever the tab regains focus — otherwise a
  // user who solves questions on /problems/solve/... and navigates back
  // here can see stale progress from before those solves, since Next's
  // client-side router cache doesn't guarantee a fresh mount.
  useEffect(() => {
    refresh(userId);

    function onFocus() {
      refresh(userId);
    }
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [userId, refresh]);

  const dailyGoal = goals?.daily_questions ?? DEFAULT_DAILY_GOAL;
  const weeklyGoal = goals?.weekly_questions ?? DEFAULT_WEEKLY_GOAL;
  const dailyReached = !!progress && progress.today >= dailyGoal;
  const weeklyReached = !!progress && progress.week >= weeklyGoal;

  // Celebrate at most once per period — the first time this component sees
  // the goal already met, not on every render or every page revisit.
  useEffect(() => {
    if (!userId || !dailyReached) return;
    if (hasCelebratedGoal(userId, "daily")) return;

    try {
      fireRibbonRain();
      showToast.goal(
        "Daily goal reached!",
        `You solved ${progress.today} questions today.`,
      );
      markGoalCelebrated(userId, "daily"); // only after it actually fired —
      // marking it first would permanently suppress retries if this threw
    } catch (err) {
      console.error("Failed to fire daily goal celebration:", err);
    }
  }, [userId, dailyReached, progress?.today]);

  useEffect(() => {
    if (!userId || !weeklyReached) return;
    if (hasCelebratedGoal(userId, "weekly")) return;

    try {
      fireRibbonRain();
      showToast.goal(
        "Weekly goal reached!",
        `You solved ${progress.week} questions this week.`,
      );
      markGoalCelebrated(userId, "weekly");
    } catch (err) {
      console.error("Failed to fire weekly goal celebration:", err);
    }
  }, [userId, weeklyReached, progress?.week]);

  if (!userId || !progress) return null;

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col gap-6 py-5 sm:flex-row sm:items-center sm:gap-10">
        <GoalRow
          icon={Target}
          label="Today"
          done={progress.today}
          target={dailyGoal}
          reached={dailyReached}
        />
        <GoalRow
          icon={CalendarDays}
          label="This week"
          done={progress.week}
          target={weeklyGoal}
          reached={weeklyReached}
        />
      </CardContent>
    </Card>
  );
}
