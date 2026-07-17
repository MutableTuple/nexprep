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
  getProfileByUsername,
  updateProfile,
  isUsernameAvailable,
  getUserStats,
  getMyRank,
  getFollowCounts,
} from "@/app/_lib/data-service";
import StatCard from "./Problems/StatCard";
import ProfileTabs from "./ProfileTabs";
import ProfileInfo from "./Profile/ProfileInfo";
import { useUser } from "@/app/_lib/AuthProvider";
import FollowButton from "./FollowButton";
import AddFriendButton from "./AddFriendButton";
import DuelButton from "./DuelButton";

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

const EMPTY_PROFILE = {
  name: "Anonymous",
  username: "@user",
  avatar: "",
  bio: "",
  target: "",
  examYear: "",
  location: "",
  college: "",
};

function getInitials(name) {
  return (name || "?")
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
    college: dbProfile?.college || "",
    id: dbProfile?.id || null,
  };
}

const Body = memo(function Body({ stats, profileUserId, viewerId, isOwn }) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <ProfileTabs
        BADGES={BADGES}
        profileUserId={profileUserId}
        viewerId={viewerId}
        isOwn={isOwn}
      />
    </div>
  );
});

// username prop → viewing someone else's profile (usually)
// no username prop → viewing own profile
// either way, "isOwn" is decided by comparing the loaded profile's id to the logged-in user's id
export default function UserProfilePage({ username: targetUsername, onSave }) {
  const { user, loading: authLoading } = useUser();

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [followCounts, setFollowCounts] = useState({
    followers: 0,
    following: 0,
  });

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const fileInputRef = useRef(null);

  // ownership is based on the loaded profile's id, not on whether a username was in the URL
  const isOwn = !!user && !!profile.id && profile.id === user.id;

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    setProfileLoading(true);
    setStatsLoading(true);

    async function load() {
      try {
        let dbProfile;

        if (targetUsername) {
          // fetch by username from the URL
          dbProfile = await getProfileByUsername(targetUsername);
          if (!dbProfile) {
            // username doesn't exist
            setProfile({ ...EMPTY_PROFILE, name: "User not found" });
            setProfileLoading(false);
            setStatsLoading(false);
            return;
          }
        } else {
          if (!user) {
            setProfile(EMPTY_PROFILE);
            setStats(null);
            setProfileLoading(false);
            setStatsLoading(false);
            return;
          }
          dbProfile = await getProfile(user.id);
        }

        if (!cancelled) setProfile(mapDbProfileToView(dbProfile, user));

        // load stats + follow counts for whoever owns this profile
        const profileUserId = dbProfile?.id;
        if (profileUserId) {
          try {
            const [userStats, rank] = await Promise.all([
              getUserStats(profileUserId),
              getMyRank(profileUserId),
            ]);
            if (!cancelled) setStats({ ...userStats, rank });
          } catch {
            if (!cancelled) setStats(null);
          }

          try {
            const counts = await getFollowCounts(profileUserId);
            if (!cancelled) setFollowCounts(counts);
          } catch (err) {
            console.error("Failed to load follow counts:", err);
            if (!cancelled) setFollowCounts({ followers: 0, following: 0 });
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (!cancelled) {
          showToast.error("Couldn't load profile", "");
          setProfile(EMPTY_PROFILE);
          setStats(null);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
          setStatsLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [targetUsername, user?.id, authLoading]);

  // debounced username check (own profile edit only)
  useEffect(() => {
    if (!editMode || !isOwn) return;
    const cleaned = draft.username.replace(/^@/, "").trim();
    const original = profile.username.replace(/^@/, "").trim();
    if (!cleaned || cleaned === original) {
      setUsernameStatus(null);
      return;
    }

    let cancelled = false;
    setUsernameStatus("checking");
    const t = setTimeout(async () => {
      try {
        const available = await isUsernameAvailable(cleaned, user?.id);
        if (!cancelled) setUsernameStatus(available ? "available" : "taken");
      } catch {
        if (!cancelled) setUsernameStatus(null);
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [draft.username, editMode, profile.username, user?.id, isOwn]);

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
      showToast.error("Username taken", "");
      return;
    }
    if (usernameStatus === "checking") {
      showToast.error("Hang on", "Still checking.");
      return;
    }

    const updates = {
      display_name: draft.name.trim(),
      username: draft.username.replace(/^@/, "").trim() || null,
      bio: draft.bio.trim(),
      exam: draft.target.trim(),
      target_year: draft.examYear ? parseInt(draft.examYear, 10) : null,
      country: draft.location.trim(),
      college: draft.college.trim() || null,
      avatar_url: draft.avatar || null,
    };

    setSaving(true);
    try {
      const updated = await updateProfile(user.id, updates);
      setProfile(mapDbProfileToView(updated, user));
      setEditMode(false);
      setUsernameStatus(null);
      showToast.success("Profile updated", "Your changes have been saved.");
      onSave?.(updated);
    } catch (err) {
      showToast.error("Couldn't save", err.message || "Please try again.");
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
      value: statsLoading ? "…" : `${stats?.streak ?? 0}`,
      unit: "days",
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Total XP",
      value: statsLoading ? "…" : (stats?.xp ?? 0).toLocaleString(),
      unit: "xp",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      label: "Problems Solved",
      value: statsLoading
        ? "…"
        : (stats?.solved_questions ?? 0).toLocaleString(),
      unit: "",
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Global Rank",
      value: statsLoading ? "…" : stats?.rank ? `#${stats.rank}` : "—",
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
              {isOwn && (
                <>
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
                </>
              )}
            </div>

            <ProfileInfo
              editMode={isOwn && editMode}
              canEdit={isOwn}
              draft={draft}
              profile={profile}
              followCounts={followCounts}
              enterEdit={isOwn ? enterEdit : undefined}
              saveEdit={isOwn ? saveEdit : undefined}
              cancelEdit={isOwn ? cancelEdit : undefined}
              updateDraft={updateDraft}
              saving={saving}
              usernameStatus={usernameStatus}
            />

            {!isOwn && user && (
              <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                <FollowButton userId={user.id} targetUserId={profile.id} />
                <AddFriendButton userId={user.id} targetUserId={profile.id} />
                <DuelButton userId={user.id} targetUserId={profile.id} />
              </div>
            )}
          </div>
        </div>
      </div>

      <Body
        stats={displayStats}
        profileUserId={profile.id}
        viewerId={user?.id ?? null}
        isOwn={isOwn}
      />
    </div>
  );
}
