"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/app/_utils/items";

export function Sidebar({ streakDays = 12 }) {
  const [active, setActive] = useState("Dashboard");
  const weekDots = ["M", "T", "W", "T", "F", "S", "S"];
  const filledDots = 6;

  return (
    <aside className="hidden lg:flex flex-col w-52 xl:w-56 shrink-0 bg-card border-r border-border min-h-screen">
      <nav className="flex-1 py-4">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Button
                variant="ghost"
                onClick={() => setActive(label)}
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium",
                  active === label
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <Icon size={16} />
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Daily Streak card */}
      <Card className="m-3 shadow-none border-border rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} className="text-orange-500" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Daily Streak
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-4xl font-bold text-foreground">
              {streakDays}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              Days
            </span>
          </div>

          <div className="flex gap-1.5 mb-1">
            {weekDots.map((d, i) => (
              <div
                key={i}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold",
                  i < filledDots
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground",
                )}
              />
            ))}
          </div>

          <div className="flex gap-1.5 mb-3">
            {weekDots.map((d, i) => (
              <span
                key={i}
                className="w-5 text-center text-[9px] text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-lg text-xs h-7"
          >
            View Streak
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
