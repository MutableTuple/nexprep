import Link from "next/link";
import { Clock, Zap, ArrowUpRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getQuestionOfTheDay } from "@/app/_lib/data-service";
import MarkdownRenderer from "./MarkdownRenderer";

export const revalidate = 3600; // refresh hourly so the day boundary gets picked up without hammering the DB

const SITE_URL = "https://rankgrind.com";

const DIFFICULTY_BADGE = {
  Easy: "secondary",
  Medium: "outline",
  Hard: "destructive",
};

function todayLabel() {
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export async function generateMetadata() {
  const question = await getQuestionOfTheDay();
  const dateLabel = todayLabel();

  if (!question) {
    return {
      title: "JEE Question of the Day",
      description:
        "A new JEE Physics, Chemistry or Maths practice question every day.",
    };
  }

  const title = `JEE ${question.subject} Question of the Day — ${question.chapter} (${dateLabel})`;
  const description = `Solve today's free JEE ${question.subject} question on ${question.chapter}: "${question.title}". New question every day — practice, track XP, and build your streak on rankgrind.com.`;

  return {
    title,
    description,
    alternates: { canonical: "/question-of-the-day" },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/question-of-the-day`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function QuestionOfTheDayPage() {
  const question = await getQuestionOfTheDay();
  const dateLabel = todayLabel();

  if (!question) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <p className="text-muted-foreground">
          No question of the day is available right now — check back soon.
        </p>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `JEE ${question.subject} Question of the Day — ${dateLabel}`,
    about: { "@type": "Thing", name: question.subject },
    educationalLevel: "Secondary, Higher Secondary",
    learningResourceType: "Practice problem",
    dateModified: new Date().toISOString().slice(0, 10),
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "rankgrind.com",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.question,
      answerCount: question.options.length,
      suggestedAnswer: question.options.map((opt) => ({
        "@type": "Answer",
        text: `${opt.id}. ${opt.text}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles size={16} />
            Question of the Day — {dateLabel}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            JEE {question.subject} — {question.chapter}
          </h1>
          <p className="text-sm text-muted-foreground">
            A new free JEE practice question, picked daily. Solve it, then come
            back tomorrow for the next one.
          </p>
        </div>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              {question.title}
            </h2>
            <Badge
              variant={DIFFICULTY_BADGE[question.difficulty] ?? "secondary"}
            >
              {question.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {question.time}
            </span>
            <span className="flex items-center gap-1">
              <Zap size={12} /> {question.xp} XP
            </span>
            <span>{question.marks} marks</span>
          </div>

          <MarkdownRenderer>{question.question}</MarkdownRenderer>

          {question.options.length > 0 && (
            <div className="flex flex-col gap-2">
              {question.options.map((opt) => (
                <div
                  key={opt.id}
                  className="text-sm px-3 py-2 rounded-lg border border-border text-foreground flex gap-2"
                >
                  <span className="font-semibold shrink-0">{opt.id}.</span>
                  <MarkdownRenderer inline>{opt.text}</MarkdownRenderer>
                </div>
              ))}
            </div>
          )}

          <Button asChild className="gap-1.5 mt-2 self-start rounded-xl">
            <Link href={question.href}>
              Solve now &amp; earn {question.xp} XP
              <ArrowUpRight size={14} />
            </Link>
          </Button>
        </Card>

        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>
            Every day, rankgrind.com picks a new{" "}
            <Link href="/physics" className="underline hover:text-foreground">
              Physics
            </Link>
            ,{" "}
            <Link href="/chemistry" className="underline hover:text-foreground">
              Chemistry
            </Link>{" "}
            or{" "}
            <Link href="/maths" className="underline hover:text-foreground">
              Maths
            </Link>{" "}
            question from our JEE Main &amp; Advanced question bank. Solve it to
            earn XP, build your streak, and track your progress toward JEE 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
