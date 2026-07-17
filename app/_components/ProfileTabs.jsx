import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import SubjectProgress from "./Profile/SubjectProgress";
import ActivityHeatmap from "./Profile/ActivityHeatmap";
import RecentActivity from "./Profile/RecentActivity";
import { Progress } from "@/components/ui/progress";
import BadgesGrid from "./Profile/BadgesGrid";
import FriendsTab from "./Profile/FriendsTab";

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
        <SubjectProgress />
        <ActivityHeatmap />
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <RecentActivity />
      </TabsContent>

      <TabsContent value="badges" className="mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {BADGES.filter((b) => b.earned).length} of {BADGES.length} badges
            earned
          </p>
          <Progress
            value={
              (BADGES.filter((b) => b.earned).length / BADGES.length) * 100
            }
            className="w-32 h-2"
          />
        </div>
        <BadgesGrid BADGES={BADGES} />
      </TabsContent>

      <TabsContent value="friends" className="mt-4">
        <FriendsTab userId={profileUserId} viewerId={viewerId} isOwn={isOwn} />
      </TabsContent>
    </Tabs>
  );
}
