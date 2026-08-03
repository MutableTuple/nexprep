import { Section, Heading, Text, Button } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

const TIER_LABELS = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  diamond: "Diamond",
};

export default function BadgeUnlocked({
  userName = "there",
  badgeName = "First Blood",
  badgeDesc = "Solved your first question",
  badgeTier = "bronze",
  profileUrl = "https://rankgrind.com/problems",
}) {
  return (
    <EmailLayout
      previewText={`You unlocked the "${badgeName}" badge on rankgrind.com`}
    >
      <Section>
        <Text style={emailStyles.badge}>Badge Unlocked</Text>
        <Heading style={emailStyles.heading}>
          Nice work, {userName}!
        </Heading>
        <Text style={emailStyles.text}>
          You just unlocked <strong>{badgeName}</strong> — {badgeDesc}.
        </Text>

        <Text style={emailStyles.metaRow}>
          {TIER_LABELS[badgeTier] ?? badgeTier} tier
        </Text>

        <Button href={profileUrl} style={emailStyles.button}>
          View your badges →
        </Button>
      </Section>
    </EmailLayout>
  );
}

BadgeUnlocked.PreviewProps = {
  userName: "Yogesh",
  badgeName: "Iron Will",
  badgeDesc: "100-day streak",
  badgeTier: "diamond",
  profileUrl: "https://rankgrind.com/user/yogesh/profile",
};
