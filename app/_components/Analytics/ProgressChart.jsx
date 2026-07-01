"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const progressData = [
  { date: "Mon", solved: 28 },
  { date: "Tue", solved: 42 },
  { date: "Wed", solved: 55 },
  { date: "Thu", solved: 39 },
  { date: "Fri", solved: 72 },
  { date: "Sat", solved: 91 },
  { date: "Sun", solved: 64 },
  { date: "Mon", solved: 80 },
  { date: "Tue", solved: 104 },
  { date: "Wed", solved: 88 },
  { date: "Thu", solved: 96 },
  { date: "Fri", solved: 118 },
  { date: "Sat", solved: 126 },
  { date: "Sun", solved: 109 },
];

const peakValue = Math.max(...progressData.map((d) => d.solved));

const statCards = [
  { label: "Total solved", value: "1,248" },
  { label: "Easy", value: "523" },
  { label: "Medium", value: "588" },
  { label: "Hard", value: "137" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-popover border border-border px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-popover-foreground">
        {payload[0].value} solved
      </p>
    </div>
  );
};

export function ProgressChart() {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-none">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
              Progress
            </p>
            <p className="text-3xl font-bold text-foreground leading-none">
              1,248
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Problems solved this month
            </p>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full shrink-0 text-xs font-semibold"
          >
            ↑ 18.6%
          </Badge>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={progressData}
            margin={{ top: 4, left: -20, right: 4, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              vertical={false}
              stroke="hsl(var(--border))"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickCount={5}
              width={32}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "hsl(var(--muted))" }}
            />
            <Bar dataKey="solved" radius={[6, 6, 0, 0]} maxBarSize={24}>
              {progressData.map((item, i) => (
                <Cell
                  key={i}
                  fill={
                    item.solved === peakValue
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stat cards */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {statCards.map(({ label, value }, i) => (
            <div
              key={label}
              className={cn(
                "rounded-xl px-3.5 py-3",
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted border border-border",
              )}
            >
              <p
                className={cn(
                  "text-[11px] mb-1",
                  i === 0
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </p>
              <p
                className={cn(
                  "text-xl font-bold",
                  i === 0 ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
