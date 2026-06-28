"use client";

import React, { useState } from "react";
import {
  Code2,
  CheckCircle2,
  Clock,
  Trophy,
  LayoutDashboard,
  ListChecks,
  Swords,
  MessageSquare,
  BookOpen,
  ClipboardList,
  Send,
  Bookmark,
  BarChart2,
  Settings,
  Flame,
  ChevronDown,
  CalendarDays,
  Circle,
  CheckCircle,
  ExternalLink,
  Zap,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
// ─── DATA ────────────────────────────────────────────────────────────────────

// Build heatmap: 5 rows (Mon–Fri) × 13 cols
const heatmap = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 13 }, (_, col) => {
    const v = Math.random();
    return v > 0.7 ? 3 : v > 0.45 ? 2 : v > 0.25 ? 1 : 0;
  }),
);

const heatColors = ["#e5e5e5", "#bbb", "#777", "#111"];
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

export function KpiCard({ icon: Icon, label, value, delta }) {
  return (
    <div className="flex items-center gap-4 bg-white border border-neutral-200 rounded-xl p-5">
      <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center shrink-0">
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-neutral-500 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-green-600 mt-1">↑ {delta}</p>
      </div>
    </div>
  );
}

export function BreakdownChart() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="mb-5 text-sm font-semibold">Problem Breakdown</h2>

      <div className="flex flex-col items-center gap-6">
        {/* Chart */}

        <div className="relative flex flex-col text-center h-[140px] w-[140px] items-center justify-center">
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
              {breakdownData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold text-center">84.7%</span>

            <span className="text-xs text-neutral-400 text-center">
              Acceptance
            </span>
          </div>
        </div>

        {/* Legend */}

        <div className="w-full space-y-3">
          {breakdownData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-sm text-neutral-600">{item.name}</span>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold">
                  {item.value.toLocaleString()}
                </p>

                <p className="text-xs text-neutral-400">{item.pct}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function RecentActivity() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <h2 className="font-semibold text-sm mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {recentActivity.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div
              className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${item.done ? "bg-black border-black" : "border-neutral-300"}`}
            >
              {item.done && <CheckCircle2 size={11} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium leading-snug truncate">
                {item.title}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                <span
                  className={`font-medium ${item.tag === "Easy" ? "text-green-600" : item.tag === "Medium" ? "text-yellow-600" : "text-red-500"}`}
                >
                  {item.tag}
                </span>
                {" · "}
                {item.ago}
              </p>
            </div>
            <span className="text-[10px] font-bold text-neutral-700 shrink-0">
              {item.xp}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopicMastery() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <h2 className="font-semibold text-sm mb-4">Topic Mastery</h2>
      <ul className="space-y-3">
        {topics.map((t) => (
          <li key={t.name} className="flex items-center gap-3">
            <span className="text-xs text-neutral-600 w-36 shrink-0">
              {t.name}
            </span>
            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full"
                style={{ width: `${t.pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold w-8 text-right">
              {t.pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WeeklyHeatmap() {
  const cols = 13;
  // Build col labels (dates)
  const colLabels = [
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

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <h2 className="font-semibold text-sm mb-4">Weekly Activity</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-1 mb-1 ml-8">
          {colLabels.map((d, i) => (
            <span
              key={i}
              className="w-4 text-center text-[9px] text-neutral-400"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, row) => (
            <div key={day} className="flex items-center gap-1">
              <span className="text-[9px] text-neutral-400 w-7 shrink-0">
                {day}
              </span>
              {Array.from({ length: cols }, (_, col) => {
                const level = heatmap[row]?.[col] ?? 0;
                return (
                  <div
                    key={col}
                    className="w-4 h-4 rounded-sm shrink-0"
                    style={{ background: heatColors[level] }}
                    title={`${level} submissions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] text-neutral-400">Less</span>
          {heatColors.map((c, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ background: c }}
            />
          ))}
          <span className="text-[9px] text-neutral-400">More</span>
        </div>
      </div>
    </div>
  );
}

export function RecentSubmissions() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm">Recent Submissions</h2>
        <button className="text-xs font-medium text-neutral-500 border border-neutral-200 px-3 py-1 rounded-lg hover:bg-neutral-50 transition">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-neutral-100">
              {["Problem", "Status", "Language", "Time", "Submitted"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left pb-2 font-semibold text-neutral-400 pr-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={i} className="border-b border-neutral-50 last:border-0">
                <td className="py-2.5 pr-4 font-medium whitespace-nowrap">
                  {s.problem}
                </td>
                <td className="py-2.5 pr-4 whitespace-nowrap">
                  <span
                    className={`flex items-center gap-1.5 ${s.status === "Accepted" ? "text-green-600" : "text-red-500"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${s.status === "Accepted" ? "bg-green-500" : "bg-red-400"}`}
                    />
                    {s.status}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-neutral-500">{s.lang}</td>
                <td className="py-2.5 pr-4 text-neutral-500">{s.time}</td>
                <td className="py-2.5 text-neutral-400">{s.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Badges() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm">Badges</h2>
        <button className="text-xs font-medium text-neutral-500 border border-neutral-200 px-3 py-1 rounded-lg hover:bg-neutral-50 transition">
          View All
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {badges.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 border-[3px] border-black rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">{b.label}</span>
            </div>
            <span className="text-[9px] text-neutral-500 text-center leading-tight">
              {b.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UpcomingContest() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <h2 className="font-semibold text-sm mb-4">Upcoming Contest</h2>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="font-bold text-base leading-snug">Weekly Contest 398</p>
        <span className="shrink-0 text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full whitespace-nowrap">
          In 2 days
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
        <CalendarDays size={13} />
        <span>20 May 2025, 08:00 PM</span>
      </div>
      <button className="w-full border border-neutral-200 rounded-lg py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition flex items-center justify-center gap-1.5">
        View Details
        <ExternalLink size={11} />
      </button>
    </div>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6 xl:p-8">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Yogesh!</h1>
              <p className="text-sm text-neutral-500 mt-0.5">
                Keep learning, keep building.
              </p>
            </div>
            <button className="flex items-center gap-2 border border-neutral-200 bg-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-50 transition shrink-0">
              <CalendarDays size={14} />
              This Week
              <ChevronDown size={13} />
            </button>
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

          {/* Row 2: Progress + Breakdown + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] xl:grid-cols-[1fr_280px_280px] gap-4 mb-4">
            <ProgressChart />
            <BreakdownChart />
            <RecentActivity />
          </div>

          {/* Row 3: Topic Mastery + Weekly Activity + Upcoming Contest */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[280px_1fr_280px] gap-4 mb-4">
            <TopicMastery />
            <WeeklyHeatmap />
            <UpcomingContest />
          </div>

          {/* Row 4: Submissions + Badges */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
            <RecentSubmissions />
            <Badges />
          </div>
        </main>
      </div>
    </div>
  );
}
