"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MarkdownRenderer from "./MarkdownRenderer";

const SESSION_KEY = "exitChallengeShown";

// Pages where popping this up would fight the page's own job — already
// mid-question, mid-auth, or mid-duel.
const EXCLUDED_PREFIXES = ["/problems/solve", "/login", "/signup", "/duel"];

/**
 * Shows the day's question once per tab session when the cursor heads for
 * the top of the viewport (the classic "about to close the tab / hit the
 * address bar" signal). Desktop-only by nature — there's no cursor to read
 * exit intent from on a touch device, so this simply never fires there.
 *
 * Two independent listeners, because neither alone is reliable enough on
 * its own across browsers:
 *  - `mouseout` + clientY check catches the cursor mid-flight toward the
 *    tab/address bar, but real cursor movement rarely lands on exactly
 *    y=0, and fast flicks can skip past the threshold before an event
 *    fires at all.
 *  - `mouseleave` on <html> is a purpose-built "pointer left the viewport"
 *    event and doesn't need coordinate guessing, but fires for *any* exit
 *    edge (not just the top), so it's paired with the other check rather
 *    than replacing it.
 * A short arm delay avoids firing on a page load where the cursor happens
 * to already be sitting near the top edge.
 */
export default function ExitIntentChallenge({ question }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!question) return;
    if (EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
      return;
    }
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let armed = false;
    const armTimer = setTimeout(() => {
      armed = true;
    }, 1500);

    function trigger() {
      if (!armed) return;
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      cleanup();
    }

    function handleMouseOut(e) {
      // Tolerate a small band, not just exactly 0 — a fast cursor flick
      // toward the tab bar often skips the last few pixels before the
      // browser stops delivering events to the page.
      if (e.clientY > 20 || e.relatedTarget) return;
      trigger();
    }

    function handleMouseLeave() {
      trigger();
    }

    function cleanup() {
      clearTimeout(armTimer);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
    }

    document.addEventListener("mouseout", handleMouseOut);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return cleanup;
  }, [pathname, question]);

  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Before you go — solve one?</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {question.subject} · {question.chapter}
          </span>

          <MarkdownRenderer className="text-sm">
            {question.question}
          </MarkdownRenderer>

          <div className="flex items-center justify-between gap-3 mt-1">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Not now
            </Button>
            <Button size="sm" asChild>
              <Link href={question.href} onClick={() => setOpen(false)}>
                Solve it — +{question.xp} XP
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
