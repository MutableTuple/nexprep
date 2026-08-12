import React from "react";
import QuestionCard from "./QuestionCard";

export default function QuestionList({ questions, defaultExpanded = false }) {
  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">
        {questions.length} question{questions.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard
            // Remounts each card when the page-level display mode flips, so
            // its expanded state resets to match the new default rather
            // than keeping whatever it was individually.
            key={`${question.id}:${defaultExpanded}`}
            {...question}
            defaultExpanded={defaultExpanded}
          />
        ))}
      </div>
    </div>
  );
}
