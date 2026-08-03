import { Section, Heading, Text, Button, Hr } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

const NUMERICAL_TYPES = ["NUMERICAL", "INTEGER"];
const MAX_QUESTION_CHARS = 280;

function truncate(text, max = MAX_QUESTION_CHARS) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

export default function DailyDigest({
  userName = "there",
  subject = "Physics",
  topic = "Current Electricity",
  difficulty = "Medium",
  xp = 75,
  questionUrl = "https://rankgrind.com/question-of-the-day",
  questionText = "",
  options = [],
  questionType = "MCQ",

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
    ? `Nice — you've already solved today's question. ${streak}-day streak intact.`
    : streak > 0
      ? `Your ${streak}-day streak is on the line — solve today's question before it resets.`
      : `Start a streak today by solving your first question.`;

  const hasDuelActivity = duelInvites.length > 0 || duelResults.length > 0;
  const hasFriendActivity = friendRequests.length > 0 || newFollowersCount > 0;
  const isNumerical = NUMERICAL_TYPES.includes(questionType);

  return (
    <EmailLayout previewText={`Today's ${subject} challenge — ${topic}`}>
      <Section>
        <Text style={emailStyles.badge}>QUESTION OF THE DAY</Text>
        <Heading style={emailStyles.heading}>
          Hey {userName}, here&apos;s today&apos;s challenge
        </Heading>

        <Text style={emailStyles.metaRow}>
          {subject} · {topic} · {difficulty} · +{xp} XP
        </Text>

        {questionText && (
          <Text
            style={{
              ...emailStyles.text,
              fontWeight: 600,
              color: "#18181b",
            }}
          >
            {truncate(questionText)}
          </Text>
        )}

        {!isNumerical && options.length > 0 && (
          <Section style={{ margin: "0 0 20px" }}>
            {options.map((opt) => (
              <Text
                key={opt.id}
                style={{ ...emailStyles.text, margin: "0 0 6px" }}
              >
                <strong>{opt.id}.</strong> {opt.text}
              </Text>
            ))}
          </Section>
        )}

        <Button href={questionUrl} style={emailStyles.button}>
          Solve It Now →
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
              Duels
            </Heading>

            {duelInvites.map((d, i) => (
              <Text key={`invite-${i}`} style={emailStyles.text}>
                <strong>{d.opponentName}</strong> challenged you to a duel.
              </Text>
            ))}

            {duelResults.map((d, i) => {
              const label =
                d.outcome === "won"
                  ? `You beat ${d.opponentName}`
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
              Friends
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
  subject: "Mathematics",
  topic: "Properties of Definite Integrals",
  difficulty: "Easy",
  xp: 100,
  questionUrl: "https://rankgrind.com/question-of-the-day",
  questionText:
    "Evaluate the integral of sin(x) from 0 to pi and determine which of the following properties hold for the function.",
  options: [
    { id: "A", text: "The integral equals 2" },
    { id: "B", text: "The function is symmetric about x = pi/2" },
    { id: "C", text: "The integral equals 0" },
    { id: "D", text: "The function is odd about x = pi/2" },
  ],
  questionType: "MCQ_MULTIPLE",
  streak: 12,
  solvedToday: false,
  duelInvites: [{ id: "abc", opponentName: "Arjun Sharma" }],
  duelResults: [{ opponentName: "Priya Nair", outcome: "won" }],
  friendRequests: [{ senderName: "Rohit Verma" }],
  newFollowersCount: 2,
};
