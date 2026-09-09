const TITLE = "Terms of Service — RankGrind";
const DESCRIPTION =
  "The rules for using RankGrind — accounts, conduct, content, and liability. Covers both the website and the RankGrind mobile app.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/terms" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const LAST_UPDATED = "7 September 2026";
const CONTACT_EMAIL = "support@rankgrind.com";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-12 sm:py-16 flex flex-col gap-8">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            By creating an account or using RankGrind (website or mobile
            app), you agree to these terms.
          </p>
        </header>

        <Section title="1. Who can use RankGrind">
          <p>
            You must be at least 13 years old. If you&apos;re between 13 and
            18, you confirm that a parent or guardian is aware you use the
            app. If you&apos;re signing up on behalf of an institution
            (school, coaching center), you confirm you have the authority
            to accept these terms.
          </p>
        </Section>

        <Section title="2. Your account">
          <p>
            You&apos;re responsible for keeping your login credentials safe.
            Notify us immediately if you suspect unauthorized access. We
            reserve the right to suspend accounts that share credentials,
            create duplicate profiles, or misuse the leaderboard.
          </p>
        </Section>

        <Section title="3. Content on RankGrind">
          <p>
            Questions, explanations, formulas, and other study material are
            provided for personal, non-commercial use. You may not scrape,
            resell, or redistribute the content in bulk. Sharing an
            individual question with a study partner is fine.
          </p>
          <p>
            User-generated content (profiles, usernames, avatars, friend
            requests) must not be offensive, impersonate other people, or
            promote unrelated products.
          </p>
        </Section>

        <Section title="4. Fair play">
          <p>
            Cheating in duels, using automation to inflate XP or streaks, or
            manipulating the leaderboard through fake accounts violates
            these terms. Accounts we detect doing this may be suspended or
            reset without notice.
          </p>
        </Section>

        <Section title="5. No warranty">
          <p>
            Study material is provided in good faith to help you prepare
            for competitive exams. We do our best to keep it accurate but
            cannot guarantee every question or explanation is error-free.
            Always cross-check with your official study material for
            high-stakes decisions.
          </p>
          <p>
            RankGrind is not affiliated with IIT, NTA, JoSAA, CBSE, or any
            government examination body. Our practice material is
            independently produced.
          </p>
        </Section>

        <Section title="6. Limitation of liability">
          <p>
            RankGrind is provided &quot;as is&quot;. To the maximum extent
            permitted by law, we are not liable for missed exam
            preparation, incorrect answers, or lost study time resulting
            from use of the service.
          </p>
        </Section>

        <Section title="7. Termination">
          <p>
            You can delete your account anytime — Profile → Settings →
            Delete account on mobile, or from your account settings on the
            website. We may suspend or terminate accounts that violate these
            terms; in that case we&apos;ll notify you at the email on file
            when reasonable.
          </p>
        </Section>

        <Section title="8. Changes">
          <p>
            We may update these terms as the product evolves. Material
            changes will bump the &quot;Last updated&quot; date. Continued
            use after that date means you accept the new terms.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Anything unclear or that feels off, email us:{" "}
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
