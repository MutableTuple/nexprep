"use client";

import Link from "next/link";
import { Clock3, Bookmark, CheckCircle2, ChevronRight } from "lucide-react";

export default function QuestionCard({
  title = "Maximum Subarray Sum",
  difficulty = "Medium",
  subject = "Mathematics",
  chapter = "Sequences & Series",
  time = "4 min",
  xp = 150,
  solved = false,
  bookmarked = false,
  questions = 18,
}) {
  const difficultyStyles = {
    Easy: "bg-neutral-100 text-neutral-700",
    Medium: "bg-neutral-900 text-white",
    Hard: "bg-black text-white",
  };

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return (
    <Link
      href={`/problems/solve/${slug}`}
      className="group block w-full rounded-3xl border border-neutral-200 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${difficultyStyles[difficulty]}`}
          >
            {difficulty}
          </div>

          <div className="text-xs text-neutral-400">{subject}</div>
        </div>

        {bookmarked && <Bookmark size={17} className="fill-black text-black" />}
      </div>

      {/* Title */}
      <h2 className="mt-5 text-xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-black">
        {title}
      </h2>

      {/* Chapter */}
      <p className="mt-2 text-sm text-neutral-500">{chapter}</p>

      {/* Stats */}
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <Clock3 size={15} />
          {time}
        </div>

        <div className="font-semibold text-neutral-900">+{xp} XP</div>

        <div>{questions} attempts</div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
        {solved ? (
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
            <CheckCircle2 size={18} />
            Solved
          </div>
        ) : (
          <div className="text-sm text-neutral-400">Start Challenge</div>
        )}

        <ChevronRight
          size={18}
          className="text-neutral-400 transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
