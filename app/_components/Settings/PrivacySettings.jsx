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
import { useUserPrivacy } from "@/app/_lib/use-user-privacy";
import { upsertUserPrivacy } from "@/app/_lib/data-service";
import { showToast } from "@/app/_lib/toast";

export default function PrivacySettings() {
  const { user } = useUser();
  const { privacy, loading: privacyLoading } = useUserPrivacy();

  const [overrides, setOverrides] = useState({});
  const [savingField, setSavingField] = useState(null);

  const value = (key) => overrides[key] ?? privacy?.[key] ?? true;

  async function handleToggle(key, nextEnabled, messages) {
    if (!user) return;

    setOverrides((o) => ({ ...o, [key]: nextEnabled }));
    setSavingField(key);
    try {
      await upsertUserPrivacy(user.id, { [key]: nextEnabled });
      showToast.success(...(nextEnabled ? messages.on : messages.off));
    } catch (err) {
      setOverrides((o) => ({ ...o, [key]: undefined }));
      showToast.error("Couldn't save", err.message || "Please try again.");
    } finally {
      setSavingField(null);
    }
  }

  if (privacyLoading) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Public profile</CardTitle>
          <CardDescription>
            When off, only you can see your stats, activity, and badges —
            other users see your name and avatar only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="profile-public-toggle" className="flex-1">
              Make my profile public
            </Label>
            <Switch
              id="profile-public-toggle"
              checked={value("profile_public")}
              disabled={savingField === "profile_public"}
              onCheckedChange={(next) =>
                handleToggle("profile_public", next, {
                  on: [
                    "Profile is now public",
                    "Anyone can view your stats, activity, and badges.",
                  ],
                  off: [
                    "Profile is now private",
                    "Only you can see your stats, activity, and badges.",
                  ],
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>
            Show your unlocked achievements on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="show-badges-toggle" className="flex-1">
              Show badges on my profile
            </Label>
            <Switch
              id="show-badges-toggle"
              checked={value("show_badges")}
              disabled={savingField === "show_badges"}
              onCheckedChange={(next) =>
                handleToggle("show_badges", next, {
                  on: ["Badges are now visible", "Shown on your profile."],
                  off: ["Badges are now hidden", "Hidden from other users."],
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
