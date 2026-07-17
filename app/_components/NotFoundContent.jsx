"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Home,
  ListChecks,
  Atom,
  FlaskConical,
  Calculator,
  Trophy,
  ClipboardList,
  Newspaper,
  Sparkles,
  SearchX,
  ArrowRight,
} from "lucide-react";

const ROUTES = [
  { label: "Home", href: "/", icon: Home },
  { label: "Problems", href: "/problems", icon: ListChecks },
  { label: "Physics", href: "/physics", icon: Atom },
  { label: "Chemistry", href: "/chemistry", icon: FlaskConical },
  { label: "Maths", href: "/maths", icon: Calculator },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Mock Tests", href: "/mock-tests", icon: ClipboardList },
  { label: "Blog", href: "/blog", icon: Newspaper },
  {
    label: "Question of the Day",
    href: "/question-of-the-day",
    icon: Sparkles,
  },
];

// Classic iterative Levenshtein distance — good enough for short path
// segments, no need to pull in a dependency just for this.
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function findNearestRoute(pathname) {
  const cleaned = pathname
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .split("/")[0]; // compare against the first path segment only

  if (!cleaned) return null;

  let best = null;
  let bestDistance = Infinity;

  for (const route of ROUTES) {
    const routeSlug = route.href.replace(/^\/+/, "");
    if (!routeSlug) continue;
    const distance = levenshtein(cleaned, routeSlug);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = route;
    }
  }

  // only suggest a match if it's genuinely close, not just "least bad"
  const threshold = Math.max(2, Math.ceil(cleaned.length * 0.5));
  return bestDistance <= threshold ? best : null;
}

export default function NotFoundContent() {
  const pathname = usePathname();
  const suggestion = useMemo(() => findNearestRoute(pathname), [pathname]);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg flex flex-col items-center text-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <SearchX size={28} className="text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            404
          </h1>
          <p className="text-lg font-semibold text-foreground">
            We couldn&apos;t find that page
          </p>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1.5 py-0.5">{pathname}</code>{" "}
            doesn&apos;t exist — it may have moved or the link is outdated.
          </p>
        </div>

        {suggestion && (
          <Link href={suggestion.href} className="w-full">
            <Card className="flex items-center justify-between gap-3 p-4 transition-colors hover:border-foreground/30">
              <div className="flex items-center gap-3 text-left">
                <suggestion.icon
                  size={18}
                  className="text-primary shrink-0"
                />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Did you mean
                  </p>
                  <p className="text-sm font-semibold">{suggestion.label}</p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-muted-foreground shrink-0"
              />
            </Card>
          </Link>
        )}

        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/">Back to Home</Link>
        </Button>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
          {ROUTES.filter((r) => r.href !== "/").map((route) => (
            <Link key={route.href} href={route.href}>
              <Card className="flex flex-col items-center gap-2 p-4 text-center transition-colors hover:bg-accent hover:border-foreground/20">
                <route.icon size={18} className="text-muted-foreground" />
                <span className="text-xs font-medium">{route.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
