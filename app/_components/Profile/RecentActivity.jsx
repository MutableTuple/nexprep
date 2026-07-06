"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserId } from "@/app/_lib/AuthProvider";
import { listSolvedQuestionsByUser } from "@/app/_lib/data-service";

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function GhostRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="h-3.5 w-40 rounded bg-muted animate-pulse" />
        <div className="h-3 w-20 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="h-3 w-12 rounded bg-muted animate-pulse" />
        <div className="h-2.5 w-10 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export default function RecentActivity() {
  const { userId, loading: authLoading } = useUserId();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setActivity([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    listSolvedQuestionsByUser(userId, { page: 1, pageSize: 5 })
      .then((rows) => {
        if (cancelled) return;
        setActivity(
          rows.map((row) => ({
            id: row.id,
            title:
              row.questions?.topic ||
              row.questions?.chapter ||
              row.questions?.question_text?.slice(0, 60) ||
              "Question",
            subject: row.questions?.subject ?? "—",
            xp: row.xp_earned ?? 0,
            time: formatRelativeTime(row.solved_at),
            correct: row.is_correct,
          })),
        );
      })
      .catch((err) => {
        console.error("Failed to load recent activity:", err);
        if (!cancelled) setActivity([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  return (
    <Card className="bg-card border-border shadow-none rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h3>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <GhostRow />
              {i < 4 && <Separator />}
            </div>
          ))
        ) : !userId ? (
          <p className="py-8 px-6 text-center text-sm text-muted-foreground">
            Sign in to see your recent activity.
          </p>
        ) : activity.length === 0 ? (
          <p className="py-8 px-6 text-center text-sm text-muted-foreground">
            No problems solved yet — start solving to see your activity here.
          </p>
        ) : (
          activity.map((item, i) => (
            <div key={item.id}>
              <div className="flex items-center gap-4 px-6 py-4">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    item.correct
                      ? "bg-green-100 dark:bg-green-950/40"
                      : "bg-red-100 dark:bg-red-950/40",
                  )}
                >
                  <CheckCircle2
                    size={15}
                    className={item.correct ? "text-green-600" : "text-red-500"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.subject}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-foreground">
                    +{item.xp} XP
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.time}
                  </p>
                </div>
              </div>
              {i < activity.length - 1 && <Separator />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
