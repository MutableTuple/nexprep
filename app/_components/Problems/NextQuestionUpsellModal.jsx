"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "../Spinner";
import MarkdownRenderer from "../MarkdownRenderer";
import { getSimilarQuestions } from "@/app/_lib/data-service";
import { getRecentlySeenSet } from "@/app/_lib/recently-seen";

// Post-solve upsell — centered Dialog with backdrop, opens after a
// fresh submit. Headline + subhead adapt to right/wrong. The next
// question is fetched from the same chapter so momentum carries over.

const HEADINGS_CORRECT = [
  "Nailed it.",
  "Correct!",
  "That's a lock.",
  "Streaking.",
];
const HEADINGS_WRONG = [
  "Missed it — but not by much.",
  "Not this one.",
  "Close. Try another.",
  "Every miss = new lesson.",
];
const SUBHEADS_CORRECT = [
  "Ride the momentum — one more from the same chapter?",
  "Same topic, harder version. Ready?",
  "You're warm. Grab another before it fades.",
];
const SUBHEADS_WRONG = [
  "Try a similar one — the pattern locks in on the second pass.",
  "One more from this chapter. Get your reps.",
  "Redemption question queued up.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function NextQuestionUpsellModal({
  open,
  onOpenChange,
  isCorrect,
  subject,
  chapter,
  topic,
  currentQuestionId,
  onShowExplanation,
}) {
  const [nextQ, setNextQ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setNextQ(null);
    setError(false);
    setLoading(true);
    getSimilarQuestions({ subject, chapter, topic, currentQuestionId })
      .then((rows) => {
        if (cancelled) return;
        const list = rows ?? [];
        const seen = getRecentlySeenSet();
        // First pass — prefer something the user hasn't just seen.
        // Second pass — if every candidate is in the recent buffer
        // (small topic, or user is exhausting it), fall back to any
        // non-current match rather than showing "no similar found".
        const notSeen = list.find(
          (q) => q.id !== currentQuestionId && !seen.has(q.id),
        );
        const anyFresh = list.find((q) => q.id !== currentQuestionId);
        const pick = notSeen ?? anyFresh;
        if (pick) setNextQ(pick);
        else setError(true);
      })
      .catch((err) => {
        console.error("upsell fetch:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [open, subject, chapter, topic, currentQuestionId]);

  const heading = isCorrect ? pick(HEADINGS_CORRECT) : pick(HEADINGS_WRONG);
  const subhead = isCorrect ? pick(SUBHEADS_CORRECT) : pick(SUBHEADS_WRONG);
  const Icon = isCorrect ? CheckCircle2 : XCircle;
  const accent = isCorrect ? "text-emerald-500" : "text-orange-500";
  const accentBg = isCorrect ? "bg-emerald-500/10" : "bg-orange-500/10";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${accentBg}`}
          >
            <Icon className={`h-7 w-7 ${accent}`} />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {heading}
          </DialogTitle>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {subhead}
          </p>
        </DialogHeader>

        {/* Next question preview */}
        <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size={20} />
            </div>
          ) : error || !nextQ ? (
            <div className="py-6 text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No similar question ready — browse the chapter to pick your
                next one.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {nextQ.subject}
                </span>
                {nextQ.difficulty && (
                  <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {nextQ.difficulty}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-orange-500">
                  <Flame className="h-3 w-3" />+{(nextQ.marks ?? 4) * 25} XP
                </span>
              </div>
              {/* Real KaTeX render — the DB text has proper LaTeX, so
                  MarkdownRenderer gives us math that actually reads. */}
              <div className="line-clamp-3 text-sm leading-6 text-foreground">
                <MarkdownRenderer>
                  {nextQ.question ?? nextQ.title ?? ""}
                </MarkdownRenderer>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {nextQ.chapter}
                {nextQ.topic ? ` · ${nextQ.topic}` : ""}
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-2">
          {nextQ && (
            <Button asChild size="lg" className="w-full gap-2">
              <Link
                href={`/problems/solve/${slugify(nextQ.title ?? nextQ.chapter ?? "question")}/${nextQ.id}`}
                onClick={() => onOpenChange(false)}
              >
                Solve this next
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* Explanation link — closes the upsell then opens the
              existing explanation modal for the current question, so
              the user can review before moving on. */}
          {onShowExplanation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onShowExplanation();
              }}
              className="w-full gap-2"
            >
              <BookOpen className="h-3.5 w-3.5" />
              See explanation of this problem
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground"
          >
            Not now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Unicode-aware markdown + LaTeX → plain-text for the preview.
const GREEK = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ",
  eta: "η", theta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ",
  nu: "ν", xi: "ξ", pi: "π", rho: "ρ", sigma: "σ", tau: "τ",
  upsilon: "υ", phi: "φ", chi: "χ", psi: "ψ", omega: "ω",
  Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π",
  Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
  infty: "∞", pm: "±", mp: "∓", times: "×", div: "÷", cdot: "·",
  approx: "≈", neq: "≠", leq: "≤", geq: "≥",
  rightarrow: "→", leftarrow: "←", int: "∫", sum: "Σ", partial: "∂",
  sqrt: "√", degree: "°",
};
const SUB = ["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"];
const SUP = ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"];

function stripPreview(text) {
  if (!text) return "";
  let s = String(text);
  s = s.replace(/```[\s\S]*?```/g, "");
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, "$1");
  s = s.replace(/\$([^$\n]+)\$/g, "$1");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/\*([^*\n]+)\*/g, "$1");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/\\(?:d|t)?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, "($1)/($2)");
  s = s.replace(/\\sqrt\s*\{([^{}]+)\}/g, "√($1)");
  s = s.replace(/\\([a-zA-Z]+)/g, (_, name) => GREEK[name] ?? name);
  s = s.replace(/_\{([0-9])\}/g, (_, d) => SUB[+d]);
  s = s.replace(/_([0-9])/g, (_, d) => SUB[+d]);
  s = s.replace(/\^\{([0-9])\}/g, (_, d) => SUP[+d]);
  s = s.replace(/\^([0-9])/g, (_, d) => SUP[+d]);
  s = s.replace(/_\{([^{}]+)\}/g, "_$1");
  s = s.replace(/\^\{([^{}]+)\}/g, "^($1)");
  s = s.replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
  return s;
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
