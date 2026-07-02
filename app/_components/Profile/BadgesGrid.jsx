import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge, Lock } from "lucide-react";
import React from "react";

export default function BadgesGrid({ BADGES }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {BADGES.map((badge) => {
        const Icon = badge.icon;
        return (
          <Card
            key={badge.id}
            className={cn(
              "bg-card border-border shadow-none rounded-2xl p-4 flex flex-col items-center text-center gap-3 transition-all",
              !badge.earned && "opacity-40 grayscale",
            )}
          >
            <CardContent className="p-0 flex flex-col items-center gap-2 w-full">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  badge.bg,
                )}
              >
                <Icon size={22} className={badge.color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1 justify-center">
                  {badge.name}
                  {!badge.earned && (
                    <Lock size={11} className="text-muted-foreground" />
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {badge.desc}
                </p>
              </div>
              {badge.earned && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 rounded-full"
                >
                  Earned
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
