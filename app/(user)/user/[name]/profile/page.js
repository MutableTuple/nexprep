import UserProfilePage from "@/app/_components/UserProfilePage";
import { getProfileByUsername, getUserStats } from "@/app/_lib/data-service";

export async function generateMetadata({ params }) {
  const { name } = await params;
  const profile = await getProfileByUsername(name).catch(() => null);

  if (!profile) return { robots: { index: false, follow: false } };

  const stats = await getUserStats(profile.id).catch(() => null);
  const displayName = profile.display_name || profile.username;
  const title = `${displayName} (@${profile.username})`;
  const description = stats
    ? `${displayName} has earned ${stats.xp?.toLocaleString() ?? 0} XP on RankGrind. Practice JEE Physics, Chemistry & Maths and see how you compare.`
    : `${displayName}'s profile on RankGrind — track XP, streaks, and progress preparing for JEE.`;

  return {
    title,
    description,
    alternates: { canonical: `/user/${profile.username}/profile` },
    openGraph: {
      title: `${title} | RankGrind`,
      description,
      url: `/user/${profile.username}/profile`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${title} | RankGrind`,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { name } = await params;
  return <UserProfilePage username={name} />;
}
