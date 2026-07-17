"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Swords } from "lucide-react";
import { useUserId } from "../_lib/AuthProvider";
import { useNotificationEvents } from "../_lib/use-notifications";

export default function DuelChallengeListener() {
  const { userId } = useUserId();
  const router = useRouter();

  const handleNew = useCallback(
    (row) => {
      if (row.type === "duel_matched") {
        // they were sitting in the matchmaking queue — jump them straight in
        toast.success("Opponent found!", {
          description: "Your duel is starting.",
          duration: 3000,
        });
        router.push(`/duel/${row.reference_id}`);
      } else if (row.type === "duel_challenge") {
        // a direct challenge needs explicit consent — dismissible action toast
        toast(row.message ?? "You've been challenged to a duel!", {
          icon: <Swords size={16} />,
          duration: 15000,
          action: {
            label: "View",
            onClick: () => router.push(`/duel/${row.reference_id}`),
          },
        });
      }
    },
    [router],
  );

  useNotificationEvents(userId, handleNew);
  return null;
}