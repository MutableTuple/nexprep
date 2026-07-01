import React from "react";
import QuestionCard from "./QuestionCard";

export default function QuestionList({ questions }) {
  console.log("QUESTIONS", questions);
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
          {/* <div className="sticky top-0 z-10 bg-background/80 backdrop-blur py-2">
            <h2 className="text-xl font-bold">{topic}</h2>

            <p className="text-sm text-muted-foreground">
              {topicQuestions.length} question
              {topicQuestions.length > 1 ? "s" : ""}
            </p>
          </div> */}

          <QuestionCard key={topicQuestions[0].id} {...topicQuestions[0]} />
        </section>
      ))}
    </div>
  );
}
