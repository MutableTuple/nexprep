"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import { Spinner } from "../Spinner";
import { getIncorrectQuestions } from "@/app/_lib/data-service";
import { useUserId } from "@/app/_lib/AuthProvider";
import SubjectPills from "./SubjectPills";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import QuestionList from "./QuestionList";

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics"];
const PAGE_SIZE = 25;

export default function ErrorNotebookScreen() {
  const { userId, loading: authLoading } = useUserId();

  const [activeSubject, setActiveSubject] = useState("All");
  const [page, setPage] = useState(1);

  const [questions, setQuestions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncorrect = useCallback(async (subject, pageNum, forUserId) => {
    setLoading(true);
    setError(null);
    try {
      const { questions: data, count } = await getIncorrectQuestions(
        forUserId,
        { subject, page: pageNum, limit: PAGE_SIZE },
      );
      setQuestions(data);
      setTotalCount(count);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    fetchIncorrect(activeSubject, page, userId);
  }, [activeSubject, page, userId, authLoading, fetchIncorrect]);

  function handleSubjectChange(subject) {
    setActiveSubject(subject);
    setPage(1);
  }

  const hasMore = page * PAGE_SIZE < totalCount;

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size={40} />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <NotebookPen size={36} className="text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">
          Sign in to see your error notebook
        </p>
        <p className="text-sm text-muted-foreground">
          Every question you get wrong is collected here until you get it
          right.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <NotebookPen size={20} />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Error Notebook
            </span>
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            Questions you got wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            Every question here is one your latest attempt got wrong. Solve
            it correctly and it drops off the list on its own.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">
        <SubjectPills
          subjects={SUBJECTS}
          active={activeSubject}
          onChange={handleSubjectChange}
        />

        {error ? (
          <ErrorState
            onRetry={() => fetchIncorrect(activeSubject, page, userId)}
          />
        ) : loading ? (
          <LoadingState message="Loading your mistakes…" />
        ) : questions.length === 0 ? (
          totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <NotebookPen size={36} className="text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">
                Nothing to review
              </p>
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any incorrect answers right now. Keep it
                that way.
              </p>
            </div>
          ) : (
            <EmptyState onClear={() => handleSubjectChange("All")} />
          )
        ) : (
          <QuestionList questions={questions} />
        )}

        {!error && !loading && totalCount > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
