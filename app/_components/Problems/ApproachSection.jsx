"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MarkdownRenderer from "../MarkdownRenderer";
import {
  getApproachesForQuestion,
  submitApproach,
  deleteMyApproach,
} from "@/app/_lib/data-service";
import { useUser } from "@/app/_lib/AuthProvider";

// One unified "How to think about it" panel — the official DB approach
// (from questions.approach) sits at slot 0 and community submissions
// follow behind it, newest first. Users swipe/tap between them; anyone
// logged in can add their own via the form at the bottom.

const OFFICIAL = "official";

export default function ApproachSection({ questionId, officialApproach }) {
  const { user } = useUser();
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!questionId) return;
    setLoading(true);
    const rows = await getApproachesForQuestion(questionId);
    setCommunity(rows);
    setLoading(false);
  }, [questionId]);

  useEffect(() => {
    load();
  }, [load]);

  // Combined slides — official first if it exists, then community.
  const slides = [];
  if (officialApproach) {
    slides.push({
      kind: OFFICIAL,
      text: officialApproach,
      author: null,
    });
  }
  for (const c of community) {
    slides.push({ kind: "user", text: c.text, author: c.author, id: c.id });
  }

  const hasSlides = slides.length > 0;
  const current = hasSlides ? slides[Math.min(index, slides.length - 1)] : null;
  const myApproach = community.find((c) => c.author.id === user?.id);

  function goPrev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function goNext() {
    setIndex((i) => (i + 1) % slides.length);
  }

  async function handleSubmit() {
    if (!user) {
      setError("Sign in to share your approach.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitApproach({ userId: user.id, questionId, text: draft });
      setDraft("");
      setShowForm(false);
      await load();
      // Jump the swiper to the just-submitted slide (last community
      // slide since we insert newest-first).
      const offset = officialApproach ? 1 : 0;
      setIndex(offset);
    } catch (err) {
      setError(err.message ?? "Couldn't save. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!user || !myApproach) return;
    if (!confirm("Remove your approach?")) return;
    try {
      await deleteMyApproach(user.id, questionId);
      await load();
      setIndex(0);
    } catch (err) {
      setError(err.message ?? "Couldn't remove.");
    }
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-orange-500" />
          <p className="text-[11px] uppercase tracking-widest font-semibold text-orange-600 dark:text-orange-400">
            How to think about it
          </p>
        </div>
        {slides.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              aria-label="Previous approach"
              className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
              {index + 1} / {slides.length}
            </span>
            <button
              onClick={goNext}
              aria-label="Next approach"
              className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Current slide OR empty state */}
      {loading ? (
        <div className="text-xs text-muted-foreground py-4">Loading approaches…</div>
      ) : !hasSlides ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-center">
          <Sparkles className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            No approach yet for this problem.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Be the first — share how you reason through it.
          </p>
          {!showForm && (
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="mt-4 gap-1.5"
            >
              <Plus size={14} />
              Add your approach
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="text-sm sm:text-[15px] leading-relaxed text-foreground">
            <MarkdownRenderer>{current.text}</MarkdownRenderer>
          </div>

          {/* Author strip */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            {current.kind === OFFICIAL ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                <Sparkles size={10} />
                Rankgrind team
              </span>
            ) : (
              <AuthorChip author={current.author} />
            )}

            {/* Delete only shows on the current slide if it's mine */}
            {current.kind === "user" && current.author?.id === user?.id && (
              <button
                onClick={handleDelete}
                className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1"
              >
                <Trash2 size={11} />
                Remove mine
              </button>
            )}
          </div>
        </>
      )}

      {/* Add-your-own row (skip if the empty state's Add button is already showing) */}
      {hasSlides && !showForm && !myApproach && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(true)}
          className="mt-4 w-full gap-1.5"
        >
          <Plus size={14} />
          Add your approach
        </Button>
      )}
      {hasSlides && !showForm && myApproach && (
        <p className="mt-4 text-[11px] text-center text-muted-foreground">
          You've shared your approach — swipe to find it.
        </p>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
          {!user ? (
            <div className="text-center py-4">
              <UserIcon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Sign in to share your approach
              </p>
              <Button size="sm" asChild className="mt-3">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                Your approach
              </p>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Describe your reasoning framework — what to recognize, what to reach for, common traps. Markdown + LaTeX supported."
                rows={5}
                className="resize-none"
                maxLength={2000}
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {draft.length} / 2000
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowForm(false);
                      setDraft("");
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={submitting || draft.trim().length < 20}
                  >
                    {submitting ? "Saving…" : "Share"}
                  </Button>
                </div>
              </div>
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AuthorChip({ author }) {
  if (!author) return null;
  const name = author.displayName || author.username || "Learner";
  const href = author.username ? `/user/${author.username}/profile` : null;
  const avatarSrc =
    author.avatarUrl ||
    `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(
      author.username ?? author.id ?? "anon",
    )}&size=48`;

  const inner = (
    <span className="inline-flex items-center gap-2">
      <Image
        src={avatarSrc}
        alt=""
        width={20}
        height={20}
        className="rounded-full bg-muted"
        unoptimized
      />
      <span className="text-[11px] font-medium text-foreground">{name}</span>
      {author.username && (
        <span className="text-[11px] text-muted-foreground">
          @{author.username}
        </span>
      )}
    </span>
  );

  return href ? (
    <Link href={href} className="hover:underline">
      {inner}
    </Link>
  ) : (
    inner
  );
}
