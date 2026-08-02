"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BadgeIcon from "./Profile/BadgeIcon";
import { BADGE_CATALOG } from "@/app/_lib/badges";
import { checkForNewBadges } from "@/app/_lib/badge-unlock-check";
import { fireBadgeCelebration } from "@/app/_lib/confetti";

const BadgeUnlockContext = createContext(null);

// Call this after any action that could move badge-relevant stats (solving
// a question, winning a duel, ...) — safe to call liberally, it's a no-op
// when nothing new unlocked.
export function useBadgeUnlockCheck() {
  const ctx = useContext(BadgeUnlockContext);
  if (!ctx) {
    throw new Error(
      "useBadgeUnlockCheck must be used within BadgeUnlockProvider",
    );
  }
  return ctx.checkForBadges;
}

export default function BadgeUnlockProvider({ children }) {
  const [queue, setQueue] = useState([]); // pending BADGE_CATALOG entries
  const [dismissing, setDismissing] = useState(false);

  const current = queue[0] ?? null;
  // Derived, not synced — no separate "open" state to fall out of step
  // with the queue.
  const open = !!current && !dismissing;

  const checkForBadges = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const newSlugs = await checkForNewBadges(userId);
      if (newSlugs.length === 0) return;

      const unlocked = newSlugs
        .map((slug) => BADGE_CATALOG.find((b) => b.slug === slug))
        .filter(Boolean);

      if (unlocked.length > 0) {
        setQueue((q) => [...q, ...unlocked]);
        // Fire-and-forget — the modal/confetti above don't wait on this,
        // and the route itself is idempotent (DB-claimed), so a failure
        // here just means no email, never a duplicate or a UI hang.
        for (const badge of unlocked) {
          fetch("/api/badges/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, badgeSlug: badge.slug }),
          }).catch((err) =>
            console.error("Failed to notify badge unlock email:", err),
          );
        }
      }
    } catch (err) {
      console.error("Failed to check for new badges:", err);
    }
  }, []);

  // Confetti is a side effect on an external system (canvas), not a React
  // state sync, so it belongs here rather than in an event handler.
  useEffect(() => {
    if (current && !dismissing) fireBadgeCelebration(current.tier);
  }, [current, dismissing]);

  // Temporary debug hook — run window.__testBadgeUnlock() (optionally with
  // a slug from badges.js) in DevTools console to preview the modal
  // without needing to actually earn a badge.
  useEffect(() => {
    window.__testBadgeUnlock = (slug) => {
      const badge = BADGE_CATALOG.find((b) => b.slug === slug) ?? BADGE_CATALOG[0];
      setQueue((q) => [...q, badge]);
    };
  }, []);

  function handleClose() {
    setDismissing(true);
    // let the dialog's close animation finish before the next queued badge
    // (if any) pops in, instead of jump-cutting straight to it
    setTimeout(() => {
      setQueue((q) => q.slice(1));
      setDismissing(false);
    }, 200);
  }

  return (
    <BadgeUnlockContext.Provider value={{ checkForBadges }}>
      {children}

      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent className="text-center sm:max-w-sm">
          {current && (
            <>
              <DialogHeader className="items-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Badge Unlocked
                </p>
                <div className="my-2 flex justify-center">
                  <BadgeIcon
                    icon={current.icon}
                    tier={current.tier}
                    colors={current.colors}
                    size={96}
                  />
                </div>
                <DialogTitle className="text-lg">{current.name}</DialogTitle>
                <DialogDescription>{current.desc}</DialogDescription>
                <Badge
                  variant="secondary"
                  className="mt-1 rounded-full px-2.5 py-0.5 text-[11px] capitalize"
                >
                  {current.tier} tier
                </Badge>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={handleClose}
                  className="w-full rounded-xl font-bold"
                >
                  Nice!
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </BadgeUnlockContext.Provider>
  );
}
