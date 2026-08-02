"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "@/app/_lib/AuthProvider";
import { useUserPreferences } from "@/app/_lib/use-user-preferences";
import { upsertUserPreferences } from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";

export default function NotificationSettings() {
  const { user } = useUser();
  const { preferences, loading: preferencesLoading } = useUserPreferences();

  // null = "no optimistic override, trust preferences.<key>" — avoids
  // mirroring the fetched value into state just to reflect it in the UI
  // while a save is in flight.
  const [overrides, setOverrides] = useState({});
  const [savingField, setSavingField] = useState(null);

  const value = (key) => overrides[key] ?? preferences?.[key] ?? true;

  async function handleToggle(key, nextEnabled, messages) {
    if (!user) return;

    setOverrides((o) => ({ ...o, [key]: nextEnabled }));
    setSavingField(key);
    try {
      await upsertUserPreferences(user.id, { [key]: nextEnabled });
      showToast.success(...(nextEnabled ? messages.on : messages.off));
    } catch (err) {
      setOverrides((o) => ({ ...o, [key]: undefined })); // revert to what's actually saved
      showToast.error("Couldn't save", err.message || "Please try again.");
    } finally {
      setSavingField(null);
    }
  }

  if (preferencesLoading) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily digest</CardTitle>
          <CardDescription>
            One email a day with today&apos;s question, your streak, pending
            duels, and friend activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="email-notifications-toggle" className="flex-1">
              Send me the daily digest email
            </Label>
            <Switch
              id="email-notifications-toggle"
              checked={value("email_notifications")}
              disabled={savingField === "email_notifications"}
              onCheckedChange={(next) =>
                handleToggle("email_notifications", next, {
                  on: [
                    "Daily emails turned on",
                    "You'll get the daily question, streak, duel, and friend updates.",
                  ],
                  off: [
                    "Daily emails turned off",
                    "You won't get the daily digest anymore.",
                  ],
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
