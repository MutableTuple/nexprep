"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Clock,
  Flame,
  Link,
  Zap,
} from "lucide-react";
import React from "react";

export default function ProblemHeader({
  submitted,
  timerStr,
  xpAnimating,
  bookmarked,
  onBookmark,
  progress,
  current,
  total,
  topic,
  title,
  subject,
  xp,
}) {
  const [particles, setParticles] = useState([]);
  const wasAnimating = useRef(false);

  useEffect(() => {
    if (xpAnimating && !wasAnimating.current) {
      const id = Date.now() + Math.random();
      setParticles((prev) => [...prev, { id, xp }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1100);
    }
    wasAnimating.current = xpAnimating;
  }, [xpAnimating, xp]);

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-[14px] border-b">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3 sm:gap-4">
        <Link
          href="/problems"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground font-medium hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Problems</span>
        </Link>
        <span className="text-muted-foreground text-sm hidden sm:inline">
          /
        </span>
        <span className="text-xs sm:text-sm font-semibold truncate">
          {title}
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            variant={submitted ? "secondary" : "default"}
            className="gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold tabular-nums"
          >
            <Clock size={12} />
            <span className="hidden sm:inline">{timerStr}</span>
          </Badge>
          <Badge className="gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-50 text-xs sm:text-sm font-bold">
            <Flame size={12} className="text-orange-500" />
            18
          </Badge>
          <div className="relative hidden sm:block">
            <Badge
              className={`gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                xpAnimating
                  ? "bg-primary text-primary-foreground scale-105"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Zap size={12} className={xpAnimating ? "text-yellow-400" : ""} />
              +{xp} XP
            </Badge>
            {particles.map((p) => (
              <span
                key={p.id}
                className="xp-particle pointer-events-none absolute left-1/2 top-0 whitespace-nowrap text-sm font-extrabold text-yellow-500 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
              >
                <Zap
                  size={11}
                  className="inline -mt-0.5 mr-0.5 fill-yellow-400"
                />
                +{p.xp} XP
              </span>
            ))}
          </div>
          <Badge
            variant="outline"
            className="hidden md:inline-flex rounded-full text-xs font-semibold"
          >
            {subject}
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={onBookmark}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${bookmarked ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" : ""}`}
            aria-label="Bookmark"
          >
            {bookmarked ? (
              <BookmarkCheck size={14} className="text-primary-foreground" />
            ) : (
              <Bookmark size={14} />
            )}
          </Button>
        </div>
      </div>
      <Progress value={progress} className="h-0.5 rounded-none" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Problem {current} of {total} · {topic}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {progress}% complete
        </span>
      </div>

      <style jsx global>{`
        @keyframes xp-float-fade {
          0% {
            opacity: 0;
            transform: translate(-50%, 4px) scale(0.85);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -6px) scale(1.15);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -34px) scale(1);
          }
        }
        .xp-particle {
          animation: xp-float-fade 1.1s ease-out forwards;
        }
      `}</style>
    </header>
  );
}
