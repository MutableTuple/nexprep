"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { isFollowing, followUser, unfollowUser } from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";

export default function FollowButton({ userId, targetUserId, className }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!userId || !targetUserId || userId === targetUserId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    isFollowing(userId, targetUserId)
      .then((result) => {
        if (!cancelled) setFollowing(result);
      })
      .catch((err) => console.error("Failed to check follow status:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, targetUserId]);

  if (!userId || userId === targetUserId) return null;

  async function toggle() {
    setBusy(true);
    try {
      if (following) {
        await unfollowUser(userId, targetUserId);
        setFollowing(false);
      } else {
        await followUser(userId, targetUserId);
        setFollowing(true);
        showToast.success("Following", "");
      }
    } catch (err) {
      showToast.error("Couldn't update follow status", err.message || "");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant={following ? "outline" : "default"}
      size="sm"
      onClick={toggle}
      disabled={loading || busy}
      className={className ?? "gap-1.5 rounded-xl"}
    >
      {following ? <UserCheck size={14} /> : <UserPlus size={14} />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}