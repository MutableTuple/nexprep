import { Section, Heading, Text, Button } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

export default function DailyQuestion({
  userName = "there",
  subject = "Physics",
  topic = "Current Electricity",
  difficulty = "Medium",
  xp = 75,
  questionUrl = "https://rankgrind.com/question-of-the-day",
}) {
  return (
    <EmailLayout
      previewText={`Today's ${subject} question is ready — ${topic}`}
    >
      <Section>
        <Text style={emailStyles.badge}>🔥 Question of the Day</Text>
        <Heading style={emailStyles.heading}>
          Hey {userName}, today's question is up
        </Heading>
        <Text style={emailStyles.text}>
          A new {subject} question on <strong>{topic}</strong> is waiting for
          you. Solve it before it resets tomorrow to keep your streak alive.
        </Text>

        <Text style={emailStyles.metaRow}>
          {subject} · {difficulty} · +{xp} XP
        </Text>

        <Button href={questionUrl} style={emailStyles.button}>
          Solve Today's Question →
        </Button>
      </Section>
    </EmailLayout>
  );
}

DailyQuestion.PreviewProps = {
  userName: "Yogesh",
  subject: "Physics",
  topic: "Current Electricity",
  difficulty: "Medium",
  xp: 75,
  questionUrl: "https://rankgrind.com/question-of-the-day",
};
