import React, { useState } from "react";

import { Flame } from "lucide-react";

import { navItems } from "@/app/_utils/items";

export function Sidebar({ streakDays = 12 }) {
  const [active, setActive] = useState("Dashboard");
  const weekDots = ["M", "T", "W", "T", "F", "S", "S"];
  const filledDots = 6;

  return (
    <aside className="hidden lg:flex flex-col w-52 xl:w-56 shrink-0 bg-white border-r border-neutral-200 min-h-screen">
      <nav className="flex-1 py-4">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ icon: Icon, label }) => (
            <li key={label}>
              <button
                onClick={() => setActive(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active === label
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Daily Streak card */}
      <div className="m-3 p-4 border border-neutral-200 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={16} className="text-orange-500" />
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Daily Streak
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-4xl font-bold">{streakDays}</span>
          <span className="text-sm text-neutral-500 font-medium">Days</span>
        </div>
        <div className="flex gap-1.5 mb-1">
          {weekDots.map((d, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold ${
                i < filledDots
                  ? "bg-black text-white"
                  : "border border-neutral-300 text-neutral-400"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1.5 mb-3">
          {weekDots.map((d, i) => (
            <span
              key={i}
              className="w-5 text-center text-[9px] text-neutral-400"
            >
              {d}
            </span>
          ))}
        </div>
        <button className="w-full border border-neutral-200 rounded-lg py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition">
          View Streak
        </button>
      </div>
    </aside>
  );
}
