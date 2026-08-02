"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import { Spinner } from "../Spinner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getQuestions, getUserPreferences } from "@/app/_lib/data-service";
import { useUserId } from "@/app/_lib/AuthProvider";
import { trackEvent } from "@/app/_lib/analytics";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import DifficultyFilter from "./DifficultyFilter";
import StatusFilter from "./StatusFilter";
import SubjectPills from "./SubjectPills";
import ActiveFilters from "./ActiveFilters";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import QuestionList from "./QuestionList";
import GoalsProgress from "./GoalsProgress";

// ─── Constants ─────────────────────────────────────────────────────────────────

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const PAGE_SIZE = 50;

// unsolved first, then attempted-but-wrong, then correctly solved last
const STATUS_RANK = { unsolved: 0, incorrect: 1, solved: 2 };

function getStatusGroup(question) {
  if (!question.solved) return "unsolved";
  return question.solvedCorrect ? "solved" : "incorrect";
}

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
  const [statusFilter, setStatusFilter] = useState(null); // null | "unsolved" | "incorrect" | "solved"
  const [page, setPage] = useState(1);
  const [showInline, setShowInline] = useState(false); // question cards default expanded vs click-through

  function handleShowInlineChange(next) {
    setShowInline(next);
    trackEvent("problem_list_display_mode_changed", {
      mode: next ? "inline" : "click_through",
    });
  }

  const [questions, setQuestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 400);
  const abortRef = useRef(null);
  const { userId, loading: authLoading } = useUserId();

  // Apply the user's saved default-subject preference once, and only if
  // they haven't already picked a subject themselves by the time it loads.
  const appliedDefaultSubjectRef = useRef(false);
  useEffect(() => {
    if (authLoading || !userId || appliedDefaultSubjectRef.current) return;
    appliedDefaultSubjectRef.current = true;

    getUserPreferences(userId).then((prefs) => {
      if (prefs?.default_subject && SUBJECTS.includes(prefs.default_subject)) {
        setActiveSubject((current) =>
          current === "All" ? prefs.default_subject : current,
        );
      }
    });
  }, [authLoading, userId]);

  const fetchQuestions = useCallback(
    async (subject, difficulties, search, pageNum, forUserId) => {
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
          userId: forUserId,
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

  // Re-fetch whenever filters, debounced search, page, or auth state change
  useEffect(() => {
    if (authLoading) return;
    fetchQuestions(activeSubject, activeDiffs, debouncedQuery, page, userId);
  }, [
    activeSubject,
    activeDiffs,
    debouncedQuery,
    page,
    userId,
    authLoading,
    fetchQuestions,
  ]);

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
    setStatusFilter(null);
    setPage(1);
  }

  // Sort unsolved → incorrect → solved within whatever page is currently
  // loaded, then apply the status filter on top. This operates on the
  // already-fetched batch rather than the DB query, since solved status is
  // joined in client-side per user — so it reorders/filters within a page
  // rather than across the full result set.
  const displayQuestions = useMemo(() => {
    const sorted = [...questions].sort(
      (a, b) => STATUS_RANK[getStatusGroup(a)] - STATUS_RANK[getStatusGroup(b)],
    );
    if (!statusFilter) return sorted;
    return sorted.filter((q) => getStatusGroup(q) === statusFilter);
  }, [questions, statusFilter]);

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
        <GoalsProgress userId={userId} />

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

        <div className="flex items-center gap-2.5">
          <Switch
            id="show-inline-toggle"
            checked={showInline}
            onCheckedChange={handleShowInlineChange}
          />
          <Label htmlFor="show-inline-toggle" className="text-sm font-normal">
            {showInline
              ? "Showing questions inline"
              : "Click a question to open it"}
          </Label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusFilter active={statusFilter} onChange={setStatusFilter} />
          {userId && (
            <Link
              href="/error-notebook"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <NotebookPen size={15} />
              Review your mistakes
            </Link>
          )}
        </div>

        <ActiveFilters
          activeSubject={activeSubject}
          activeDiffs={activeDiffs}
          activeStatus={statusFilter}
          query={query}
          onRemoveSubject={() => handleSubjectChange("All")}
          onRemoveDiff={toggleDiff}
          onRemoveStatus={() => setStatusFilter(null)}
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
              fetchQuestions(
                activeSubject,
                activeDiffs,
                debouncedQuery,
                page,
                userId,
              )
            }
          />
        ) : loading ? (
          <LoadingState />
        ) : displayQuestions.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <QuestionList questions={displayQuestions} defaultExpanded={showInline} />
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
