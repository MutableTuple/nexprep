"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Atom,
  FlaskConical,
  Calculator,
  BookOpen,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/app/_lib/supabase";
import { useUserId } from "@/app/_lib/AuthProvider";

const SUBJECT_CONFIG = {
  Physics: {
    icon: Atom,
    color: "bg-blue-500",
    ring: "text-blue-500",
    soft: "bg-blue-500/10",
  },
  Chemistry: {
    icon: FlaskConical,
    color: "bg-emerald-500",
    ring: "text-emerald-500",
    soft: "bg-emerald-500/10",
  },
  Mathematics: {
    icon: Calculator,
    color: "bg-purple-500",
    ring: "text-purple-500",
    soft: "bg-purple-500/10",
  },
};

export default function SubjectProgress() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, loading: authLoading } = useUserId();

  useEffect(() => {
    if (!userId) return;

    async function fetch() {
      setLoading(true);

      const [{ data: totals }, { data: solved }] = await Promise.all([
        // total published questions per subject
        supabase.from("questions").select("subject").eq("status", "published"),

        // questions this user has attempted (distinct) per subject
        supabase
          .from("solved_questions")
          .select("question_id, questions!inner(subject)")
          .eq("user_id", userId),
      ]);

      // count totals per subject
      const totalMap = {};
      for (const q of totals ?? []) {
        totalMap[q.subject] = (totalMap[q.subject] ?? 0) + 1;
      }

      // count distinct solved per subject (deduplicate question_id)
      const solvedMap = {};
      const seen = new Set();
      for (const row of solved ?? []) {
        const key = `${row.question_id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const subject = row.questions?.subject;
        if (subject) solvedMap[subject] = (solvedMap[subject] ?? 0) + 1;
      }

      const result = Object.keys(SUBJECT_CONFIG).map((subject) => ({
        subject,
        total: totalMap[subject] ?? 0,
        solved: solvedMap[subject] ?? 0,
        ...SUBJECT_CONFIG[subject],
      }));

      setSubjects(result);
      setLoading(false);
    }

    fetch();
  }, [userId]);

  const totalSolved = subjects.reduce((a, s) => a + s.solved, 0);
  const totalQuestions = subjects.reduce((a, s) => a + s.total, 0);
  const overallPct = totalQuestions
    ? Math.round((totalSolved / totalQuestions) * 100)
    : 0;

  return (
    <Card className="bg-card border-border shadow-none rounded-2xl overflow-hidden">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
              <BookOpen size={14} className="text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Subject Progress
            </h3>
          </div>
          {!loading && (
            <span className="text-xs font-medium text-muted-foreground">
              {totalSolved.toLocaleString()} / {totalQuestions.toLocaleString()}{" "}
              <span className="text-foreground">({overallPct}%)</span>
            </span>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-6 py-5 flex flex-col gap-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl p-3 -mx-3 animate-pulse">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-16 rounded bg-muted" />
                </div>
                <div className="h-2 w-full rounded-full bg-muted" />
              </div>
            ))
          : subjects.map((s) => {
              const pct = s.total ? Math.round((s.solved / s.total) * 100) : 0;
              const isComplete = pct >= 100;
              const Icon = isComplete ? CheckCircle2 : s.icon;

              return (
                <div
                  key={s.subject}
                  className={cn(
                    "rounded-xl p-3 -mx-3",
                    isComplete && "bg-emerald-500/5 ring-1 ring-emerald-500/20",
                  )}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg",
                          isComplete ? "bg-emerald-500/15" : s.soft,
                        )}
                      >
                        <Icon
                          size={14}
                          className={isComplete ? "text-emerald-500" : s.ring}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {s.subject}
                      </span>
                    </div>

                    {isComplete ? (
                      <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 border-0 font-medium">
                        <PartyPopper size={11} />
                        Completed
                      </Badge>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          {pct}%
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          ({s.solved}/{s.total})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isComplete
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                          : s.color,
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
      </CardContent>
    </Card>
  );
}
