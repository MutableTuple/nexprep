"use client";

import React from "react";
import {
  Code2,
  CheckCircle2,
  Clock,
  Trophy,
  CalendarDays,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  navItems,
  progressData,
  breakdownData,
  topics,
  recentActivity,
  submissions,
  badges,
} from "../_utils/items";
import Topbar from "./Topbar";
import { Sidebar } from "./Analytics/AnalyticsSidebar";
import { ProgressChart } from "./Analytics/ProgressChart";

// ─── Heatmap data ─────────────────────────────────────────────────────────────

const heatmap = Array.from({ length: 5 }, () =>
  Array.from({ length: 13 }, () => {
    const v = Math.random();
    return v > 0.7 ? 3 : v > 0.45 ? 2 : v > 0.25 ? 1 : 0;
  }),
);

const HEAT_COLORS = [
  "bg-border",
  "bg-muted-foreground/40",
  "bg-muted-foreground/70",
  "bg-foreground",
];

const COL_LABELS = [
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
  "S",
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
];

// ─── GlassCard ────────────────────────────────────────────────────────────────

function GlassCard({ className, children, ...props }) {
  return (
    <Card
      className={cn("bg-card border-border shadow-none rounded-xl", className)}
      {...props}
    >
      {children}
    </Card>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────

export function KpiCard({ icon: Icon, label, value, delta }) {
  return (
    <GlassCard>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-0.5">
            {label}
          </p>
          <p className="text-2xl font-bold leading-none text-foreground">
            {value}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            ↑ {delta}
          </p>
        </div>
      </CardContent>
    </GlassCard>
  );
}

// ─── BreakdownChart ───────────────────────────────────────────────────────────

export function BreakdownChart() {
  return (
    <GlassCard>
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-sm font-semibold">
          Problem Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-[140px] w-[140px]">
            <PieChart width={140} height={140}>
              <Pie
                data={breakdownData}
                cx={70}
                cy={70}
                innerRadius={48}
                outerRadius={64}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {breakdownData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-foreground">84.7%</span>
              <span className="text-xs text-muted-foreground">Acceptance</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            {breakdownData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {item.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.pct}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}

// ─── RecentActivity ───────────────────────────────────────────────────────────

const DIFF_COLORS = {
  Easy: "text-green-600 dark:text-green-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  Hard: "text-red-500 dark:text-red-400",
};

export function RecentActivity() {
  return (
    <GlassCard>
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <ul className="space-y-4">
          {recentActivity.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                  item.done ? "bg-primary border-primary" : "border-border",
                )}
              >
                {item.done && (
                  <CheckCircle2 size={11} className="text-primary-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-snug truncate text-foreground">
                  {item.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  <span className={cn("font-medium", DIFF_COLORS[item.tag])}>
                    {item.tag}
                  </span>
                  {" · "}
                  {item.ago}
                </p>
              </div>
              <span className="text-[10px] font-bold text-foreground shrink-0">
                {item.xp}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </GlassCard>
  );
}

// ─── TopicMastery ─────────────────────────────────────────────────────────────

export function TopicMastery() {
  return (
    <GlassCard>
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-sm font-semibold">Topic Mastery</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <ul className="space-y-3">
          {topics.map((t) => (
            <li key={t.name} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-36 shrink-0">
                {t.name}
              </span>
              <Progress value={t.pct} className="flex-1 h-2" />
              <span className="text-xs font-semibold w-8 text-right text-foreground">
                {t.pct}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </GlassCard>
  );
}

// ─── WeeklyHeatmap ────────────────────────────────────────────────────────────

export function WeeklyHeatmap() {
  return (
    <GlassCard>
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-sm font-semibold">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="overflow-x-auto">
          <div className="flex gap-1 mb-1 ml-8">
            {COL_LABELS.map((d, i) => (
              <span
                key={i}
                className="w-4 text-center text-[9px] text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="space-y-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, row) => (
              <div key={day} className="flex items-center gap-1">
                <span className="text-[9px] text-muted-foreground w-7 shrink-0">
                  {day}
                </span>
                {Array.from({ length: 13 }, (_, col) => {
                  const level = heatmap[row]?.[col] ?? 0;
                  return (
                    <div
                      key={col}
                      className={cn(
                        "w-4 h-4 rounded-sm shrink-0",
                        HEAT_COLORS[level],
                      )}
                      title={`${level} submissions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[9px] text-muted-foreground">Less</span>
            {HEAT_COLORS.map((c, i) => (
              <div key={i} className={cn("w-3 h-3 rounded-sm", c)} />
            ))}
            <span className="text-[9px] text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}

// ─── RecentSubmissions ────────────────────────────────────────────────────────

export function RecentSubmissions() {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold">
          Recent Submissions
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="text-xs rounded-lg h-7 px-3"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Problem", "Status", "Language", "Time", "Submitted"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left pb-2 font-semibold text-muted-foreground pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 pr-4 font-medium whitespace-nowrap text-foreground">
                    {s.problem}
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "flex items-center gap-1.5",
                        s.status === "Accepted"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400",
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          s.status === "Accepted"
                            ? "bg-green-500"
                            : "bg-red-400",
                        )}
                      />
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {s.lang}
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {s.time}
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {s.submitted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </GlassCard>
  );
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export function Badges() {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold">Badges</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="text-xs rounded-lg h-7 px-3"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 border-[3px] border-primary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">
                  {b.label}
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground text-center leading-tight">
                {b.sub}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </GlassCard>
  );
}

// ─── UpcomingContest ──────────────────────────────────────────────────────────

export function UpcomingContest() {
  return (
    <GlassCard>
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-sm font-semibold">
          Upcoming Contest
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="font-bold text-base leading-snug text-foreground">
            Weekly Contest 398
          </p>
          <Badge
            variant="secondary"
            className="text-[10px] rounded-full whitespace-nowrap shrink-0"
          >
            In 2 days
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <CalendarDays size={13} />
          <span>20 May 2025, 08:00 PM</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-lg text-xs gap-1.5"
        >
          View Details
          <ExternalLink size={11} />
        </Button>
      </CardContent>
    </GlassCard>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col font-sans">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-5 lg:p-6 xl:p-8">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, Yogesh!
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Keep learning, keep building.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg shrink-0"
            >
              <CalendarDays size={14} />
              This Week
              <ChevronDown size={13} />
            </Button>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <KpiCard
              icon={Code2}
              label="Problems Solved"
              value="1,248"
              delta="18.6% from last week"
            />
            <KpiCard
              icon={CheckCircle2}
              label="Acceptance Rate"
              value="84.7%"
              delta="6.3% from last week"
            />
            <KpiCard
              icon={Clock}
              label="Total Time Spent"
              value="42h 36m"
              delta="12.8% from last week"
            />
            <KpiCard
              icon={Trophy}
              label="Contest Rank"
              value="#2,301"
              delta="1,245 from last week"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] xl:grid-cols-[1fr_280px_280px] gap-4 mb-4">
            <ProgressChart />
            <BreakdownChart />
            <RecentActivity />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[280px_1fr_280px] gap-4 mb-4">
            <TopicMastery />
            <WeeklyHeatmap />
            <UpcomingContest />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
            <RecentSubmissions />
            <Badges />
          </div>
        </main>
      </div>
    </div>
  );
}
