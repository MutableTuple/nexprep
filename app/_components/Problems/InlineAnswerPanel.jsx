"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MarkdownRenderer from "../MarkdownRenderer";
import AnswerOption from "./AnswerOption";
import { recordSolvedQuestion } from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";
import { trackEvent } from "@/app/_lib/analytics";
import { useBadgeUnlockCheck } from "../BadgeUnlockProvider";

const NUMERICAL_TYPES = ["NUMERICAL", "INTEGER"];

export default function InlineAnswerPanel({
  question,
  userId,
  questionId,
  subject,
  difficulty,
  questionType,
  options: rawOptions,
  correctOption,
  correctValue,
  tolerance,
  unit,
  xp,
  attemptsCount,
  alreadySolved,
  alreadyCorrect,
  onSolved,
}) {
  const isNumerical = NUMERICAL_TYPES.includes(questionType);
  const options = (rawOptions ?? []).map((o) => ({ label: o.id, text: o.text }));
  const correctIndex = options.findIndex((o) => o.label === correctOption);
  const checkForBadges = useBadgeUnlockCheck();

  const [selected, setSelected] = useState(null);
  const [numValue, setNumValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null); // { isCorrect, xpEarned } | null
  const [submitting, setSubmitting] = useState(false);

  // Already-correct questions render read-only here — retrying belongs on
  // the full solve page, which already has the proper attempt-tracking UX.
  const readOnly = alreadySolved && alreadyCorrect;

  async function handleSubmit() {
    if (!userId) {
      showToast.info("Sign in required", "Sign in to submit an answer.");
      return;
    }
    if (isNumerical ? numValue === "" : selected === null) return;

    const isCorrect = isNumerical
      ? Math.abs(parseFloat(numValue) - (correctValue ?? 0)) <= (tolerance ?? 0)
      : selected === correctIndex;

    const firstTry = !alreadySolved;
    const xpEarned = isCorrect ? (firstTry ? xp : Math.round(xp / 2)) : 0;
    const selectedOption = isNumerical
      ? String(numValue)
      : (options[selected]?.label ?? null);

    setSubmitting(true);
    try {
      await recordSolvedQuestion({
        user_id: userId,
        question_id: questionId,
        is_correct: isCorrect,
        xp_earned: xpEarned,
        time_taken: null, // no timer in the inline card view
        attempts: (attemptsCount ?? 0) + 1,
        selected_option: selectedOption,
      });

      setSubmitted(true);
      setResult({ isCorrect, xpEarned });
      if (isCorrect) showToast.correct(xpEarned);
      else showToast.wrong();
      onSolved?.({ isCorrect, xpEarned, attempts: (attemptsCount ?? 0) + 1 });
      checkForBadges(userId);

      trackEvent("inline_answer_submitted", {
        question_id: questionId,
        subject,
        difficulty,
        question_type: questionType,
        is_correct: isCorrect,
        xp_earned: xpEarned,
      });
    } catch (err) {
      showToast.error("Couldn't submit", err.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {/* Left — question */}
      <MarkdownRenderer className="text-[15px] leading-7">
        {question}
      </MarkdownRenderer>

      {/* Right — answer input + submit */}
      <div className="flex flex-col gap-4">
        {readOnly ? (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            You already solved this correctly.
          </p>
        ) : (
          <>
            {isNumerical ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter value…"
                  value={numValue}
                  onChange={(e) => setNumValue(e.target.value)}
                  disabled={submitted}
                  className="h-11 max-w-[180px] rounded-xl font-mono"
                />
                {unit && (
                  <span className="text-sm text-muted-foreground">
                    {unit}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {options.map((opt, i) => (
                  <AnswerOption
                    key={opt.label}
                    opt={opt}
                    index={i}
                    selected={selected}
                    submitted={submitted}
                    correctIndex={correctIndex}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            )}

            {!submitted && (
              <Button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  (isNumerical ? numValue === "" : selected === null)
                }
                className="w-fit rounded-xl font-bold"
              >
                Submit answer
              </Button>
            )}
          </>
        )}

        {submitted && result && (
          <p
            className={
              result.isCorrect
                ? "text-sm font-medium text-green-600 dark:text-green-400"
                : "text-sm font-medium text-red-500 dark:text-red-400"
            }
          >
            {result.isCorrect
              ? `Correct! +${result.xpEarned} XP`
              : "Not quite — open the full page for the step-by-step explanation."}
          </p>
        )}
      </div>
    </div>
  );
}
