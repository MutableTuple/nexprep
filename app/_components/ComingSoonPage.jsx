"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";

function fireConfetti() {
  // centre burst
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#f59e0b", "#6366f1", "#10b981", "#f43f5e", "#3b82f6"],
  });

  // left cannon
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.65 },
    colors: ["#f59e0b", "#6366f1", "#10b981"],
  });

  // right cannon
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.65 },
    colors: ["#f43f5e", "#3b82f6", "#f59e0b"],
  });

  // delayed star burst
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.55 },
      shapes: ["star"],
      colors: ["#f59e0b", "#fbbf24"],
      scalar: 1.4,
    });
  }, 250);
}

export function ComingSoonPage({
  title = "Something big is on the way",
  description = "We're putting the finishing touches on something you'll love. Drop your email and we'll let you know the moment it's ready.",
  features = [],
  showNotify = true,
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    fireConfetti();
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
        <Badge
          variant="outline"
          className="gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
        >
          <Zap size={11} className="text-amber-500" />
          Coming soon
        </Badge>

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {showNotify && (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col sm:flex-row gap-2 mt-2"
          >
            {submitted ? (
              <div className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 size={15} />
                You're on the list — we'll reach out soon! 🎉
              </div>
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-11 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  className="h-11 rounded-xl px-5 gap-1.5 shrink-0"
                >
                  Notify me <ArrowRight size={15} />
                </Button>
              </>
            )}
          </form>
        )}

        {features.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border text-center"
              >
                <span className="text-2xl">{f.icon}</span>
                <p className="text-xs font-semibold">{f.label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

export function withComingSoon(Page, props = {}) {
  return function ComingSoonWrapper(pageProps) {
    return <ComingSoonPage {...props} />;
  };
}
