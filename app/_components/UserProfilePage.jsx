"use client";

import { useRef, useState, useEffect, memo } from "react";
import {
  Flame,
  Zap,
  Trophy,
  Target,
  Crosshair,
  Hash,
  Atom,
  Star,
  Moon,
  Gauge,
  Camera,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { showToast } from "@/app/_lib/toast";
import {
  getProfile,
  updateProfile,
  isUsernameAvailable,
  getUserStats,
  getMyRank,
} from "@/app/_lib/data-service";
import StatCard from "./Problems/StatCard";
import ProfileTabs from "./ProfileTabs";
import ProfileInfo from "./Profile/ProfileInfo";
import { useUser } from "@/app/_lib/AuthProvider";

const USER = {
  name: "Arjun Sharma",
  username: "@arjunsharma",
  avatar: "",
  location: "Delhi, India",
  joinedYear: "2024",
  bio: "JEE 2026 aspirant. Physics enthusiast. Aiming for IIT Bombay CSE.",
  target: "IIT Bombay — CSE",
  examYear: "",
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

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function mapDbProfileToView(dbProfile, authUser) {
  return {
    name:
      dbProfile?.display_name || authUser?.email?.split("@")[0] || "Anonymous",
    username: dbProfile?.username ? `@${dbProfile.username}` : "@user",
    avatar: dbProfile?.avatar_url || "",
    bio: dbProfile?.bio || "",
    target: dbProfile?.exam || "",
    examYear: dbProfile?.target_year ?? "",
    location: dbProfile?.country || "",
  };
}

// Stats grid + tabs never depend on edit-mode state, so this subtree is
// memoized to skip re-rendering (and skip re-rendering the heatmap inside
// ProfileTabs) on every keystroke while editing the profile above it.
const Body = memo(function Body({ stats }) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <ProfileTabs BADGES={BADGES} />
    </div>
  );
});

export default function UserProfilePage({ onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(USER);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | "checking" | "available" | "taken"
  const fileInputRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState(USER);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(USER);
      setProfileLoading(false);
      setStats(null); // ← add this
      setStatsLoading(false); // ← add this
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);
      try {
        const dbProfile = await getProfile(user.id);
        if (!cancelled) setProfile(mapDbProfileToView(dbProfile, user));
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (!cancelled) {
          showToast.error(
            "Couldn't load profile",
            "Showing basic info instead.",
          );
          setProfile(mapDbProfileToView(null, user));
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    // ← add this whole function
    async function loadStats() {
      setStatsLoading(true);
      try {
        const [userStats, rank] = await Promise.all([
          getUserStats(user.id),
          getMyRank(user.id),
        ]);
        if (!cancelled) setStats({ ...userStats, rank });
      } catch (err) {
        console.error("Failed to load stats:", err);
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    loadProfile();
    loadStats(); // ← add this line
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  // debounced username availability check while editing
  useEffect(() => {
    if (!editMode) return;

    const cleaned = draft.username.replace(/^@/, "").trim();
    const original = profile.username.replace(/^@/, "").trim();

    if (!cleaned || cleaned === original) {
      setUsernameStatus(null);
      return;
    }

    let cancelled = false;
    setUsernameStatus("checking");

    const timeout = setTimeout(async () => {
      try {
        const available = await isUsernameAvailable(cleaned, user?.id);
        if (!cancelled) setUsernameStatus(available ? "available" : "taken");
      } catch (err) {
        console.error("Username check failed:", err);
        if (!cancelled) setUsernameStatus(null);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [draft.username, editMode, profile.username, user?.id]);

  function updateDraft(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function enterEdit() {
    setDraft(profile);
    setUsernameStatus(null);
    setEditMode(true);
  }

  function cancelEdit() {
    setUsernameStatus(null);
    setEditMode(false);
  }

  async function saveEdit() {
    if (!user) return;

    if (usernameStatus === "taken") {
      showToast.error("Username taken", "Please choose a different username.");
      return;
    }
    if (usernameStatus === "checking") {
      showToast.error("Hang on", "Still checking username availability.");
      return;
    }

    const updates = {
      display_name: draft.name.trim(),
      username: draft.username.replace(/^@/, "").trim() || null,
      bio: draft.bio.trim(),
      exam: draft.target.trim(),
      target_year: draft.examYear ? parseInt(draft.examYear, 10) : null,
      country: draft.location.trim(),
      avatar_url: draft.avatar || null,
    };

    setSaving(true);
    try {
      const updatedDbProfile = await updateProfile(user.id, updates);
      setProfile(mapDbProfileToView(updatedDbProfile, user));
      setEditMode(false);
      setUsernameStatus(null);
      showToast.success("Profile updated", "Your changes have been saved.");
      onSave?.(updatedDbProfile);
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast.error(
        "Couldn't save changes",
        err.message || "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateDraft("avatar", reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const shown = editMode ? draft : profile;
  const displayStats = [
    {
      label: "Current Streak",
      value: statsLoading ? "…" : user ? `${stats?.streak ?? 0}` : "—",
      unit: "days",
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Total XP",
      value: statsLoading
        ? "…"
        : user
          ? (stats?.xp ?? 0).toLocaleString()
          : "—",
      unit: "xp",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      label: "Problems Solved",
      value: statsLoading
        ? "…"
        : user
          ? (stats?.solved_questions ?? 0).toLocaleString()
          : "—",
      unit: "",
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Global Rank",
      value: statsLoading ? "…" : user && stats?.rank ? `#${stats.rank}` : "—",
      unit: "",
      icon: Trophy,
      color: "text-amber-500",
    },
  ];
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="relative shrink-0">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-border">
                <AvatarImage src={shown.avatar || undefined} alt={shown.name} />
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {getInitials(shown.name || "?")}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => editMode && fileInputRef.current?.click()}
                className={cn(
                  "absolute bottom-0 right-0 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shadow-sm transition-colors",
                  editMode
                    ? "hover:bg-muted cursor-pointer"
                    : "opacity-50 cursor-not-allowed",
                )}
              >
                <Camera size={13} className="text-muted-foreground" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarPick}
              />
            </div>

            <ProfileInfo
              editMode={editMode}
              draft={draft}
              profile={profile}
              enterEdit={enterEdit}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              updateDraft={updateDraft}
              saving={saving}
              usernameStatus={usernameStatus}
            />
          </div>
        </div>
      </div>

      <Body stats={displayStats} />
    </div>
  );
}
