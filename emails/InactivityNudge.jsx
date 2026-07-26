import { Section, Heading, Text, Button } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

export default function InactivityNudge({
  userName = "there",
  daysInactive = 3,
  streakBeforeBreak = 0,
  ctaUrl = "https://rankgrind.com/problems",
}) {
  const streakMessage =
    streakBeforeBreak > 0
      ? `Your ${streakBeforeBreak}-day streak is still recoverable — solve one question today to pick it back up.`
      : `Solve just one question today to start a new streak.`;

  return (
    <EmailLayout
      previewText={`It's been ${daysInactive} days — come solve a question`}
    >
      <Section>
        <Text style={emailStyles.badge}>👋 We miss you</Text>
        <Heading style={emailStyles.heading}>
          It's been {daysInactive} days, {userName}
        </Heading>
        <Text style={emailStyles.text}>
          {streakMessage} A few minutes of practice is all it takes to stay
          sharp for JEE.
        </Text>

        <Button href={ctaUrl} style={emailStyles.button}>
          Solve a question now
        </Button>
      </Section>
    </EmailLayout>
  );
}

InactivityNudge.PreviewProps = {
  userName: "Yogesh",
  daysInactive: 3,
  streakBeforeBreak: 5,
  ctaUrl: "https://rankgrind.com/problems",
};
