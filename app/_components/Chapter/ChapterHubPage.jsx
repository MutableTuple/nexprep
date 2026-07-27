import Link from "next/link";
import { Clock, Zap, ChevronRight, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_BADGE = {
  Easy: "secondary",
  Medium: "outline",
  Hard: "destructive",
};

export default function ChapterHubPage({
  subject,
  subjectSlug,
  chapter,
  topics,
  questions,
  count,
  siblingChapters,
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col gap-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-foreground">
            <Home size={14} />
          </Link>
          <ChevronRight size={12} />
          <Link href={`/${subjectSlug}`} className="hover:text-foreground">
            {subject}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">{chapter}</span>
        </nav>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {chapter} — JEE {subject} Practice Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
            Practice {count} JEE Main &amp; Advanced {subject.toLowerCase()}{" "}
            question{count === 1 ? "" : "s"} on {chapter}
            {topics?.length
              ? `, covering ${topics.slice(0, 6).join(", ")}${
                  topics.length > 6 ? ", and more" : ""
                }`
              : ""}
            . Each question includes hints, step-by-step solutions, and
            instant XP as you solve.
          </p>
          {topics?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {topics.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
            <p className="text-lg font-semibold text-foreground">
              No questions published for this chapter yet
            </p>
            <Link
              href={`/${subjectSlug}`}
              className="text-sm text-primary hover:underline"
            >
              Browse all {subject} questions
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((q) => (
              <Link key={q.id} href={q.href} className="group">
                <Card className="h-full p-5 flex flex-col gap-3 transition-colors hover:border-foreground/30">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
                      {q.title}
                    </h3>
                    <Badge
                      variant={DIFFICULTY_BADGE[q.difficulty] ?? "secondary"}
                      className="shrink-0 text-[10px]"
                    >
                      {q.difficulty}
                    </Badge>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {q.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={12} /> {q.xp} XP
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground group-hover:text-foreground transition-colors"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {siblingChapters?.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              More {subject} chapters
            </h2>
            <div className="flex flex-wrap gap-2">
              {siblingChapters.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${subjectSlug}/${c.slug}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  {c.chapter}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
