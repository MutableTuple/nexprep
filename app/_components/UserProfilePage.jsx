"use client";

import { useState } from "react";
import {
  Flame,
  Zap,
  Trophy,
  Target,
  BookOpen,
  Calendar,
  Edit3,
  Camera,
  CheckCircle2,
  TrendingUp,
  Lock,
  MapPin,
  Crosshair,
  Hash,
  Atom,
  Star,
  Moon,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "../_lib/toast";

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const USER = {
  name: "Arjun Sharma",
  username: "@arjunsharma",
  avatar: "",
  initials: "AS",
  location: "Delhi, India",
  joinedYear: "2024",
  bio: "JEE 2026 aspirant. Physics enthusiast. Aiming for IIT Bombay CSE.",
  target: "IIT Bombay — CSE",
  examYear: "JEE Advanced 2026",
};

const STATS = [
  {
    label: "Current Streak",
    value: "18",
    unit: "days",
    icon: Flame,
    color: "text-orange-500",
  },
  {
    label: "Total XP",
    value: "18,420",
    unit: "xp",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    label: "Problems Solved",
    value: "1,248",
    unit: "",
    icon: Target,
    color: "text-primary",
  },
  {
    label: "Global Rank",
    value: "#342",
    unit: "",
    icon: Trophy,
    color: "text-amber-500",
  },
];

const SUBJECT_PROGRESS = [
  { subject: "Physics", solved: 480, total: 600, color: "bg-blue-500" },
  { subject: "Chemistry", solved: 390, total: 550, color: "bg-green-500" },
  { subject: "Mathematics", solved: 378, total: 500, color: "bg-purple-500" },
];

const HEATMAP_DATA = Array.from({ length: 52 * 7 }, () => ({
  count: Math.random() > 0.6 ? Math.floor(Math.random() * 8) : 0,
}));

const HEAT_COLORS = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
  "bg-primary",
];

const BADGES = [
  {
    id: 1,
    name: "First Blood",
    desc: "Solved your first problem",
    icon: Crosshair,
    color: "text-red-500",
    bg: "bg-red-100 dark:bg-red-950/40",
    earned: true,
  },
  {
    id: 2,
    name: "On Fire",
    desc: "7-day streak",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-950/40",
    earned: true,
  },
  {
    id: 3,
    name: "Century",
    desc: "Solved 100 problems",
    icon: Hash,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-950/40",
    earned: true,
  },
  {
    id: 4,
    name: "Physics Nerd",
    desc: "Solved 200 physics problems",
    icon: Atom,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-950/40",
    earned: true,
  },
  {
    id: 5,
    name: "Speed Demon",
    desc: "Solved 10 problems in one day",
    icon: Gauge,
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-950/40",
    earned: false,
  },
  {
    id: 6,
    name: "Perfectionist",
    desc: "10 correct in a row",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-950/40",
    earned: false,
  },
  {
    id: 7,
    name: "Night Owl",
    desc: "Solved after midnight",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-100 dark:bg-indigo-950/40",
    earned: false,
  },
  {
    id: 8,
    name: "Champion",
    desc: "Rank #1 in a mock test",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-950/40",
    earned: false,
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    title: "Roots of Quadratic Equation",
    subject: "Mathematics",
    xp: 100,
    time: "2h ago",
    correct: true,
  },
  {
    id: 2,
    title: "Standard Limits",
    subject: "Mathematics",
    xp: 100,
    time: "2h ago",
    correct: false,
  },
  {
    id: 3,
    title: "Basic Derivatives",
    subject: "Mathematics",
    xp: 100,
    time: "3h ago",
    correct: true,
  },
  {
    id: 4,
    title: "Basic Probability",
    subject: "Mathematics",
    xp: 100,
    time: "5h ago",
    correct: true,
  },
  {
    id: 5,
    title: "Determinants",
    subject: "Mathematics",
    xp: 100,
    time: "1d ago",
    correct: true,
  },
];

