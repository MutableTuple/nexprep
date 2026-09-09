const TITLE = "Privacy Policy — RankGrind";
const DESCRIPTION =
  "How RankGrind collects, uses, stores, and deletes your data. Includes push notification, mobile app, and account deletion details required for Google Play compliance.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// Bump this string when the policy changes. Play Store review + our
// own users will read this — every material change should be dated.
const LAST_UPDATED = "7 September 2026";
const CONTACT_EMAIL = "support@rankgrind.com";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-12 sm:py-16 flex flex-col gap-8">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            This policy covers both the RankGrind website (rankgrind.com) and
            the RankGrind mobile app. It explains what we collect, why we
            collect it, and the controls you have.
          </p>
        </header>

        <Section title="1. What we collect">
          <p>
            <b>Account info:</b> email, chosen display name, username,
            optionally your school or college, target exam, and target year.
            You provide these during signup and can edit or remove them later
            from your profile.
          </p>
          <p>
            <b>Learning activity:</b> which questions you solve, when you
            solved them, whether the answer was correct, time taken, XP
            earned, and streak progress. This is what powers your rank,
            leaderboard position, achievements, and duel history.
          </p>
          <p>
            <b>Bookmarks &amp; preferences:</b> the questions you save, your
            notification preferences, your daily goal, and your theme
            (light/dark).
          </p>
          <p>
            <b>Social:</b> follow relationships, friend requests, and duel
            records with other users.
          </p>
          <p>
            <b>Device push token</b> (mobile app only): if you enable
            notifications, we store an anonymous device token so we can send
            you streak reminders, formula-of-the-day, daily question drops,
            and rank change alerts. This token cannot identify you outside
            the app.
          </p>
        </Section>

        <Section title="2. What we do NOT collect">
          <ul className="list-disc pl-5 space-y-1">
            <li>We do not collect your contacts, calendar, or media.</li>
            <li>
              We do not access your camera, microphone, or precise location.
            </li>
            <li>We do not sell your data to advertisers or brokers.</li>
            <li>We do not run third-party ads inside the app.</li>
            <li>
              We do not track you across other websites or apps for
              advertising.
            </li>
          </ul>
        </Section>

        <Section title="3. How we use your data">
          <ul className="list-disc pl-5 space-y-1">
            <li>To run the core product — account, questions, XP, streaks.</li>
            <li>
              To rank you on the leaderboard against other users who opted
              in.
            </li>
            <li>To match you with opponents in duels.</li>
            <li>
              To send notifications you asked for (streak reminders, formula
              of the day, daily question drops, rank changes).
            </li>
            <li>
              To improve the product — aggregate usage patterns tell us which
              features work.
            </li>
          </ul>
        </Section>

        <Section title="4. Who has access">
          <p>
            Your account data is stored on <b>Supabase</b> (PostgreSQL
            infrastructure). Push notifications are delivered via{" "}
            <b>Expo Push Service</b> and <b>Firebase Cloud Messaging</b>{" "}
            (Android). Only these providers see the minimum data required to
            run their service.
          </p>
          <p>
            We do not share your data with any other third parties.
          </p>
        </Section>

        <Section title="5. Data retention">
          <p>
            Your data is kept as long as your account exists. When you
            request account deletion (see section 6), personal identifiers
            are permanently removed. Your solve history and duel records are
            retained in anonymized form so that other users&apos;
            leaderboards and duel histories stay accurate.
          </p>
        </Section>

        <Section title="6. Deleting your account">
          <p>
            <b>In the mobile app:</b> Profile → Settings → Delete account.
            The action is confirmed twice, then your account is anonymized:
            display name becomes &quot;Deleted user&quot;, email and avatar
            are removed, and you can no longer sign in.
          </p>
          <p>
            <b>On the web:</b> your account settings page includes the same
            delete option.
          </p>
          <p>
            <b>Prefer we do it manually?</b> Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>{" "}
            from the address on your account and we&apos;ll process it within
            7 days.
          </p>
        </Section>

        <Section title="7. Children">
          <p>
            RankGrind is designed for JEE / BITSAT / NEET aspirants —
            typically 13 and older. If you believe a child under 13 has
            created an account, email us and we&apos;ll delete it.
          </p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>
            When we make material changes, we&apos;ll update the &quot;Last
            updated&quot; date at the top. Your continued use of the app
            after that date means you accept the revised policy.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Questions, corrections, or takedown requests:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
