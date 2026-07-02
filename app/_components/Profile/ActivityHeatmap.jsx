"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKS = 53;
const DAYS = WEEKS * 7;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const HEAT_LEVELS = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
  "bg-primary",
];

function levelFor(count) {
  if (count <= 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  if (count <= 7) return 4;
  return 5;
}

function buildCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - (DAYS - 1));
  start.setDate(start.getDate() - start.getDay()); // snap back to Sunday

  const days = [];
  const cursor = new Date(start);

  for (let i = 0; i < WEEKS * 7; i++) {
    const isFuture = cursor > today;
    days.push({
      date: new Date(cursor),
      count: isFuture
        ? -1
        : Math.random() > 0.55
          ? Math.floor(Math.random() * 9)
          : 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ActivityHeatmap() {
  const days = useMemo(() => buildCalendar(), []);

  const monthMarkers = useMemo(() => {
    const markers = [];
    let prevMonth = -1;
    for (let w = 0; w < WEEKS; w++) {
      const firstDay = days[w * 7]?.date;
      if (!firstDay) continue;
      const month = firstDay.getMonth();
      if (month !== prevMonth) {
        markers.push({ index: w, label: MONTH_LABELS[month] });
        prevMonth = month;
      }
    }
    return markers;
  }, [days]);

  const totalCount = useMemo(
    () => days.reduce((a, d) => a + Math.max(d.count, 0), 0),
    [days],
  );

  return (
    <Card className="bg-card border-border shadow-none rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Activity</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium tabular-nums">
              {totalCount}
            </span>{" "}
            problems &middot; last year
          </span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-6 py-5">
        <TooltipProvider delayDuration={100}>
          <div className="w-full">
            <div
              className="grid mb-1 ml-8 gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: WEEKS }).map((_, wi) => {
                const marker = monthMarkers.find((m) => m.index === wi);
                return (
                  <span
                    key={wi}
                    className="text-[10px] text-muted-foreground leading-none whitespace-nowrap"
                  >
                    {marker?.label ?? ""}
                  </span>
                );
              })}
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col justify-between shrink-0 w-6 py-[1px]">
                {DAY_LABELS.map((d, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-muted-foreground leading-none"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div
                className="flex-1 grid gap-[3px]"
                style={{
                  gridTemplateRows: "repeat(7, minmax(0, 1fr))",
                  gridAutoFlow: "column",
                  gridAutoColumns: "minmax(0, 1fr)",
                }}
              >
                {days.map((day, i) => {
                  if (day.count < 0) {
                    return <div key={i} className="w-full aspect-square" />;
                  }
                  const level = levelFor(day.count);
                  return (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-full aspect-square rounded-[2px] hover:ring-1 hover:ring-foreground/40",
                            HEAT_LEVELS[level],
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <span className="font-medium">
                          {day.count === 0
                            ? "No problems"
                            : `${day.count} problems`}
                        </span>{" "}
                        on {formatDate(day.date)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </TooltipProvider>

        <div className="flex items-center gap-1.5 mt-4 justify-end">
          <span className="text-[11px] text-muted-foreground">Less</span>
          {HEAT_LEVELS.map((c, i) => (
            <div key={i} className={cn("w-3 h-3 rounded-[2px]", c)} />
          ))}
          <span className="text-[11px] text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ActivityHeatmap);
