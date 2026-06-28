"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Flame,
  Trophy,
  Target,
  X,
  SlidersHorizontal,
} from "lucide-react";
import QuestionCard from "./QuestionCard";
import { Spinner } from "../Spinner";
const ALL_QUESTIONS = [
  {
    id: 1,
    title: "Electrostatic Potential due to Ring",
    difficulty: "Hard",
    subject: "Physics",
    chapter: "Electrostatics",
    xp: 220,
    time: "8 min",
    questions: 456,
  },
  {
    id: 2,
    title: "Binomial Expansion",
    difficulty: "Easy",
    subject: "Mathematics",
    chapter: "Binomial Theorem",
    xp: 90,
    time: "3 min",
    questions: 1294,
    solved: true,
  },
  {
    id: 3,
    title: "Chemical Equilibrium",
    difficulty: "Medium",
    subject: "Chemistry",
    chapter: "Equilibrium",
    xp: 150,
    time: "5 min",
    questions: 892,
    bookmarked: true,
  },
  {
    id: 4,
    title: "Rotation of Rigid Body",
    difficulty: "Hard",
    subject: "Physics",
    chapter: "Rotational Motion",
    xp: 240,
    time: "10 min",
    questions: 337,
  },
  {
    id: 5,
    title: "Thermodynamics First Law",
    difficulty: "Medium",
    subject: "Physics",
    chapter: "Thermodynamics",
    xp: 160,
    time: "6 min",
    questions: 610,
  },
  {
    id: 6,
    title: "Organic Reactions — SN1 vs SN2",
    difficulty: "Hard",
    subject: "Chemistry",
    chapter: "Organic Chemistry",
    xp: 210,
    time: "9 min",
    questions: 298,
  },
  {
    id: 7,
    title: "Limits and Continuity",
    difficulty: "Easy",
    subject: "Mathematics",
    chapter: "Calculus",
    xp: 80,
    time: "3 min",
    questions: 1540,
    solved: true,
  },
  {
    id: 8,
    title: "Wave Optics — YDSE",
    difficulty: "Medium",
    subject: "Physics",
    chapter: "Optics",
    xp: 175,
    time: "7 min",
    questions: 720,
  },
];

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const debouncedQuery = useDebounce(query, 350);
  const prevFilters = useRef({ query: "", subject: "All", diffs: [] });

  // Simulate initial page load
  useEffect(() => {
    const t = setTimeout(() => setInitialLoad(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Simulate search/filter fetch delay
  useEffect(() => {
    if (initialLoad) return;
    const changed =
      prevFilters.current.query !== debouncedQuery ||
      prevFilters.current.subject !== activeSubject ||
      JSON.stringify(prevFilters.current.diffs) !== JSON.stringify(activeDiffs);

    if (!changed) return;
    prevFilters.current = {
      query: debouncedQuery,
      subject: activeSubject,
      diffs: activeDiffs,
    };

    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [debouncedQuery, activeSubject, activeDiffs, initialLoad]);

  const filtered = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      const matchSubject =
        activeSubject === "All" || q.subject === activeSubject;
      const matchDiff =
        activeDiffs.length === 0 || activeDiffs.includes(q.difficulty);
      const matchQuery =
        debouncedQuery === "" ||
        q.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        q.chapter.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchSubject && matchDiff && matchQuery;
    });
  }, [debouncedQuery, activeSubject, activeDiffs]);

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

  const hasActiveFilters =
    activeSubject !== "All" || activeDiffs.length > 0 || query !== "";

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={48} />
          <p className="text-sm text-neutral-400 tracking-wide">
            Loading problems…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                Practice
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
                Problems
              </h1>
              <p className="mt-3 max-w-xl text-neutral-500 text-sm sm:text-base">
                Master JEE by solving curated questions from every chapter.
                Build streaks, earn XP and improve your rank.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                icon={<Flame size={20} />}
                label="Current Streak"
                value="18 Days"
              />
              <StatCard
                icon={<Target size={20} />}
                label="Solved"
                value="1,248"
              />
              <StatCard icon={<Trophy size={20} />} label="XP" value="18,420" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6 sm:py-8">
        {/* Search + Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center rounded-2xl border border-neutral-200 bg-white px-4 gap-2">
            <Search size={18} className="text-neutral-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions, chapters, subjects…"
              className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-neutral-300 hover:text-neutral-500 transition"
              >
                <X size={16} />
              </button>
            )}
            {/* inline search spinner */}
            {loading && <Spinner size={20} />}
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`flex h-14 items-center gap-2 rounded-2xl border px-5 font-medium transition text-sm ${
                activeDiffs.length > 0
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeDiffs.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-neutral-900 text-xs font-bold">
                  {activeDiffs.length}
                </span>
              )}
            </button>

            {/* Filter dropdown */}
            {filterOpen && (
              <div className="absolute right-0 top-16 z-20 w-64 rounded-2xl border border-neutral-200 bg-white shadow-lg p-4">
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">
                  Difficulty
                </p>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDiff(d)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition border ${
                        activeDiffs.includes(d)
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                {activeDiffs.length > 0 && (
                  <button
                    onClick={() => setActiveDiffs([])}
                    className="mt-4 w-full text-xs text-neutral-400 hover:text-neutral-600 transition text-center"
                  >
                    Clear difficulty filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subject Pills */}
        <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
          {SUBJECTS.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSubject(item)}
              className={`rounded-full px-4 sm:px-5 py-2 text-sm font-medium transition ${
                activeSubject === item
                  ? "bg-black text-white"
                  : "border border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400">Active filters:</span>
            {activeSubject !== "All" && (
              <Chip
                label={activeSubject}
                onRemove={() => setActiveSubject("All")}
              />
            )}
            {activeDiffs.map((d) => (
              <Chip key={d} label={d} onRemove={() => toggleDiff(d)} />
            ))}
            {query && (
              <Chip label={`"${query}"`} onRemove={() => setQuery("")} />
            )}
            <button
              onClick={clearAll}
              className="text-xs text-neutral-400 hover:text-neutral-600 underline underline-offset-2 transition ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size={40} />
            <p className="text-sm text-neutral-400">Fetching questions…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-lg font-semibold text-neutral-700">
              No questions found
            </p>
            <p className="text-sm text-neutral-400">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearAll}
              className="mt-2 rounded-xl border border-neutral-200 px-5 py-2 text-sm font-medium hover:border-neutral-300 transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            <p className="text-xs text-neutral-400">
              {filtered.length} question{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map((q) => (
              <QuestionCard key={q.id} {...q} />
            ))}
          </div>
        )}
      </div>

      {/* Close filter panel on outside click */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="text-neutral-500">{icon}</div>
      <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold">{value}</h3>
      <p className="mt-1 text-xs text-neutral-400">{label}</p>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
      {label}
      <button
        onClick={onRemove}
        className="text-neutral-400 hover:text-neutral-600 transition"
      >
        <X size={12} />
      </button>
    </span>
  );
}
