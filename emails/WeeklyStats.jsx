import { Section, Heading, Text, Button } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

function StatCell({ label, value }) {
  return (
    <td style={{ width: "50%", padding: "14px 12px", textAlign: "center" }}>
      <div style={{ fontSize: "22px", fontWeight: 700, color: "#18181b" }}>
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#71717a",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          marginTop: "2px",
        }}
      >
        {label}
      </div>
    </td>
  );
}

export default function WeeklyStats({
  userName = "there",
  dateRangeLabel = "this week",
  questionsSolved = 0,
  accuracyPct = null, // null when nothing was solved — nothing to divide
  xpEarned = 0,
  currentStreak = 0,
  timeSpentMinutes = null, // null when no timed solves this week
  problemsUrl = "https://rankgrind.com/problems",
}) {
  const hadActivity = questionsSolved > 0;

  return (
    <EmailLayout previewText={`Your recap for ${dateRangeLabel} on rankgrind.com`}>
      <Section>
        <Text style={emailStyles.badge}>WEEKLY RECAP</Text>
        <Heading style={{ ...emailStyles.heading, fontSize: "22px" }}>
          Hey {userName}, here&apos;s your week
        </Heading>
        <Text style={emailStyles.text}>
          {hadActivity
            ? `Here's how ${dateRangeLabel} went.`
            : `No questions solved ${dateRangeLabel} — let's fix that this week.`}
        </Text>

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
              <StatCell label="Questions Solved" value={questionsSolved} />
              <StatCell
                label="Accuracy"
                value={accuracyPct === null ? "—" : `${accuracyPct}%`}
              />
            </tr>
            <tr>
              <StatCell label="XP Earned" value={`+${xpEarned}`} />
              <StatCell label="Current Streak" value={`${currentStreak}d`} />
            </tr>
          </tbody>
        </table>

        {timeSpentMinutes !== null && (
          <Text style={emailStyles.metaRow}>
            ~{timeSpentMinutes} minutes of timed practice {dateRangeLabel}.
          </Text>
        )}

        <Button
          href={problemsUrl}
          style={{
            ...emailStyles.button,
            display: "block",
            textAlign: "center",
          }}
        >
          {hadActivity ? "Keep the Momentum →" : "Solve Your First Question →"}
        </Button>
      </Section>
    </EmailLayout>
  );
}

WeeklyStats.PreviewProps = {
  userName: "Yogesh",
  dateRangeLabel: "Feb 3 – Feb 9",
  questionsSolved: 34,
  accuracyPct: 76,
  xpEarned: 2150,
  currentStreak: 6,
  timeSpentMinutes: 187,
  problemsUrl: "https://rankgrind.com/problems",
};
