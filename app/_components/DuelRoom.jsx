"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Swords, Trophy, Clock, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "./MarkdownRenderer";
import { useUserId } from "@/app/_lib/AuthProvider";
import { useDuelRealtime } from "@/app/_lib/use-duel-realtime";
import {
  getDuel,
  getQuestionsByIds,
  submitDuelAnswer,
  listDuelAnswers,
  acceptDuel,
  declineDuel,
} from "@/app/_lib/data-service";

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function correctAnswerText(question) {
  if (["NUMERICAL", "INTEGER"].includes(question.questionType)) {
    return `${question.correctValue}${question.unit ? " " + question.unit : ""}`;
  }
  if (question.questionType === "MCQ_MULTIPLE") {
    return (question.correctOptionIds ?? []).join(", ");
  }
  return question.correctOption;
}

// Score review shown only once the duel is over — nothing about correctness
// is ever surfaced while the duel is still in progress.
function ResultsList({ questions, myAnswers, oppAnswers }) {
  return (
    <div className="w-full flex flex-col gap-2">
      {questions.map((q, i) => {
        const mine = myAnswers.find((a) => a.question_id === q.id);
        const theirs = oppAnswers.find((a) => a.question_id === q.id);
        return (
          <Card key={q.id} className="p-3 flex items-center gap-3 text-xs">
            <span className="font-semibold shrink-0">Q{i + 1}</span>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-muted-foreground truncate">{q.title}</p>
              <p className="mt-0.5">
                Correct:{" "}
                <span className="font-medium text-foreground">
                  {correctAnswerText(q)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Check
                size={14}
                className={mine?.is_correct ? "text-green-500" : "text-muted-foreground/30"}
              />
              <span className="text-muted-foreground">vs</span>
              <Check
                size={14}
                className={theirs?.is_correct ? "text-green-500" : "text-muted-foreground/30"}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function DuelRoom({ duelId }) {
  const { userId } = useUserId();
  const router = useRouter();

  const [duel, setDuel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [selectedMultiple, setSelectedMultiple] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [questionStartedAt, setQuestionStartedAt] = useState(null);
  const [numericValue, setNumericValue] = useState("");

  const load = useCallback(async () => {
    try {
      const [d, ans] = await Promise.all([
        getDuel(duelId),
        listDuelAnswers(duelId),
      ]);
      setDuel(d);
      setAnswers(ans);
      if (d.question_ids?.length)
        setQuestions(await getQuestionsByIds(d.question_ids));
    } catch (err) {
      console.error("Failed to load duel:", err);
    } finally {
      setLoading(false);
    }
  }, [duelId]);

  useEffect(() => {
    load();
  }, [load]);

  useDuelRealtime(duelId, {
    onDuelUpdate: (updated) => setDuel((d) => ({ ...d, ...updated })),
    onAnswer: (row) => setAnswers((prev) => [...prev, row]),
  });

  useEffect(() => {
    setQuestionStartedAt(Date.now());
    setSelected(null);
    setSelectedMultiple([]);
    setSubmitted(false);
    setNumericValue("");
  }, [index]);

  if (loading || !duel) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 border-t-foreground animate-spin" />
      </div>
    );
  }

  const isPlayer1 = duel.player1_id === userId;
  const me = isPlayer1 ? duel.player1 : duel.player2;
  const opponent = isPlayer1 ? duel.player2 : duel.player1;

  if (duel.status === "waiting") {
    const iAmInvitee = duel.player2_id === userId && duel.player1_id !== userId;
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <Card className="max-w-sm w-full p-6 flex flex-col items-center gap-4 text-center">
          <Swords size={28} className="text-primary" />
          {iAmInvitee ? (
            <>
              <p className="font-semibold">
                {duel.player1?.display_name || duel.player1?.username}{" "}
                challenged you to a duel!
              </p>
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1 rounded-xl"
                  onClick={async () => {
                    await acceptDuel(duelId);
                    load();
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={async () => {
                    await declineDuel(duelId);
                    router.push("/problems");
                  }}
                >
                  Decline
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Waiting for{" "}
              {duel.player2?.display_name ||
                duel.player2?.username ||
                "your opponent"}{" "}
              to accept…
            </p>
          )}
        </Card>
      </div>
    );
  }

  const myAnswers = answers.filter((a) => a.user_id === userId);
  const oppAnswers = answers.filter((a) => a.user_id === opponent?.id);
  const myCorrect = myAnswers.filter((a) => a.is_correct).length;
  const oppCorrect = oppAnswers.filter((a) => a.is_correct).length;

  if (duel.status === "completed") {
    const iWon = duel.winner_id === userId;
    if (iWon) {
      setTimeout(
        () => confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 } }),
        100,
      );
    }
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full flex flex-col gap-4">
          <Card className="p-6 flex flex-col items-center gap-4 text-center">
            <Trophy
              size={32}
              className={iWon ? "text-yellow-500" : "text-muted-foreground"}
            />
            <h2 className="text-xl font-bold">
              {duel.winner_id ? (iWon ? "You won!" : "You lost") : "It's a tie"}
            </h2>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="font-semibold">
                  {me?.display_name || me?.username}
                </p>
                <p className="text-2xl font-bold">{myCorrect}</p>
              </div>
              <span className="text-muted-foreground">vs</span>
              <div>
                <p className="font-semibold">
                  {opponent?.display_name || opponent?.username}
                </p>
                <p className="text-2xl font-bold">{oppCorrect}</p>
              </div>
            </div>
          </Card>

          <ResultsList
            questions={questions}
            myAnswers={myAnswers}
            oppAnswers={oppAnswers}
          />

          <Button
            className="rounded-xl w-full"
            onClick={() => router.push("/problems")}
          >
            Back to Problems
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[index];
  const total = questions.length;

  const isNumerical = question
    ? ["NUMERICAL", "INTEGER"].includes(question.questionType)
    : false;
  const isMultiple = question?.questionType === "MCQ_MULTIPLE";

  function toggleOption(i) {
    if (submitted) return;
    if (isMultiple) {
      setSelectedMultiple((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
      );
    } else {
      setSelected(i);
    }
  }

  async function handleSubmit() {
    if (submitted || !question) return;

    let isCorrect;
    let selectedAnswer;

    if (isNumerical) {
      if (numericValue === "") return;
      const tolerance = question.tolerance ?? 0;
      isCorrect =
        Math.abs(parseFloat(numericValue) - (question.correctValue ?? 0)) <=
        tolerance;
      selectedAnswer = { type: "numerical", value: numericValue };
    } else if (isMultiple) {
      if (selectedMultiple.length === 0) return;
      const options = question.options ?? [];
      const chosenIds = selectedMultiple
        .map((i) => options[i]?.id)
        .filter(Boolean);
      const correctIds = question.correctOptionIds ?? [];
      isCorrect =
        chosenIds.length === correctIds.length &&
        chosenIds.every((id) => correctIds.includes(id));
      selectedAnswer = { type: "mcq_multiple", optionIds: chosenIds };
    } else {
      if (selected === null) return;
      const options = question.options ?? [];
      const chosenId = options[selected]?.id;
      isCorrect = chosenId === question.correctOption;
      selectedAnswer = { type: "mcq_single", optionId: chosenId };
    }

    setSubmitted(true);
    const timeTakenMs = Date.now() - questionStartedAt;

    try {
      await submitDuelAnswer({
        duelId,
        userId,
        questionId: question.id,
        isCorrect,
        timeTakenMs,
        selectedAnswer,
      });
      setAnswers((prev) => [
        ...prev,
        {
          duel_id: duelId,
          user_id: userId,
          question_id: question.id,
          is_correct: isCorrect,
          time_taken_ms: timeTakenMs,
        },
      ]);
    } catch (err) {
      console.error("Failed to submit duel answer:", err);
      setSubmitted(false);
    }
  }

  function handleNext() {
    if (index + 1 < total) setIndex((i) => i + 1);
  }

  const oppAnsweredThis = oppAnswers.some(
    (a) => a.question_id === question?.id,
  );

  const canSubmit = isNumerical
    ? numericValue !== ""
    : isMultiple
      ? selectedMultiple.length > 0
      : selected !== null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {getInitials(me?.display_name || me?.username)}
            </div>
            <div>
              <p className="text-sm font-semibold">You</p>
              <p className="text-xs text-muted-foreground">
                {myCorrect} correct
              </p>
            </div>
          </div>

          <Badge variant="outline" className="rounded-full">
            Q{index + 1}/{total}
          </Badge>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-semibold">
                {opponent?.display_name || opponent?.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {oppCorrect} correct
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
              {getInitials(opponent?.display_name || opponent?.username)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
        {question && (
          <Card className="p-6 flex flex-col gap-4">
            <MarkdownRenderer>{question.question}</MarkdownRenderer>

            {isNumerical ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter value…"
                    value={numericValue}
                    onChange={(e) => setNumericValue(e.target.value)}
                    disabled={submitted}
                    className="h-12 rounded-xl text-base font-mono"
                  />
                  {question.unit && (
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {question.unit}
                    </span>
                  )}
                </div>
                {submitted && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Check size={14} className="text-primary" />
                    Answer submitted
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {isMultiple && (
                  <p className="text-xs text-muted-foreground -mt-1">
                    Select all that apply
                  </p>
                )}
                {(question.options ?? []).map((opt, i) => {
                  const isSelected = isMultiple
                    ? selectedMultiple.includes(i)
                    : selected === i;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      onClick={() => toggleOption(i)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm font-medium transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-muted",
                        submitted && "cursor-not-allowed opacity-90",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                          isMultiple ? "rounded-md" : "rounded-full",
                          isSelected
                            ? "bg-primary-foreground/15 text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isSelected && isMultiple ? (
                          <Check size={13} />
                        ) : (
                          opt.id
                        )}
                      </span>
                      <MarkdownRenderer inline>{opt.text}</MarkdownRenderer>
                      {isSelected && !isMultiple && (
                        <CheckCheck size={14} className="ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                {oppAnsweredThis
                  ? "Opponent has answered"
                  : "Opponent still thinking…"}
              </div>
              {!submitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="rounded-xl"
                >
                  Submit
                </Button>
              ) : index + 1 < total ? (
                <Button onClick={handleNext} className="rounded-xl">
                  Next question
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Waiting for {opponent?.display_name || "opponent"} to finish…
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
