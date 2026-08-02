"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BadgeIcon from "./BadgeIcon";
import { fireBadgeCelebration } from "@/app/_lib/confetti";

// Small "trophy shelf" of earned badges — hover shows the name, clicking
// pops the same kind of celebratory detail view as the unlock modal, so
// looking back at an old badge still feels like something, not just an icon.
export default function BadgeMiniRow({ badges }) {
  const [selected, setSelected] = useState(null);

  function handleSelect(badge) {
    setSelected(badge);
    fireBadgeCelebration(badge.tier);
  }

  if (!badges?.length) return null;

  return (
    <TooltipProvider>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {badges.map((badge) => (
          <Tooltip key={badge.slug}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleSelect(badge)}
                className="rounded-2xl transition-transform hover:scale-110"
              >
                <BadgeIcon
                  icon={badge.icon}
                  tier={badge.tier}
                  colors={badge.colors}
                  size={30}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>{badge.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="text-center sm:max-w-sm">
          {selected && (
            <>
              <DialogHeader className="items-center">
                <div className="my-2 flex justify-center">
                  <BadgeIcon
                    icon={selected.icon}
                    tier={selected.tier}
                    colors={selected.colors}
                    size={96}
                  />
                </div>
                <DialogTitle className="text-lg">{selected.name}</DialogTitle>
                <DialogDescription>{selected.desc}</DialogDescription>
                <Badge
                  variant="secondary"
                  className="mt-1 rounded-full px-2.5 py-0.5 text-[11px] capitalize"
                >
                  {selected.tier} tier
                </Badge>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() => setSelected(null)}
                  className="w-full rounded-xl font-bold"
                >
                  Nice
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
