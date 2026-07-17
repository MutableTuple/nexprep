"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Clock, Check, X, UserMinus } from "lucide-react";
import {
  getFriendshipStatus,
  sendFriendRequest,
  respondToFriendRequest,
  deleteFriendship,
} from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";

export default function AddFriendButton({ userId, targetUserId, className }) {
  const [friendship, setFriendship] = useState(null); // null | row
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!userId || !targetUserId || userId === targetUserId) {
      setLoading(false);
      return;
    }
    try {
      setFriendship(await getFriendshipStatus(userId, targetUserId));
    } catch (err) {
      console.error("Failed to load friendship status:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, targetUserId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!userId || userId === targetUserId) return null;
  if (loading) {
    return (
      <Button size="sm" disabled className={className ?? "gap-1.5 rounded-xl"}>
        …
      </Button>
    );
  }

  async function handleAdd() {
    setBusy(true);
    try {
      await sendFriendRequest(userId, targetUserId);
      showToast.success("Friend request sent", "");
      load();
    } catch (err) {
      showToast.error("Couldn't send request", err.message || "");
    } finally {
      setBusy(false);
    }
  }

  async function handleRespond(status) {
    setBusy(true);
    try {
      await respondToFriendRequest(friendship.id, status);
      showToast.success(
        status === "accepted" ? "Friend added" : "Declined",
        "",
      );
      load();
    } catch (err) {
      showToast.error("Couldn't respond", err.message || "");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    setBusy(true);
    try {
      await deleteFriendship(friendship.id);
      showToast.success("Friend removed", "");
      setFriendship(null);
    } catch (err) {
      showToast.error("Couldn't remove friend", err.message || "");
    } finally {
      setBusy(false);
    }
  }

  if (!friendship || friendship.status === "rejected") {
    return (
      <Button
        size="sm"
        onClick={handleAdd}
        disabled={busy}
        className={className ?? "gap-1.5 rounded-xl"}
      >
        <UserPlus size={14} />
        Add Friend
      </Button>
    );
  }

  if (friendship.status === "accepted") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemove}
        disabled={busy}
        className={className ?? "gap-1.5 rounded-xl"}
      >
        <UserMinus size={14} />
        Friends
      </Button>
    );
  }

  // status === "pending"
  if (friendship.sender_id === userId) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={className ?? "gap-1.5 rounded-xl"}
      >
        <Clock size={14} />
        Request Sent
      </Button>
    );
  }

  // they sent it to me — respond right here
  return (
    <div className="flex gap-1.5">
      <Button
        size="sm"
        onClick={() => handleRespond("accepted")}
        disabled={busy}
        className="gap-1 rounded-xl"
      >
        <Check size={14} />
        Accept
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleRespond("rejected")}
        disabled={busy}
        className="gap-1 rounded-xl"
      >
        <X size={14} />
      </Button>
    </div>
  );
}