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
    <div className="rounded-xl bg-black px-3 py-2 text-white shadow-lg">
      <p className="text-[11px] text-neutral-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold">{payload[0].value} solved</p>
    </div>
  );
};

export function ProgressChart() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-1.5">
            Progress
          </p>
          <p className="text-3xl font-bold text-neutral-900 leading-none">
            1,248
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            Problems solved this month
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
          ↑ 18.6%
        </span>
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
            stroke="#f0f0f0"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
            tickCount={5}
            width={32}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "#f9f9f9", radius: 6 }}
          />
          <Bar dataKey="solved" radius={[6, 6, 0, 0]} maxBarSize={24}>
            {progressData.map((item, i) => (
              <Cell
                key={i}
                fill={item.solved === peakValue ? "#111111" : "#e0e0e0"}
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
            className={`rounded-xl px-3.5 py-3 ${
              i === 0
                ? "bg-black text-white"
                : "bg-neutral-50 border border-neutral-100"
            }`}
          >
            <p
              className={`text-[11px] mb-1 ${
                i === 0 ? "text-neutral-400" : "text-neutral-400"
              }`}
            >
              {label}
            </p>
            <p
              className={`text-xl font-bold ${
                i === 0 ? "text-white" : "text-neutral-900"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
