"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "../Spinner";
import {
  getQuestionById,
  getQuestions,
  getSolvedQuestionForUser,
  recordSolvedQuestion,
  getUserStats,
  getLastSolveDate,
} from "@/app/_lib/data-service";
import ProblemHeader from "./ProblemHeader";
import ProblemCard from "./ProblemCard";
import TagList from "./TagList";
import HintsSection from "./HintsSection";
import AnswerPanel from "./AnswerPanel";
import MobileAnswerSheet from "./MobileAnswerSheet";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";
import SimilarQuestions from "../SimilarQuestions";
import YouTubeEmbed from "./YouTubeEmbed";
import { useUser } from "@/app/_lib/AuthProvider";
import { showToast } from "@/app/_lib/toast";

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useTimer(running) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { timerStr: `${mm}:${ss}`, seconds };
}

// ─── SolveProblemScreen ───────────────────────────────────────────────────────

export default function SolveProblemScreen({ questionId }) {
  const [question, setQuestion] = useState(null);
  const [allIds, setAllIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [previousValue, setPreviousValue] = useState(""); // restored typed value for numerical questions
  const [submitted, setSubmitted] = useState(false);
  const [checkingPrior, setCheckingPrior] = useState(true);
  const [attemptCount, setAttemptCount] = useState(1);
  const [justAnswered, setJustAnswered] = useState(false); // true only right after a fresh submit, not on load/restore
  const [bookmarked, setBookmarked] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [earnedXP, setEarnedXP] = useState(null); // actual XP awarded once answered — null beforehand

  const { timerStr, seconds: elapsedSeconds } = useTimer(!submitted);
  const { user, loading: authLoading } = useUser();

  function celebrateStreak(streak) {
    confetti({
      particleCount: 120,
      spread: 75,
      startVelocity: 40,
      origin: { y: 0.15 },
      zIndex: 9999,
    });
    showToast.streak(streak);
  }

  // Fetch all IDs once for navigation
  useEffect(() => {
    getQuestions({ limit: 500 }).then((qs) => {
      const ids = qs.map((q) => q.id);
      setAllIds(ids);
      const idx = ids.indexOf(questionId);
      if (idx !== -1) setCurrentIndex(idx);
    });
  }, []);

  const loadQuestion = useCallback(async (id) => {
    try {
      const q = await getQuestionById(id);
      // Reset everything in the SAME batch as setQuestion — if this reset
      // lived in a separate effect keyed on question?.id, there'd be one
      // render where the new question's content is up but submitted/selected
      // still held the previous question's values (the "wrong answer" flash
      // on an unanswered question, or on Next/Previous click).
      setQuestion(q);
      setSelected(null);
      setPreviousValue("");
      setSubmitted(false);
      setCheckingPrior(true);
      setAttemptCount(1);
      setJustAnswered(false);
      setRevealedHints(0);
      setMobileSheetOpen(false);
      setXpAnimating(false);
      setEarnedXP(null);
      setError(null);
    } catch (e) {
      setError(e);
    }
  }, []);

  useEffect(() => {
    setPageLoading(true);
    loadQuestion(questionId).finally(() => setPageLoading(false));
  }, [questionId, loadQuestion]);

  // Once the question (and its reset state) has landed, check whether the
  // user already solved it — if so, lock the panel and restore what they
  // picked, so they can't farm XP by navigating away and back.
  useEffect(() => {
    if (!question) return;
    if (authLoading) return; // wait for auth to resolve before deciding

    if (!user) {
      setCheckingPrior(false);
      return;
    }

    let cancelled = false;

    getSolvedQuestionForUser(user.id, question.id)
      .then((prior) => {
        if (cancelled) return;
        setSubmitted(!!prior);

        if (prior) {
          setAttemptCount(prior.attempts ?? 1);
          setEarnedXP(prior.xp_earned ?? null);

          if (prior.selected_option) {
            const isNumerical = ["NUMERICAL", "INTEGER"].includes(
              question.questionType,
            );
            if (isNumerical) {
              setPreviousValue(prior.selected_option);
            } else {
              const priorOptions = (question.options ?? []).map((o) => ({
                label: o.id,
                text: o.text,
              }));
              const idx = priorOptions.findIndex(
                (o) => o.label === prior.selected_option,
              );
              if (idx !== -1) setSelected(idx);
            }
          }
        }

        setCheckingPrior(false);
      })
      .catch((err) => {
        console.error("Failed to check prior attempt:", err);
        if (!cancelled) setCheckingPrior(false);
      });

    return () => {
      cancelled = true;
    };
  }, [question?.id, user?.id, authLoading]);

  const navigate = useCallback(
    async (newIndex) => {
      const id = allIds[newIndex];
      if (!id) return;
      setNavLoading(true);
      setCurrentIndex(newIndex);
      await loadQuestion(id);
      setNavLoading(false);
    },
    [allIds, loadQuestion],
  );

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < allIds.length - 1;

  function goNext() {
    if (canNext) navigate(currentIndex + 1);
  }
  function goPrev() {
    if (canPrev) navigate(currentIndex - 1);
  }

  // ← → keyboard navigation
  useEffect(() => {
    function onKey(e) {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, allIds]);

  async function handleSubmit(value) {
    if (submitted) return; // already answered — block re-submission entirely
    if (checkingPrior) return; // still confirming whether this was answered before
    if (selected === null && value === undefined) return;

    setSubmitted(true);
    setJustAnswered(true);
    setMobileSheetOpen(false);

    const isNumerical = ["NUMERICAL", "INTEGER"].includes(
      question?.questionType,
    );
    const options = (question?.options ?? []).map((o) => ({
      label: o.id,
      text: o.text,
    }));
    const correctIndex = options.findIndex(
      (o) => o.label === question?.correctOption,
    );
    const isCorrect = isNumerical
      ? Math.abs(parseFloat(value) - (question?.correctValue ?? 0)) <=
        (question?.data?.tolerance ?? 0)
      : selected === correctIndex;

    const selectedOption = isNumerical
      ? value != null
        ? String(value)
        : null
      : (options[selected]?.label ?? null);

    if (isCorrect) {
      setXpAnimating(true);
      setTimeout(() => setXpAnimating(false), 1200);
    }

    // XP tapers on two axes: attempt count (first try vs retry) and speed
    // (within the question's estimated time vs over it) — a slow first-try
    // solve or a fast retry both land in the middle, a slow retry earns least.
    const firstTry = attemptCount === 1;
    const withinTime = question?.estimatedTimeSeconds
      ? elapsedSeconds <= question.estimatedTimeSeconds
      : true; // no estimate on this question — don't penalize for it

    let xpEarned = 0;
    if (isCorrect) {
      if (firstTry && withinTime) {
        xpEarned = XP;
      } else if (firstTry && !withinTime) {
        xpEarned = Math.round(XP * 0.75);
      } else if (!firstTry && withinTime) {
        xpEarned = Math.round(XP / 2);
      } else {
        xpEarned = Math.round(XP / 4);
      }
    }
    setEarnedXP(xpEarned);

    // Check BEFORE recording whether this is the first solve of a new
    // calendar day — grounded directly in solved_questions.solved_at rather
    // than user_stats.streak, so it works even if the streak-maintaining
    // trigger isn't deployed correctly. Must run before recordSolvedQuestion,
    // since after that call "last solve" would already be today.
    let shouldCelebrate = false;
    if (user) {
      try {
        const lastSolveAt = await getLastSolveDate(user.id);
        if (lastSolveAt) {
          const lastDay = new Date(lastSolveAt);
          lastDay.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          shouldCelebrate = today.getTime() > lastDay.getTime();
        }
        // lastSolveAt === null means this is their first-ever solve —
        // nothing to "extend" yet, so no celebration on day one.
      } catch (err) {
        console.error("Failed to check last solve date:", err);
      }
    }

    recordSolvedQuestion({
      user_id: user?.id ?? null, // anonymous attempts are still recorded, just unattributed
      question_id: question.id,
      is_correct: isCorrect,
      xp_earned: user ? xpEarned : 0,
      time_taken: elapsedSeconds,
      attempts: attemptCount,
      selected_option: selectedOption,
    })
      .then(() => {
        if (!user || !shouldCelebrate) return;
        return getUserStats(user.id).then((stats) => {
          celebrateStreak(stats?.streak ?? 1);
        });
      })
      .catch((err) => {
        console.error("Failed to record solved question:", err);
      });

    if (!user) {
      showToast.info(
        "Answer recorded",
        "Sign in to save XP and streaks to your profile.",
      );
    }
  }

  function handleRetry() {
    setSubmitted(false);
    setSelected(null);
    setPreviousValue("");
    setJustAnswered(false);
    setEarnedXP(null);
    setAttemptCount((c) => c + 1);
  }

  if (pageLoading) return <LoadingScreen />;
  if (error || !question)
    return <ErrorScreen onRetry={() => loadQuestion(questionId)} />;

  const XP = question.marks * 25;
  const displayXp = submitted && earnedXP !== null ? earnedXP : XP;
  const progress =
    allIds.length > 0
      ? Math.round(((currentIndex + 1) / allIds.length) * 100)
      : 0;

  const isNumerical = ["NUMERICAL", "INTEGER"].includes(question.questionType);
  const options = (question.options ?? []).map((o) => ({
    label: o.id,
    text: o.text,
  }));
  const mobileLabel = isNumerical
    ? "Enter answer"
    : selected === null
      ? "Choose answer"
      : `Selected ${options[selected]?.label} — Submit`;

  const answerPanel = (
    <AnswerPanel
      question={question}
      xp={displayXp}
      submitted={submitted}
      selected={selected}
      previousValue={previousValue}
      attemptCount={attemptCount}
      justAnswered={justAnswered}
      onSelect={setSelected}
      onSubmit={handleSubmit}
      onRetry={handleRetry}
      onNext={goNext}
    />
  );

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <ProblemHeader
        submitted={submitted}
        timerStr={timerStr}
        xpAnimating={xpAnimating}
        bookmarked={bookmarked}
        onBookmark={() => setBookmarked((b) => !b)}
        progress={progress}
        current={currentIndex + 1}
        total={allIds.length || 1}
        topic={question.chapter}
        title={question.title}
        subject={question.subject}
        xp={displayXp}
      />

      {/*
        Two-column grid:
          left  → question content + similar questions
          right → sticky answer panel + prev/next (no scrolling needed)
      */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-36 lg:pb-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-4">
          {navLoading ? (
            <div className="flex items-center justify-center py-32">
              <Spinner size={36} />
            </div>
          ) : (
            <>
              <ProblemCard
                number={currentIndex + 1}
                title={question.title}
                meta={`${question.chapter} · ${question.time} · ${XP} XP · ${question.exam}`}
                body={question.question}
                images={question.images}
              />
              <TagList tags={question.tags} />
              <HintsSection
                hints={question.hints}
                revealedHints={revealedHints}
                onReveal={() => setRevealedHints((h) => h + 1)}
              />
              <YouTubeEmbed videoId={"TM-1xPdYJSA"} />

              {/* Similar questions live in the left column, not as a loose grid child */}
              <SimilarQuestions
                subject={question.subject}
                chapter={question.chapter}
                topic={question.topic}
                currentQuestionId={question.id}
              />
            </>
          )}
        </div>
        {/* ── Right column (desktop only) — sticky so nav is always visible ── */}
        <aside className="hidden lg:flex flex-col gap-3 sticky top-[110px]">
          <Card className="overflow-hidden">{answerPanel}</Card>

          {/* Prev / Next always in view — no scrolling required */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={!canPrev}
              className="rounded-xl gap-1.5 py-4"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button
              variant={submitted ? "default" : "outline"}
              onClick={goNext}
              disabled={!canNext}
              className="rounded-xl gap-1.5 py-4"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground select-none">
            Tip: use{" "}
            <kbd className="px-1.5 py-0.5 rounded border bg-muted text-[11px] font-mono">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 rounded border bg-muted text-[11px] font-mono">
              →
            </kbd>{" "}
            to navigate
          </p>
        </aside>
      </main>
      {/* Mobile sticky footer — prev / next */}
      {/* <ProblemFooter
        submitted={submitted}
        currentIndex={currentIndex}
        total={allIds.length || 1}
        onPrev={goPrev}
        onNext={goNext}
      /> */}

      {/* Mobile answer button — sits above the footer (not on top of it) */}
      <div className="fixed bottom-[26px] left-0 right-0 px-5 z-40 lg:hidden">
        <Button
          onClick={() => setMobileSheetOpen(true)}
          className="w-full py-4 rounded-2xl text-[15px] font-bold shadow-[0_8px_32px_rgba(0,0,0,0.25)] h-auto gap-2"
        >
          <Award size={16} />
          {mobileLabel}
        </Button>
      </div>

      <MobileAnswerSheet
        open={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
      >
        {answerPanel}
      </MobileAnswerSheet>
    </div>
  );
}
