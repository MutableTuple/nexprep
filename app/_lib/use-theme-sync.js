"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useUser } from "./AuthProvider";
import { getUserPreferences, upsertUserPreferences } from "./data-service";

// Syncs the next-themes choice with `user_preferences.theme` in Supabase so
// a signed-in user's theme follows them across devices — next-themes itself
// only ever persists to localStorage.
export function useThemeSync() {
  const { user, loading } = useUser();
  const { theme, setTheme } = useTheme();

  const pulledForUserRef = useRef(null); // which user id we've already pulled remote theme for
  const lastPushedRef = useRef(null); // last theme value we wrote back, to avoid redundant upserts

  useEffect(() => {
    if (loading) return;

    if (!user?.id) {
      pulledForUserRef.current = null;
      return;
    }

    if (pulledForUserRef.current === user.id) return;
    pulledForUserRef.current = user.id;

    getUserPreferences(user.id).then((prefs) => {
      if (!prefs?.theme) return;
      lastPushedRef.current = prefs.theme; // it's already saved — don't re-push it below
      if (prefs.theme !== theme) setTheme(prefs.theme);
    });
  }, [loading, user?.id, theme, setTheme]);

  useEffect(() => {
    if (loading || !user?.id || !theme) return;
    if (lastPushedRef.current === theme) return;
    lastPushedRef.current = theme;

    upsertUserPreferences(user.id, { theme }).catch((err) => {
      console.error("Failed to sync theme preference:", err);
    });
  }, [loading, user?.id, theme]);
}
