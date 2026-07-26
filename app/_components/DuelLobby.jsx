"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Swords, Loader2, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserId } from "@/app/_lib/AuthProvider";
import { supabase } from "@/app/_lib/supabase";
import { findOrQueueDuel, leaveDuelQueue } from "@/app/_lib/data-service";
import Link from "next/link";

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics"];

export default function DuelLobby() {
  const { userId } = useUserId();
  const router = useRouter();
  const [subject, setSubject] = useState("All");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!userId || !searching) return;

    const channel = supabase
      .channel(`duel-match:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "duels",
          filter: `player1_id=eq.${userId}`,
        },
        (payload) => router.push(`/duel/${payload.new.id}`),
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "duels",
          filter: `player2_id=eq.${userId}`,
        },
        (payload) => router.push(`/duel/${payload.new.id}`),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, searching, router]);

  async function handleFindMatch() {
    if (!userId) return;
    setSearching(true);
    try {
      const duelId = await findOrQueueDuel(
        userId,
        subject === "All" ? null : subject,
      );
      if (duelId) router.push(`/duel/${duelId}`);
    } catch (err) {
      console.error("Failed to find match:", err);
      setSearching(false);
    }
  }

  async function handleCancel() {
    if (!userId) return;
    await leaveDuelQueue(userId);
    setSearching(false);
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center max-w-sm gap-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-400/10 border border-amber-400/30">
            <Swords className="h-7 w-7 text-amber-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold text-foreground">
              Ready to duel?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to challenge other JEE aspirants to a live 1v1 battle and
              put your prep to the test.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2">
            <Link href="/login?next=/battle" className="w-full sm:w-auto">
              <Button className="rounded-full px-6 gap-2 w-full sm:w-auto bg-amber-400 text-black hover:bg-amber-300">
                Sign in to duel
                <ArrowRight size={15} />
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="rounded-full px-6 w-full sm:w-auto"
              >
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="max-w-sm w-full p-6 flex flex-col items-center gap-5 text-center">
        <Swords size={28} className="text-primary" />
        <div>
          <h1 className="text-xl font-bold">Quick Duel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            5 random questions, fastest correct answers win.
          </p>
        </div>

        {searching ? (
          <>
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Searching for an opponent…
            </p>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full rounded-xl gap-2"
              onClick={handleFindMatch}
            >
              <Swords size={16} />
              Find Opponent
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
