import { Section, Heading, Text, Button, Hr } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

export default function DailyDigest({
  userName = "there",
  subject = "Physics",
  topic = "Current Electricity",
  difficulty = "Medium",
  xp = 75,
  questionUrl = "https://rankgrind.com/question-of-the-day",

  streak = 0,
  solvedToday = false,

  duelInvites = [], // [{ id, opponentName }]
  duelResults = [], // [{ opponentName, outcome: "won" | "lost" | "tied" }]
  duelsUrl = "https://rankgrind.com/duel",

  friendRequests = [], // [{ senderName }]
  newFollowersCount = 0,
  friendsUrl = "https://rankgrind.com/friends",
}) {
  const streakText = solvedToday
    ? `✅ Nice — you've already solved today's question. ${streak}-day streak intact.`
    : streak > 0
      ? `⚠️ Your ${streak}-day streak is at risk — solve today's question before it resets.`
      : `Start a streak today by solving your first question.`;

  const hasDuelActivity = duelInvites.length > 0 || duelResults.length > 0;
  const hasFriendActivity = friendRequests.length > 0 || newFollowersCount > 0;

  return (
    <EmailLayout
      previewText={`Today's ${subject} question, your streak, and what's new`}
    >
      <Section>
        <Text style={emailStyles.badge}>🔥 Question of the Day</Text>
        <Heading style={emailStyles.heading}>
          Hey {userName}, here&apos;s your day
        </Heading>
        <Text style={emailStyles.text}>
          A new {subject} question on <strong>{topic}</strong> is waiting for
          you.
        </Text>

        <Text style={emailStyles.metaRow}>
          {subject} · {difficulty} · +{xp} XP
        </Text>

        <Button href={questionUrl} style={emailStyles.button}>
          Solve Today&apos;s Question →
        </Button>

        <Text style={{ ...emailStyles.text, marginTop: "16px" }}>
          {streakText}
        </Text>
      </Section>

      {hasDuelActivity && (
        <>
          <Hr style={{ borderColor: "#e4e4e7", margin: "24px 0" }} />
          <Section>
            <Heading style={{ ...emailStyles.heading, fontSize: "16px" }}>
              ⚔️ Duels
            </Heading>

            {duelInvites.map((d, i) => (
              <Text key={`invite-${i}`} style={emailStyles.text}>
                <strong>{d.opponentName}</strong> challenged you to a duel.
              </Text>
            ))}

            {duelResults.map((d, i) => {
              const label =
                d.outcome === "won"
                  ? `You beat ${d.opponentName} 🎉`
                  : d.outcome === "lost"
                    ? `You lost to ${d.opponentName}`
                    : `Your duel with ${d.opponentName} ended in a tie`;
              return (
                <Text key={`result-${i}`} style={emailStyles.text}>
                  {label}
                </Text>
              );
            })}

            <Button href={duelsUrl} style={emailStyles.button}>
              View Duels →
            </Button>
          </Section>
        </>
      )}

      {hasFriendActivity && (
        <>
          <Hr style={{ borderColor: "#e4e4e7", margin: "24px 0" }} />
          <Section>
            <Heading style={{ ...emailStyles.heading, fontSize: "16px" }}>
              👥 Friends
            </Heading>

            {friendRequests.map((f, i) => (
              <Text key={`fr-${i}`} style={emailStyles.text}>
                <strong>{f.senderName}</strong> sent you a friend request.
              </Text>
            ))}

            {newFollowersCount > 0 && (
              <Text style={emailStyles.text}>
                {newFollowersCount} new{" "}
                {newFollowersCount === 1 ? "person" : "people"} started
                following you.
              </Text>
            )}

            <Button href={friendsUrl} style={emailStyles.button}>
              View Friends →
            </Button>
          </Section>
        </>
      )}
    </EmailLayout>
  );
}

DailyDigest.PreviewProps = {
  userName: "Yogesh",
  subject: "Physics",
  topic: "Current Electricity",
  difficulty: "Medium",
  xp: 75,
  questionUrl: "https://rankgrind.com/question-of-the-day",
  streak: 12,
  solvedToday: false,
  duelInvites: [{ id: "abc", opponentName: "Arjun Sharma" }],
  duelResults: [{ opponentName: "Priya Nair", outcome: "won" }],
  friendRequests: [{ senderName: "Rohit Verma" }],
  newFollowersCount: 2,
};
