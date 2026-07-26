import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import SubjectProgress from "./Profile/SubjectProgress";
import ActivityHeatmap from "./Profile/ActivityHeatmap";
import RecentActivity from "./Profile/RecentActivity";
import { Progress } from "@/components/ui/progress";
import BadgesGrid from "./Profile/BadgesGrid";
import FriendsTab from "./Profile/FriendsTab";
import { Trophy } from "lucide-react";
export default function ProfileTabs({
  BADGES,
  profileUserId,
  viewerId,
  isOwn,
}) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="rounded-xl h-10">
        <TabsTrigger value="overview" className="rounded-lg text-sm">
          Overview
        </TabsTrigger>
        <TabsTrigger value="activity" className="rounded-lg text-sm">
          Activity
        </TabsTrigger>
        <TabsTrigger value="badges" className="rounded-lg text-sm">
          Badges
        </TabsTrigger>
        <TabsTrigger value="friends" className="rounded-lg text-sm">
          Friends
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
        <SubjectProgress userId={profileUserId} />
        <ActivityHeatmap userId={profileUserId} />
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <RecentActivity userId={profileUserId} isOwn={isOwn} />
      </TabsContent>

      <TabsContent value="badges" className="mt-4">
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <Trophy size={20} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Badges are coming soon
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              We're building achievements for streaks, milestones, and more.
              Check back soon.
            </p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="friends" className="mt-4">
        <FriendsTab userId={profileUserId} viewerId={viewerId} isOwn={isOwn} />
      </TabsContent>
    </Tabs>
  );
}
