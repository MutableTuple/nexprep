"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Atom,
  FlaskConical,
  Calculator,
  BookOpen,
  CheckCircle2,
  PartyPopper,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_SUBJECTS = [
  {
    subject: "Physics",
    solved: 480,
    total: 600,
    icon: Atom,
    color: "bg-blue-500",
    ring: "text-blue-500",
    soft: "bg-blue-500/10",
  },
  {
    subject: "Chemistry",
    solved: 390,
    total: 550,
    icon: FlaskConical,
    color: "bg-emerald-500",
    ring: "text-emerald-500",
    soft: "bg-emerald-500/10",
  },
  {
    subject: "Mathematics",
    solved: 500,
    total: 500,
    icon: Calculator,
    color: "bg-purple-500",
    ring: "text-purple-500",
    soft: "bg-purple-500/10",
  },
];

export default function SubjectProgress({ data, onChange }) {
  const [subjects, setSubjects] = useState(data ?? DEFAULT_SUBJECTS);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState({ solved: "", total: "" });

  useEffect(() => {
    if (data) setSubjects(data);
  }, [data]);

  const totalSolved = subjects.reduce((a, s) => a + s.solved, 0);
  const totalQuestions = subjects.reduce((a, s) => a + s.total, 0);
  const overallPct = totalQuestions
    ? Math.round((totalSolved / totalQuestions) * 100)
    : 0;

  function startEdit(i) {
    setEditingIndex(i);
    setDraft({
      solved: String(subjects[i].solved),
      total: String(subjects[i].total),
    });
  }

  function cancelEdit() {
    setEditingIndex(null);
  }

  function saveEdit(i) {
    const total = Math.max(0, parseInt(draft.total, 10) || 0);
    const solved = Math.min(
      Math.max(0, parseInt(draft.solved, 10) || 0),
      total,
    );

    const updated = subjects.map((s, idx) =>
      idx === i ? { ...s, solved, total } : s,
    );
    setSubjects(updated);
    setEditingIndex(null);
    onChange?.(updated, updated[i]);
  }

  function handleKeyDown(e, i) {
    if (e.key === "Enter") saveEdit(i);
    if (e.key === "Escape") cancelEdit();
  }

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
          <span className="text-xs font-medium text-muted-foreground">
            {totalSolved.toLocaleString()} / {totalQuestions.toLocaleString()}{" "}
            <span className="text-foreground">({overallPct}%)</span>
          </span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-6 py-5 flex flex-col gap-3">
        {subjects.map((s, i) => {
          const pct = s.total ? Math.round((s.solved / s.total) * 100) : 0;
          const isComplete = pct >= 100;
          const isEditing = editingIndex === i;
          const Icon = isComplete ? CheckCircle2 : s.icon;

          return (
            <div
              key={s.subject}
              className={cn(
                "group rounded-xl p-3 -mx-3",
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

                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      autoFocus
                      value={draft.solved}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, solved: e.target.value }))
                      }
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="h-7 w-16 px-2 text-xs text-center"
                    />
                    <span className="text-xs text-muted-foreground">/</span>
                    <Input
                      type="number"
                      min={0}
                      value={draft.total}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, total: e.target.value }))
                      }
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="h-7 w-16 px-2 text-xs text-center"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(i)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-emerald-500 hover:bg-emerald-500/10"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
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
                    <button
                      type="button"
                      onClick={() => startEdit(i)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
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
