"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  ChevronRight,
  SkipForward,
  XCircle,
  BookOpen,
} from "lucide-react";
import MarkdownRenderer from "../../_components/MarkdownRenderer";

// ─── Inline strip ─────────────────────────────────────────────────────────────

function ResultStrip({ isCorrect, xp, onViewExplanation, onNext }) {
  return (
    <div
      className={`mx-4 sm:mx-6 mb-4 sm:mb-6 rounded-2xl border p-4 flex flex-col gap-3 ${
        isCorrect
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
      }`}
    >
      <div className="flex items-center gap-2">
        {isCorrect ? (
          <CheckCircle2 size={18} className="text-green-500 shrink-0" />
        ) : (
          <XCircle size={18} className="text-red-500 shrink-0" />
        )}
        <span
          className={`font-bold text-sm ${
            isCorrect
              ? "text-green-700 dark:text-green-300"
              : "text-red-700 dark:text-red-300"
          }`}
        >
          {isCorrect ? `Correct! +${xp} XP` : "Incorrect — see explanation"}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewExplanation}
          className="flex-1 rounded-xl gap-1.5"
        >
          <BookOpen size={14} />
          View Solution
        </Button>
        <Button
          size="sm"
          onClick={onNext}
          className="flex-1 rounded-xl gap-1.5"
        >
          Next <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}

// ─── Explanation modal ────────────────────────────────────────────────────────

function ExplanationModal({
  open,
  onClose,
  isCorrect,
  xp,
  explanation,
  formula,
  solutionSteps,
  onNext,
}) {
  function handleNext() {
    onClose();
    onNext();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] max-w-5xl max-h-[90vh] flex flex-col rounded-2xl p-0 gap-0 overflow-hidden [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="px-6 sm:px-8 pt-6 pb-4 border-b flex-row items-center justify-between space-y-0 shrink-0">
          <DialogTitle className="flex items-center gap-3 text-base sm:text-lg">
            {isCorrect ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50 shrink-0">
                <CheckCircle2
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 shrink-0">
                <XCircle size={18} className="text-red-600 dark:text-red-400" />
              </div>
            )}
            <span
              className={
                isCorrect
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }
            >
              {isCorrect ? `Correct! +${xp} XP` : "Incorrect Answer"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 flex flex-col gap-7">
          {!!explanation && (
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">
                Explanation
              </p>
              <div className="text-sm sm:text-[15px] leading-relaxed text-foreground">
                <MarkdownRenderer>{explanation}</MarkdownRenderer>
              </div>
            </div>
          )}

          {!!formula && (
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">
                Key Formula
              </p>
              <div className="rounded-xl border bg-muted/50 px-5 py-4">
                <MarkdownRenderer>{formula}</MarkdownRenderer>
              </div>
            </div>
          )}

          {!!solutionSteps?.length && (
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">
                Step-by-step Solution
              </p>
              <div className="flex flex-col gap-3">
                {solutionSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-4 rounded-xl border bg-background/70 p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <div className="text-sm leading-relaxed text-foreground pt-0.5">
                      <MarkdownRenderer>{step}</MarkdownRenderer>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t bg-background shrink-0 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl h-11 px-6 text-sm"
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            className="flex-1 rounded-xl h-11 gap-1.5 text-sm"
          >
            <SkipForward size={14} />
            Skip
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 rounded-xl h-11 gap-1.5 text-sm"
          >
            Next
            <ChevronRight size={14} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── ResultBox ────────────────────────────────────────────────────────────────

export default function ResultBox({
  isCorrect,
  xp,
  explanation,
  formula,
  solutionSteps,
  onNext,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isCorrect) setModalOpen(true);
  }, [isCorrect]);

  return (
    <>
      <ResultStrip
        isCorrect={isCorrect}
        xp={xp}
        onViewExplanation={() => setModalOpen(true)}
        onNext={onNext}
      />

      <ExplanationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isCorrect={isCorrect}
        xp={xp}
        explanation={explanation}
        formula={formula}
        solutionSteps={solutionSteps}
        onNext={onNext}
      />
    </>
  );
}
