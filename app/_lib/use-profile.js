"use client";

import { useEffect, useState } from "react";
import { getProfile } from "./data-service";
import { useUser } from "./AuthProvider";

export function useProfile() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getProfile(user.id).then((data) => {
      if (!cancelled) {
        setProfile(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id, userLoading]);

  return { profile, loading };
}
