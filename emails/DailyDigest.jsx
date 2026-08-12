import { Section, Heading, Text, Button, Hr } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";
import { latexToReadableText } from "../app/_lib/latex-to-text";

const NUMERICAL_TYPES = ["NUMERICAL", "INTEGER"];
const MAX_QUESTION_CHARS = 280;

const DIFFICULTY_STYLES = {
  Easy: { bg: "#f4f4f5", color: "#52525b" },
  Medium: { bg: "#fbbf24", color: "#18181b" },
  Hard: { bg: "#18181b", color: "#fafafa" },
};

function truncate(text, max = MAX_QUESTION_CHARS) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

function DifficultyBadge({ difficulty }) {
  const style = DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.Medium;
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: style.bg,
        color: style.color,
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: "9999px",
        letterSpacing: "0.02em",
      }}
    >
      {difficulty}
    </span>
  );
}

function OptionRow({ id, text }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        border: "1px solid #e4e4e7",
        borderRadius: "10px",
        margin: "0 0 8px",
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "10px 14px" }}>
            <span
              style={{
                display: "inline-block",
                width: "22px",
                height: "22px",
                lineHeight: "22px",
                textAlign: "center",
                borderRadius: "9999px",
                backgroundColor: "#f4f4f5",
                color: "#18181b",
                fontSize: "11px",
                fontWeight: 700,
                marginRight: "10px",
              }}
            >
              {id}
            </span>
            <span
              style={{ fontSize: "14px", color: "#3f3f46", fontWeight: 500 }}
            >
              {text}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
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

  // Email clients can't render LaTeX — convert to readable plain/Unicode
  // math before display, otherwise raw syntax like "\frac{\pi}{4}" shows
  // up as literal text.
  const readableQuestionText = latexToReadableText(questionText);
  const readableOptions = options.map((opt) => ({
    ...opt,
    text: latexToReadableText(opt.text),
  }));

  return (
    <EmailLayout previewText={`Today's ${subject} challenge — ${topic}`}>
      <Section>
        <Text style={emailStyles.badge}>QUESTION OF THE DAY</Text>
        <Heading style={{ ...emailStyles.heading, fontSize: "22px" }}>
          Hey {userName}, here&apos;s today&apos;s challenge
        </Heading>

        {/* Challenge card */}
        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{
            backgroundColor: "#fafaf9",
            border: "1px solid #e4e4e7",
            borderRadius: "14px",
            margin: "0 0 20px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "20px" }}>
                <div style={{ marginBottom: "12px" }}>
                  <DifficultyBadge difficulty={difficulty} />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#71717a",
                      marginLeft: "8px",
                    }}
                  >
                    {subject} · {topic} · +{xp} XP
                  </span>
                </div>

                {readableQuestionText && (
                  <Text
                    style={{
                      fontSize: "15px",
                      lineHeight: "24px",
                      fontWeight: 600,
                      color: "#18181b",
                      margin: "0 0 16px",
                    }}
                  >
                    {truncate(readableQuestionText)}
                  </Text>
                )}

                {!isNumerical && readableOptions.length > 0 && (
                  <div style={{ marginBottom: "4px" }}>
                    {readableOptions.map((opt) => (
                      <OptionRow key={opt.id} id={opt.id} text={opt.text} />
                    ))}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <Button
          href={questionUrl}
          style={{ ...emailStyles.button, display: "block", textAlign: "center" }}
        >
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
            <Heading
              style={{
                ...emailStyles.heading,
                fontSize: "16px",
                color: "#7c3aed",
              }}
            >
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
            <Heading
              style={{
                ...emailStyles.heading,
                fontSize: "16px",
                color: "#0d9488",
              }}
            >
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
  userName: "Rank Grind",
  subject: "Mathematics",
  topic: "Trigonometric Series",
  difficulty: "Hard",
  xp: 75,
  questionUrl: "https://rankgrind.com/question-of-the-day",
  questionText:
    "Evaluate: $$\\sum_{k=1}^{5} \\tan\\left(\\frac{\\pi}{4}+\\frac{(k-1)\\pi}{3}\\right)\\tan\\left(\\frac{\\pi}{4}+\\frac{k\\pi}{3}\\right)$$ Give your answer correct to two decimal places.",
  options: [
    { id: "A", text: "0.00" },
    { id: "B", text: "1.00" },
    { id: "C", text: "1.73" },
    { id: "D", text: "3.00" },
  ],
  questionType: "MCQ_SINGLE",
  streak: 1,
  solvedToday: false,
  duelInvites: [{ id: "abc", opponentName: "Arjun Sharma" }],
  duelResults: [{ opponentName: "Priya Nair", outcome: "won" }],
  friendRequests: [{ senderName: "Rohit Verma" }],
  newFollowersCount: 2,
};
