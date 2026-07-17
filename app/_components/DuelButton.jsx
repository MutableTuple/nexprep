"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { createDuelInvite } from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";

export default function DuelButton({ userId, targetUserId, className }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!userId || userId === targetUserId) return null;

  async function handleChallenge() {
    setBusy(true);
    try {
      const duel = await createDuelInvite(userId, targetUserId);
      router.push(`/duel/${duel.id}`);
    } catch (err) {
      showToast.error("Couldn't start duel", err.message || "");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleChallenge}
      disabled={busy}
      className={className ?? "gap-1.5 rounded-xl"}
    >
      <Swords size={14} />
      Duel
    </Button>
  );
}
