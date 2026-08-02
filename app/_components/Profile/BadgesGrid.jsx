import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import BadgeIcon from "./BadgeIcon";
import { BADGE_CATALOG } from "@/app/_lib/badges";

export default function BadgesGrid({ unlockedSlugs = new Set() }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {BADGE_CATALOG.map((badge) => {
        const earned = unlockedSlugs.has(badge.slug);
        return (
          <Card
            key={badge.slug}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-border p-4 text-center shadow-none transition-all",
              !earned && "opacity-60",
            )}
          >
            <CardContent className="flex w-full flex-col items-center gap-2 p-0">
              <BadgeIcon
                icon={badge.icon}
                tier={badge.tier}
                colors={badge.colors}
                size={52}
                locked={!earned}
              />
              <div>
                <p className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
                  {badge.name}
                  {!earned && (
                    <Lock size={11} className="text-muted-foreground" />
                  )}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {badge.desc}
                </p>
              </div>
              {earned && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-2 py-0 text-[10px] capitalize"
                >
                  {badge.tier}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
