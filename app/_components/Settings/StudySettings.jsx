"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/app/_lib/AuthProvider";
import { useUserPreferences } from "@/app/_lib/use-user-preferences";
import { useUserGoals } from "@/app/_lib/use-user-goals";
import { upsertUserPreferences, upsertUserGoals } from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";

const SUBJECTS = ["Physics", "Chemistry", "Mathematics"];
const NO_PREFERENCE = "__any__"; // radix Select can't hold a "" item value
const DEFAULT_DAILY_GOAL = 20; // matches user_goals.daily_questions column default
const DEFAULT_WEEKLY_GOAL = 150; // matches user_goals.weekly_questions column default
const GOAL_LABELS = { daily_questions: "Daily", weekly_questions: "Weekly" };

export default function StudySettings() {
  const { user } = useUser();
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const { goals, loading: goalsLoading } = useUserGoals();

  const [subjectOverride, setSubjectOverride] = useState(undefined);
  const [savingSubject, setSavingSubject] = useState(false);

  const [goalOverrides, setGoalOverrides] = useState({});
  const [goalDrafts, setGoalDrafts] = useState({}); // local text while typing, per field

  const subject = subjectOverride ?? preferences?.default_subject ?? null;

  async function handleSubjectChange(v) {
    if (!user) return;
    const next = v === NO_PREFERENCE ? null : v;

    setSubjectOverride(next);
    setSavingSubject(true);
    try {
      await upsertUserPreferences(user.id, { default_subject: next });
      showToast.success(
        "Default subject updated",
        next
          ? `Practice Problems now opens to ${next} by default.`
          : "Cleared — Practice Problems opens to all subjects.",
      );
    } catch (err) {
      setSubjectOverride(undefined);
      showToast.error("Couldn't save", err.message || "Please try again.");
    } finally {
      setSavingSubject(false);
    }
  }

  function goalValue(key, fallback) {
    return goalOverrides[key] ?? goals?.[key] ?? fallback;
  }

  async function saveGoal(key, newValue) {
    if (!user) return;
    setGoalOverrides((o) => ({ ...o, [key]: newValue }));
    try {
      await upsertUserGoals(user.id, { [key]: newValue });
      showToast.success(
        "Goal updated",
        `${GOAL_LABELS[key]} goal set to ${newValue} questions.`,
      );
    } catch (err) {
      setGoalOverrides((o) => ({ ...o, [key]: undefined }));
      showToast.error("Couldn't save", err.message || "Please try again.");
    }
  }

  function handleGoalBlur(key) {
    const draft = goalDrafts[key];
    if (draft === undefined) return;
    setGoalDrafts((d) => ({ ...d, [key]: undefined }));
    const parsed = parseInt(draft, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    saveGoal(key, parsed);
  }

  if (preferencesLoading || goalsLoading) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Default subject</CardTitle>
          <CardDescription>
            Practice Problems opens filtered to this subject by default.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={subject || NO_PREFERENCE}
            onValueChange={handleSubjectChange}
            disabled={savingSubject}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PREFERENCE}>No preference</SelectItem>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question goals</CardTitle>
          <CardDescription>
            Shown as a progress bar on Practice Problems.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div>
            <Label htmlFor="daily-goal-input" className="mb-1.5 block">
              Daily
            </Label>
            <Input
              id="daily-goal-input"
              type="number"
              min={1}
              className="w-24"
              value={
                goalDrafts.daily_questions ??
                goalValue("daily_questions", DEFAULT_DAILY_GOAL)
              }
              onChange={(e) =>
                setGoalDrafts((d) => ({
                  ...d,
                  daily_questions: e.target.value,
                }))
              }
              onBlur={() => handleGoalBlur("daily_questions")}
            />
          </div>
          <div>
            <Label htmlFor="weekly-goal-input" className="mb-1.5 block">
              Weekly
            </Label>
            <Input
              id="weekly-goal-input"
              type="number"
              min={1}
              className="w-24"
              value={
                goalDrafts.weekly_questions ??
                goalValue("weekly_questions", DEFAULT_WEEKLY_GOAL)
              }
              onChange={(e) =>
                setGoalDrafts((d) => ({
                  ...d,
                  weekly_questions: e.target.value,
                }))
              }
              onBlur={() => handleGoalBlur("weekly_questions")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
