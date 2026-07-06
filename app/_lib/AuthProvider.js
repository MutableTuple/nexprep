"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext(undefined);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    // Only fetch the session ourselves if the server didn't already hand us
    // one via initialUser — this is what eliminates the reload flash. Doing
    // getSession() unconditionally here is what caused it: every reload
    // started from user: null regardless of what the server already knew.
    if (!initialUser) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useUser must be used within an <AuthProvider>");
  }
  return ctx;
}

// Returns loading alongside the id on purpose, not just a bare string —
// null can mean "still checking" or "definitely logged out", and those
// need different handling (see the Navbar loading-skeleton fix). Collapsing
// that distinction here would just push the same bug into every call site.
export function useUserId() {
  const { user, loading } = useUser();
  return { userId: user?.id ?? null, loading };
}
