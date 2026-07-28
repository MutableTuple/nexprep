import { Brain, Target, Zap, Trophy } from "lucide-react";
import { getPublishedQuestionCount } from "@/app/_lib/data-service";

const TITLE = "About RankGrind";
const DESCRIPTION =
  "RankGrind is India's next generation AI learning platform for JEE Main & Advanced aspirants — AI-powered practice questions, chapter-wise tests, previous year papers, mock tests, and gamified XP & streak tracking.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/about" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const features = [
  {
    icon: Brain,
    title: "Personalized Learning",
    desc: "Adaptive AI that understands your strengths & weaknesses.",
  },
  {
    icon: Target,
    title: "Concept Mastery",
    desc: "Learn concepts instead of memorizing formulas.",
  },
  {
    icon: Zap,
    title: "Smart Practice",
    desc: "Thousands of AI-powered practice questions.",
  },
  {
    icon: Trophy,
    title: "Daily Challenges",
    desc: "Build consistency through XP, streaks and rewards.",
  },
];

export default async function AboutPage() {
  const questionCount = await getPublishedQuestionCount().catch(() => null);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-12 sm:py-16 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            About RankGrind
          </h1>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            {DESCRIPTION}
          </p>
          {questionCount != null && (
            <p className="text-sm text-muted-foreground mt-4">
              {questionCount.toLocaleString()}+ practice questions and
              counting, covering JEE Main, JEE Advanced, and BITSAT.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5"
            >
              <div className="rounded-xl border border-border bg-muted p-2.5 shrink-0">
                <Icon size={16} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-6">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Disclaimer</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            RankGrind is an independent educational platform created to help
            students prepare for engineering entrance examinations. We are not
            affiliated with IIT, NTA, JoSAA, CBSE or any government
            organization. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </div>
  );
}
