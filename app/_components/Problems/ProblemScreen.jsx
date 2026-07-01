"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Flame,
  Trophy,
  Target,
  X,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import QuestionCard from "./QuestionCard";
import { Spinner } from "../Spinner";
import { getQuestions } from "@/app/_lib/data-service";
import GlassCard from "./GlassCard";
import StatCard from "./StatCard";
import FilterChip from "./FilterChip";
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

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 400);
  const abortRef = useRef(null);

  const fetchQuestions = useCallback(async (subject, difficulties, search) => {
    // cancel previous in-flight request
    if (abortRef.current) abortRef.current = false;
    const token = {};
    abortRef.current = token;

    setLoading(true);
    setError(null);

    try {
      const data = await getQuestions({ subject, difficulties, search });
      if (token !== abortRef.current) return;

      setQuestions(data);
    } catch (err) {
      if (token !== abortRef.current) return;
      setError(err);
    } finally {
      if (token === abortRef.current) setLoading(false);
    }
  }, []);

  // Re-fetch whenever filters or debounced search change
  useEffect(() => {
    fetchQuestions(activeSubject, activeDiffs, debouncedQuery);
  }, [activeSubject, activeDiffs, debouncedQuery, fetchQuestions]);

  function toggleDiff(d) {
    setActiveDiffs((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  function clearAll() {
    setQuery("");
    setActiveSubject("All");
    setActiveDiffs([]);
  }

  // Initial full-screen loader
  if (loading && questions.length === 0 && !error) {
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
          <SearchBar query={query} onChange={setQuery} loading={loading} />
          <DifficultyFilter
            activeDiffs={activeDiffs}
            onToggle={toggleDiff}
            onClear={() => setActiveDiffs([])}
          />
        </div>

        <SubjectPills
          subjects={SUBJECTS}
          active={activeSubject}
          onChange={setActiveSubject}
        />

        <ActiveFilters
          activeSubject={activeSubject}
          activeDiffs={activeDiffs}
          query={query}
          onRemoveSubject={() => setActiveSubject("All")}
          onRemoveDiff={toggleDiff}
          onRemoveQuery={() => setQuery("")}
          onClearAll={clearAll}
        />

        {error ? (
          <ErrorState
            onRetry={() =>
              fetchQuestions(activeSubject, activeDiffs, debouncedQuery)
            }
          />
        ) : loading ? (
          <LoadingState />
        ) : questions.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <QuestionList questions={questions} />
        )}
      </div>
    </div>
  );
}
