import React from "react";
import QuestionCard from "./QuestionCard";

export default function QuestionList({ questions, defaultExpanded = false }) {
  const grouped = new Map();

  questions.forEach((question) => {
    if (!grouped.has(question.title)) {
      grouped.set(question.title, []);
    }
    grouped.get(question.title).push(question);
  });

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">
        {questions.length} question{questions.length !== 1 ? "s" : ""}
      </p>

      {Array.from(grouped.entries()).map(([topic, topicQuestions]) => (
        <section key={topic} className="space-y-4">
          <QuestionCard
            // Remounts each card when the page-level display mode flips,
            // so every card's expanded state resets to match the new
            // default rather than keeping whatever it was individually.
            key={`${topicQuestions[0].id}:${defaultExpanded}`}
            {...topicQuestions[0]}
            defaultExpanded={defaultExpanded}
          />
        </section>
      ))}
    </div>
  );
}