// ─── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, icon: Icon, color }) {
  return (
    <Card className="bg-card border-border shadow-none rounded-2xl p-5">
      <CardContent className="p-0">
        <Icon size={20} className={color} />
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && (
            <span className="text-xs text-muted-foreground">{unit}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

// ─── SubjectProgress ───────────────────────────────────────────────────────────

function SubjectProgress() {
  return (
    <Card className="bg-card border-border shadow-none rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Subject Progress
          </h3>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-6 py-5 flex flex-col gap-5">
        {SUBJECT_PROGRESS.map((s) => {
          const pct = Math.round((s.solved / s.total) * 100);
          return (
            <div key={s.subject}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {s.subject}
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.solved} / {s.total}
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", s.color)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {pct}% complete
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── ActivityHeatmap ───────────────────────────────────────────────────────────

function ActivityHeatmap() {
  const weeks = [];
  for (let w = 0; w < 26; w++) {
    weeks.push(HEATMAP_DATA.slice(w * 7, w * 7 + 7));
  }

  return (
    <Card className="bg-card border-border shadow-none rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Activity</h3>
          </div>
          <span className="text-xs text-muted-foreground">Last 6 months</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-6 py-5 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                const level = Math.min(
                  Math.floor((day.count / 8) * (HEAT_COLORS.length - 1)),
                  HEAT_COLORS.length - 1,
                );
                return (
                  <div
                    key={di}
                    title={`${day.count} problems`}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-colors",
                      HEAT_COLORS[day.count === 0 ? 0 : Math.max(1, level)],
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[11px] text-muted-foreground">Less</span>
          {HEAT_COLORS.map((c, i) => (
            <div key={i} className={cn("w-3 h-3 rounded-sm", c)} />
          ))}
          <span className="text-[11px] text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── BadgesGrid ────────────────────────────────────────────────────────────────

function BadgesGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {BADGES.map((badge) => {
        const Icon = badge.icon;
        return (
          <Card
            key={badge.id}
            className={cn(
              "bg-card border-border shadow-none rounded-2xl p-4 flex flex-col items-center text-center gap-3 transition-all",
              !badge.earned && "opacity-40 grayscale",
            )}
          >
            <CardContent className="p-0 flex flex-col items-center gap-2 w-full">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  badge.bg,
                )}
              >
                <Icon size={22} className={badge.color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1 justify-center">
                  {badge.name}
                  {!badge.earned && (
                    <Lock size={11} className="text-muted-foreground" />
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {badge.desc}
                </p>
              </div>
              {badge.earned && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 rounded-full"
                >
                  Earned
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── RecentActivity ────────────────────────────────────────────────────────────

function RecentActivity() {
  return (
    <Card className="bg-card border-border shadow-none rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h3>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {RECENT_ACTIVITY.map((item, i) => (
          <div key={item.id}>
            <div className="flex items-center gap-4 px-6 py-4">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  item.correct
                    ? "bg-green-100 dark:bg-green-950/40"
                    : "bg-red-100 dark:bg-red-950/40",
                )}
              >
                <CheckCircle2
                  size={15}
                  className={item.correct ? "text-green-600" : "text-red-500"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.subject}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-foreground">
                  +{item.xp} XP
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {item.time}
                </p>
              </div>
            </div>
            {i < RECENT_ACTIVITY.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── UserProfilePage ───────────────────────────────────────────────────────────

export default function UserProfilePage() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-border">
                <AvatarImage src={USER.avatar} alt={USER.name} />
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {USER.initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
                <Camera size={13} className="text-muted-foreground" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {USER.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {USER.username}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    {USER.bio}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-xs gap-1"
                    >
                      <Trophy size={11} /> {USER.target}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs gap-1"
                    >
                      <Calendar size={11} /> {USER.examYear}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs gap-1"
                    >
                      <MapPin size={11} /> {USER.location}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast.correct(100)}
                    className="gap-1.5 rounded-xl"
                  >
                    <Zap size={14} />
                    Test Toast
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode((e) => !e)}
                    className="gap-1.5 rounded-xl"
                  >
                    <Edit3 size={14} />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="rounded-xl h-10">
            <TabsTrigger value="overview" className="rounded-lg text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg text-sm">
              Activity
            </TabsTrigger>
            <TabsTrigger value="badges" className="rounded-lg text-sm">
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
            <SubjectProgress />
            <ActivityHeatmap />
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <RecentActivity />
          </TabsContent>

          <TabsContent value="badges" className="mt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {BADGES.filter((b) => b.earned).length} of {BADGES.length}{" "}
                badges earned
              </p>
              <Progress
                value={
                  (BADGES.filter((b) => b.earned).length / BADGES.length) * 100
                }
                className="w-32 h-2"
              />
            </div>
            <BadgesGrid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
