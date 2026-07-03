import React from "react";
import NumericalPanel from "./NumericalPanel";
import MCQPanel from "./MCQPanel";

export default function AnswerPanel({
  question,
  xp,
  submitted,
  selected,
  previousValue,
  attemptCount,
  justAnswered,
  onSelect,
  onSubmit,
  onRetry,
  onNext,
}) {
  const isNumerical = ["NUMERICAL", "INTEGER"].includes(question.questionType);

  if (isNumerical) {
    return (
      <NumericalPanel
        correctValue={question.correctValue}
        tolerance={question.data?.tolerance ?? 0}
        unit={question.data?.unit}
        submitted={submitted}
        previousValue={previousValue}
        attemptCount={attemptCount}
        justAnswered={justAnswered}
        explanation={question.explanation}
        formula={question.formula}
        solutionSteps={question.solutionSteps}
        xp={xp}
        onSubmit={onSubmit}
        onRetry={onRetry}
        onNext={onNext}
      />
    );
  }

  const options = (question.options ?? []).map((o) => ({
    label: o.id,
    text: o.text,
  }));
  const correctIndex = options.findIndex(
    (o) => o.label === question.correctOption,
  );

  return (
    <MCQPanel
      options={options}
      correctIndex={correctIndex}
      selected={selected}
      submitted={submitted}
      attemptCount={attemptCount}
      justAnswered={justAnswered}
      explanation={question.explanation}
      formula={question.formula}
      solutionSteps={question.solutionSteps}
      xp={xp}
      onSelect={onSelect}
      onSubmit={onSubmit}
      onRetry={onRetry}
      onNext={onNext}
    />
  );
}
