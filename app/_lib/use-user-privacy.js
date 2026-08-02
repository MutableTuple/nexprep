"use client";

import { useEffect, useState } from "react";
import { getUserPrivacy } from "./data-service";
import { useUser } from "./AuthProvider";

export function useUserPrivacy() {
  const { user, loading: userLoading } = useUser();
  const [fetched, setFetched] = useState(null); // { userId, privacy } | null

  useEffect(() => {
    if (userLoading || !user?.id) return;
    if (fetched?.userId === user.id) return;

    let cancelled = false;

    getUserPrivacy(user.id).then((data) => {
      if (!cancelled) setFetched({ userId: user.id, privacy: data });
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id, userLoading, fetched?.userId]);

  if (!user?.id) {
    return { privacy: null, loading: userLoading };
  }

  const loading = userLoading || fetched?.userId !== user.id;
  return { privacy: loading ? null : fetched.privacy, loading };
}
