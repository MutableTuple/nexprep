"use client";

import { useEffect } from "react";
import { supabase } from "./supabase";

export function useDuelRealtime(duelId, { onDuelUpdate, onAnswer } = {}) {
  useEffect(() => {
    if (!duelId) return;

    const channel = supabase
      .channel(`duel:${duelId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "duels",
          filter: `id=eq.${duelId}`,
        },
        (payload) => onDuelUpdate?.(payload.new),
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "duel_answers",
          filter: `duel_id=eq.${duelId}`,
        },
        (payload) => onAnswer?.(payload.new),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [duelId]);
}
