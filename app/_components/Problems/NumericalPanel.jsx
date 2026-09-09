import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import ResultBox from "./ResultBox";
import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

export default function NumericalPanel({
  correctValue,
  tolerance = 0,
  unit,
  submitted,
  previousValue,
  attemptCount,
  justAnswered,
  questionId,
  approach,
  explanation,
  formula,
  solutionSteps,
  xp,
  onSubmit,
  onRetry,
  onNext,
  onOpenApproach,
}) {
  const [inputValue, setInputValue] = useState("");

  // Sync the input from a restored prior attempt, and clear it again when
  // the parent resets previousValue to "" (a fresh question, or a retry).
  useEffect(() => {
    setInputValue(previousValue || "");
  }, [previousValue]);

  const isCorrect =
    submitted &&
    inputValue !== "" &&
    Math.abs(parseFloat(inputValue) - correctValue) <= tolerance;

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6">
        <h3 className="text-[17px] font-bold">Enter your answer</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Type a numerical value{unit ? ` in ${unit}` : ""}
          {tolerance > 0 && ` (±${tolerance} accepted)`}
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Enter value…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={submitted}
            className="h-12 rounded-xl text-base font-mono"
          />
          {unit && (
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {unit}
            </span>
          )}
        </div>
      </div>

      {!submitted ? (
        <div className="px-6 pb-6 space-y-2">
          <Button
            onClick={() => onSubmit(inputValue)}
            disabled={!inputValue}
            className="w-full py-3.5 rounded-2xl font-bold text-[15px] h-auto"
          >
            {attemptCount > 1
              ? `Submit (attempt ${attemptCount})`
              : "Submit answer"}
          </Button>
          {onOpenApproach && (
            <Button
              onClick={onOpenApproach}
              className="hidden lg:flex w-full py-3 rounded-2xl font-semibold text-[13px] h-auto gap-2 bg-orange-500 hover:bg-orange-600 text-white border-transparent"
            >
              <Lightbulb size={14} />
              How to think about it
            </Button>
          )}
        </div>
      ) : (
        <ResultBox
          isCorrect={isCorrect}
          xp={xp}
          justAnswered={justAnswered}
          questionId={questionId}
          approach={approach}
          explanation={explanation}
          formula={formula}
          solutionSteps={solutionSteps}
          onRetry={onRetry}
          onNext={onNext}
        />
      )}
    </div>
  );
}
