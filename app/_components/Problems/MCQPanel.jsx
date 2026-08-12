import React from "react";
import AnswerOption from "./AnswerOption";
import { Button } from "@/components/ui/button";
import ResultBox from "./ResultBox";
import MarkdownRenderer from "../MarkdownRenderer";

// Multi-answer questions are graded as an exact set match — every correct
// option selected, nothing else. No partial credit (matches how
// correctOptionIds is defined: a fixed set, not weighted per-option).
function answerSetsMatch(selected, correct) {
  return (
    selected.length === correct.length &&
    selected.every((i) => correct.includes(i))
  );
}

export default function MCQPanel({
  options,
  correctIndices,
  isMultiple,
  selected,
  submitted,
  attemptCount,
  justAnswered,
  explanation,
  formula,
  solutionSteps,
  xp,
  onSelect,
  onSubmit,
  onRetry,
  onNext,
}) {
  const isCorrect = submitted && answerSetsMatch(selected, correctIndices);
  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6">
        <h3 className="text-[17px] font-bold">Choose your answer</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {isMultiple
            ? "Select all that apply, then submit"
            : "Select one option and submit"}
        </p>
      </div>
      <div className="px-6 py-5 flex flex-col gap-2.5">
        {options.map((opt, i) => (
          <AnswerOption
            key={i}
            opt={opt}
            index={i}
            selected={selected}
            submitted={submitted}
            correctIndices={correctIndices}
            onSelect={onSelect}
          />
        ))}
      </div>
      {!submitted ? (
        <div className="px-6 pb-6">
          <Button
            onClick={onSubmit}
            disabled={selected.length === 0}
            className="w-full py-3.5 rounded-2xl font-bold text-[15px] h-auto"
          >
            {attemptCount > 1
              ? `Submit (attempt ${attemptCount})`
              : "Submit answer"}
          </Button>
        </div>
      ) : (
        <ResultBox
          isCorrect={isCorrect}
          xp={xp}
          justAnswered={justAnswered}
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
