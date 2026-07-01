"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "./Spinner";
import QuestionCard from "./Problems/QuestionCard";
import { getSimilarQuestions } from "@/app/_lib/data-service";

export default function SimilarQuestions({
  subject,
  chapter,
  topic,
  currentQuestionId,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function handleLoad() {
    if (loaded) return;
    setLoading(true);
    try {
      const data = await getSimilarQuestions({
        subject,
        chapter,
        topic,
        currentQuestionId,
      });
      setQuestions(data);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8">
      {/* Stack vertically on mobile, row on sm+ */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Similar Questions</h2>
          <p className="text-sm text-muted-foreground">
            Practice more questions from this topic.
          </p>
        </div>

        {!loaded && (
          <Button
            onClick={handleLoad}
            disabled={loading}
            className="w-full sm:w-auto shrink-0 gap-2"
          >
            {loading ? (
              <>
                <Spinner size={16} />
                Loading…
              </>
            ) : (
              "Load Similar"
            )}
          </Button>
        )}
      </div>

      {loaded && (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No similar questions found.
            </p>
          ) : (
            questions.map((q) => <QuestionCard key={q.id} {...q} />)
          )}
        </div>
      )}
    </section>
  );
}
