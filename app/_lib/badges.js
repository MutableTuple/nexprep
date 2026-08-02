// app/_lib/badges.js
//
// Client-side badge catalog — slugs here MUST match the badge_slug values
// the award_stat_badges()/award_duel_badges() Postgres triggers insert.
// This file is purely display metadata (name/desc/icon/tier/colors); the
// actual unlock decision always happens server-side in the trigger, never
// here.
//
// `colors` is a unique two-stop gradient per badge so every badge has its
// own identity, not just its tier's identity — `tier` still controls glow
// intensity and whether the shine animation plays (see BadgeIcon.jsx).
import { Crosshair, BookOpen, Hash, Layers, Flame, Zap, Target, Swords } from "lucide-react";

export const BADGE_CATALOG = [
  {
    slug: "first_solve",
    name: "First Blood",
    desc: "Solved your first question",
    icon: Crosshair,
    tier: "bronze",
    colors: ["#dc2626", "#f87171"],
  },
  {
    slug: "solved_10",
    name: "Getting Started",
    desc: "Solved 10 questions",
    icon: BookOpen,
    tier: "bronze",
    colors: ["#0d9488", "#5eead4"],
  },
  {
    slug: "solved_100",
    name: "Century",
    desc: "Solved 100 questions",
    icon: Hash,
    tier: "silver",
    colors: ["#0284c7", "#7dd3fc"],
  },
  {
    slug: "solved_500",
    name: "Grinder",
    desc: "Solved 500 questions",
    icon: Layers,
    tier: "gold",
    colors: ["#4f46e5", "#a5b4fc"],
  },
  {
    slug: "streak_3",
    name: "Warming Up",
    desc: "3-day streak",
    icon: Flame,
    tier: "bronze",
    colors: ["#d97706", "#fcd34d"],
  },
  {
    slug: "streak_7",
    name: "On Fire",
    desc: "7-day streak",
    icon: Flame,
    tier: "silver",
    colors: ["#ea580c", "#fdba74"],
  },
  {
    slug: "streak_30",
    name: "Unstoppable",
    desc: "30-day streak",
    icon: Flame,
    tier: "gold",
    colors: ["#e11d48", "#fda4af"],
  },
  {
    slug: "streak_100",
    name: "Iron Will",
    desc: "100-day streak",
    icon: Flame,
    tier: "diamond",
    colors: ["#06b6d4", "#a5f3fc"],
  },
  {
    slug: "xp_1000",
    name: "Rising Star",
    desc: "1,000 XP earned",
    icon: Zap,
    tier: "bronze",
    colors: ["#ca8a04", "#fde047"],
  },
  {
    slug: "xp_10000",
    name: "Powerhouse",
    desc: "10,000 XP earned",
    icon: Zap,
    tier: "silver",
    colors: ["#b45309", "#fbbf24"],
  },
  {
    slug: "xp_50000",
    name: "XP Legend",
    desc: "50,000 XP earned",
    icon: Zap,
    tier: "diamond",
    colors: ["#c026d3", "#f0abfc"],
  },
  {
    slug: "accuracy_ace",
    name: "Sharp Shooter",
    desc: "90%+ accuracy over 50+ solves",
    icon: Target,
    tier: "gold",
    colors: ["#059669", "#6ee7b7"],
  },
  {
    slug: "duel_first_win",
    name: "Duelist",
    desc: "Won your first duel",
    icon: Swords,
    tier: "bronze",
    colors: ["#7c3aed", "#c4b5fd"],
  },
  {
    slug: "duel_10_wins",
    name: "Gladiator",
    desc: "Won 10 duels",
    icon: Swords,
    tier: "gold",
    colors: ["#9f1239", "#fb7185"],
  },
];
