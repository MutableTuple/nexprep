"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Spinner } from "../Spinner";
import { getQuestions } from "@/app/_lib/data-service";

import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import DifficultyFilter from "./DifficultyFilter";
import SubjectPills from "./SubjectPills";
import ActiveFilters from "./ActiveFilters";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import QuestionList from "./QuestionList";

// ─── Constants ─────────────────────────────────────────────────────────────────

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const PAGE_SIZE = 50;

// ─── Hook ──────────────────────────────────────────────────────────────────────

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ProblemScreen() {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");
  const [activeDiffs, setActiveDiffs] = useState([]);
  const [page, setPage] = useState(1);

  const [questions, setQuestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 400);
  const abortRef = useRef(null);

  const fetchQuestions = useCallback(
    async (subject, difficulties, search, pageNum) => {
      // cancel previous in-flight request
      if (abortRef.current) abortRef.current = false;
      const token = {};
      abortRef.current = token;

      setLoading(true);
      setError(null);

      try {
        const data = await getQuestions({
          subject,
          difficulties,
          search,
          page: pageNum,
          limit: PAGE_SIZE,
        });
        if (token !== abortRef.current) return;

        setQuestions(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        if (token !== abortRef.current) return;
        setError(err);
      } finally {
        if (token === abortRef.current) setLoading(false);
      }
    },
    [],
  );

  // Re-fetch whenever filters, debounced search, or page change
  useEffect(() => {
    fetchQuestions(activeSubject, activeDiffs, debouncedQuery, page);
  }, [activeSubject, activeDiffs, debouncedQuery, page, fetchQuestions]);

  function handleQueryChange(value) {
    setQuery(value);
    setPage(1);
  }

  function handleSubjectChange(subject) {
    setActiveSubject(subject);
    setPage(1);
  }

  function toggleDiff(d) {
    setActiveDiffs((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
    setPage(1);
  }

  function clearDiffs() {
    setActiveDiffs([]);
    setPage(1);
  }

  function clearAll() {
    setQuery("");
    setActiveSubject("All");
    setActiveDiffs([]);
    setPage(1);
  }

  // Initial full-screen loader
  if (loading && questions.length === 0 && !error && page === 1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={48} />
          <p className="text-sm text-muted-foreground tracking-wide">
            Loading problems…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HeroSection />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBar
            query={query}
            onChange={handleQueryChange}
            loading={loading}
          />
          <DifficultyFilter
            activeDiffs={activeDiffs}
            onToggle={toggleDiff}
            onClear={clearDiffs}
          />
        </div>

        <SubjectPills
          subjects={SUBJECTS}
          active={activeSubject}
          onChange={handleSubjectChange}
        />

        <ActiveFilters
          activeSubject={activeSubject}
          activeDiffs={activeDiffs}
          query={query}
          onRemoveSubject={() => handleSubjectChange("All")}
          onRemoveDiff={toggleDiff}
          onRemoveQuery={() => handleQueryChange("")}
          onClearAll={clearAll}
        />
        {!error && !loading && questions.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
        {error ? (
          <ErrorState
            onRetry={() =>
              fetchQuestions(activeSubject, activeDiffs, debouncedQuery, page)
            }
          />
        ) : loading ? (
          <LoadingState />
        ) : questions.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <QuestionList questions={questions} />
        )}

        {!error && !loading && questions.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
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
