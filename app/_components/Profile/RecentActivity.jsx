import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, TrendingUp } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
const RECENT_ACTIVITY = [
  {
    id: 1,
    title: "Roots of Quadratic Equation",
    subject: "Mathematics",
    xp: 100,
    time: "2h ago",
    correct: true,
  },
  {
    id: 2,
    title: "Standard Limits",
    subject: "Mathematics",
    xp: 100,
    time: "2h ago",
    correct: false,
  },
  {
    id: 3,
    title: "Basic Derivatives",
    subject: "Mathematics",
    xp: 100,
    time: "3h ago",
    correct: true,
  },
  {
    id: 4,
    title: "Basic Probability",
    subject: "Mathematics",
    xp: 100,
    time: "5h ago",
    correct: true,
  },
  {
    id: 5,
    title: "Determinants",
    subject: "Mathematics",
    xp: 100,
    time: "1d ago",
    correct: true,
  },
];

export default function RecentActivity() {
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
        {RECENT_ACTIVITY.map((item, i) => (
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
            {i < RECENT_ACTIVITY.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
