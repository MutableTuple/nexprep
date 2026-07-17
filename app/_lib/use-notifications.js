"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import {
  listNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
} from "./data-service";

let sharedChannel = null;
let sharedUserId = null;
const refetchListeners = new Set();
const rowListeners = new Set();

function ensureChannel(userId) {
  if (sharedChannel && sharedUserId === userId) return;

  if (sharedChannel) {
    supabase.removeChannel(sharedChannel);
    sharedChannel = null;
  }

  sharedUserId = userId;
  sharedChannel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        refetchListeners.forEach((fn) => fn());
        rowListeners.forEach((fn) => fn(payload.new));
      },
    )
    .subscribe();
}

function teardownIfIdle() {
  if (refetchListeners.size === 0 && rowListeners.size === 0 && sharedChannel) {
    supabase.removeChannel(sharedChannel);
    sharedChannel = null;
    sharedUserId = null;
  }
}

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      const [rows, count] = await Promise.all([
        listNotifications(userId),
        getUnreadNotificationCount(userId),
      ]);
      setNotifications(rows);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!userId) return;
    ensureChannel(userId);
    refetchListeners.add(load);
    return () => {
      refetchListeners.delete(load);
      teardownIfIdle();
    };
  }, [userId, load]);

  async function markAllRead() {
    if (!userId || unreadCount === 0) return;
    await markAllNotificationsRead(userId);
    setUnreadCount(0);
  }

  return { notifications, unreadCount, markAllRead };
}

// Fires `onNewNotification(row)` for every fresh row this user receives —
// reuses the same shared channel above instead of opening a second
// realtime connection per consumer.
export function useNotificationEvents(userId, onNewNotification) {
  useEffect(() => {
    if (!userId || !onNewNotification) return;
    ensureChannel(userId);
    rowListeners.add(onNewNotification);
    return () => {
      rowListeners.delete(onNewNotification);
      teardownIfIdle();
    };
  }, [userId, onNewNotification]);
}
