"use client";

import { useEffect, useState } from "react";
import { getUserGoals } from "./data-service";
import { useUser } from "./AuthProvider";

export function useUserGoals() {
  const { user, loading: userLoading } = useUser();
  const [fetched, setFetched] = useState(null); // { userId, goals } | null

  useEffect(() => {
    if (userLoading || !user?.id) return;
    if (fetched?.userId === user.id) return;

    let cancelled = false;

    getUserGoals(user.id).then((data) => {
      if (!cancelled) setFetched({ userId: user.id, goals: data });
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id, userLoading, fetched?.userId]);

  if (!user?.id) {
    return { goals: null, loading: userLoading };
  }

  const loading = userLoading || fetched?.userId !== user.id;
  return { goals: loading ? null : fetched.goals, loading };
}
