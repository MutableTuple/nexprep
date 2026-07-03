"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, GraduationCap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getProfile,
  getLatestPersonalGoal,
  createPersonalGoal,
} from "../_lib/data-service";
import { useUser } from "../_lib/AuthProvider";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Grid spans from `startDate` (when the journey began — profile join date
// for JEE, goal creation date for personal goals) to `targetDate`. Days
// already passed render filled, days still ahead render muted, so the grid
// reads as journey progress rather than just a countdown.
function CountdownGrid({ startDate, targetDate, accentClass }) {
  if (!targetDate) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No date set yet.
      </p>
    );
  }

  const today = startOfDay(new Date());
  const start = startOfDay(startDate || today);
  const target = startOfDay(targetDate);
  const totalDays = daysBetween(start, target);
  const daysPassed = Math.min(
    Math.max(daysBetween(start, today), 0),
    totalDays,
  );
  const daysLeft = Math.max(daysBetween(today, target), 0);

  if (totalDays <= 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        This date has already passed.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tabular-nums text-foreground">
          {daysLeft}
        </span>
        <span className="text-sm text-muted-foreground">
          day{daysLeft === 1 ? "" : "s"} left
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(10px,1fr))] gap-1 max-h-64 overflow-y-auto pr-1">
        {Array.from({ length: totalDays }).map((_, i) => {
          const isPast = i < daysPassed;
          return (
            <div
              key={i}
              title={`Day ${i + 1}${isPast ? " (done)" : ""}`}
              className={cn(
                "aspect-square rounded-[2px]",
                isPast ? accentClass : "bg-muted",
              )}
            />
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {formatDate(start)} → {formatDate(target)} · {daysPassed}/{totalDays}{" "}
        days in
      </p>
    </div>
  );
}

export default function TimeLeftJeeChart() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const [joinedAt, setJoinedAt] = useState(null);
  const [targetYear, setTargetYear] = useState(null);

  const [goal, setGoal] = useState(null); // latest personal_goals row
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id)
      .then((profile) => {
        setTargetYear(profile?.target_year ?? null);
        setJoinedAt(profile?.created_at ?? null);
      })
      .catch((err) => console.error("Failed to load profile:", err));

    getLatestPersonalGoal(user.id)
      .then((g) => setGoal(g))
      .catch((err) => console.error("Failed to load personal goal:", err));
  }, [user?.id]);

  async function saveGoal() {
    if (!user || !goalTitle.trim() || !goalDate) return;
    setSavingGoal(true);
    try {
      const created = await createPersonalGoal(user.id, {
        title: goalTitle.trim(),
        description: goalDescription.trim(),
        targetDate: goalDate,
      });
      setGoal(created);
      setGoalTitle("");
      setGoalDescription("");
      setGoalDate("");
    } catch (err) {
      console.error("Failed to save personal goal:", err);
    } finally {
      setSavingGoal(false);
    }
  }

  // Approximate JEE Main session 1 date for the target year — the real date
  // shifts year to year, so this is a placeholder until there's an actual
  // configured exam date somewhere in the schema.
  const jeeDate = targetYear ? new Date(`${targetYear}-01-24`) : null;
  const joinedDate = joinedAt ? new Date(joinedAt) : null;

  const jeeDaysLeft = jeeDate
    ? daysBetween(startOfDay(new Date()), jeeDate)
    : null;
  const goalDaysLeft = goal?.target_date
    ? daysBetween(
        startOfDay(new Date()),
        startOfDay(new Date(goal.target_date)),
      )
    : null;

  // prefer JEE countdown on the button; fall back to the personal goal if
  // that's the only one set; otherwise just show the plain default label
  const daysLeft =
    jeeDaysLeft > 0 ? jeeDaysLeft : goalDaysLeft > 0 ? goalDaysLeft : null;
  const triggerLabel = daysLeft
    ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
    : "Countdown";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
          <Calendar size={14} />
          <span className="hidden sm:inline">{triggerLabel}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92%] sm:w-full max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Time Left</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="jee">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="jee" className="gap-1.5 rounded-lg">
              <GraduationCap size={14} />
              JEE
            </TabsTrigger>
            <TabsTrigger value="personal" className="gap-1.5 rounded-lg">
              <Target size={14} />
              Personal Goal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jee" className="mt-4">
            {targetYear ? (
              <CountdownGrid
                startDate={joinedDate}
                targetDate={jeeDate}
                accentClass="bg-primary/60"
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Set your target exam year in your profile to see this countdown.
              </p>
            )}
          </TabsContent>

          <TabsContent value="personal" className="mt-4 flex flex-col gap-4">
            {goal && (
              <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {goal.title}
                  </h4>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {goal.description}
                    </p>
                  )}
                </div>
                <CountdownGrid
                  startDate={new Date(goal.created_at)}
                  targetDate={new Date(goal.target_date)}
                  accentClass="bg-emerald-500/60"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {goal ? "Set a new goal" : "Set a personal goal"}
              </p>
              <Input
                placeholder="Goal title — e.g. Finish Organic Chemistry"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="h-9 rounded-lg text-sm"
              />
              <Textarea
                placeholder="Description (optional)"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                rows={2}
                className="rounded-lg text-sm resize-none"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="h-9 rounded-lg text-sm"
                />
                <Button
                  size="sm"
                  onClick={saveGoal}
                  disabled={savingGoal || !goalTitle.trim() || !goalDate}
                  className="rounded-lg shrink-0"
                >
                  Set
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
