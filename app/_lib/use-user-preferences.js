"use client";

import { useEffect, useState } from "react";
import { getUserPreferences } from "./data-service";
import { useUser } from "./AuthProvider";

export function useUserPreferences() {
  const { user, loading: userLoading } = useUser();
  // Keyed by user id so a user switch (logout/login as someone else)
  // naturally invalidates the previous fetch without a separate reset effect.
  const [fetched, setFetched] = useState(null); // { userId, preferences } | null

  useEffect(() => {
    if (userLoading || !user?.id) return;
    if (fetched?.userId === user.id) return;

    let cancelled = false;

    getUserPreferences(user.id).then((data) => {
      if (!cancelled) setFetched({ userId: user.id, preferences: data });
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id, userLoading, fetched?.userId]);

  if (!user?.id) {
    return { preferences: null, loading: userLoading };
  }

  const loading = userLoading || fetched?.userId !== user.id;
  return { preferences: loading ? null : fetched.preferences, loading };
}
