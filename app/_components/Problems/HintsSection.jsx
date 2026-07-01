"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import MarkdownRenderer from "../MarkdownRenderer";

export default function HintsSection({ hints, revealedHints, onReveal }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (revealedHints > 0) setOpen(true);
  }, [revealedHints]);

  if (!hints?.length) return null;

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500" />
          Hints ({revealedHints}/{hints.length} revealed)
        </div>

        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-3 px-5 pb-5">
          {hints.slice(0, revealedHints).map((hint, i) => (
            <div
              key={i}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300">
                <Lightbulb size={15} />
                Hint {i + 1}
              </div>

              <MarkdownRenderer
                className="
                  prose-sm
                  text-amber-900
                  dark:text-amber-100
                  prose-p:my-2
                  prose-ul:my-2
                  prose-ol:my-2
                  prose-headings:text-amber-900
                  dark:prose-headings:text-amber-100
                "
              >
                {hint}
              </MarkdownRenderer>
            </div>
          ))}

          {revealedHints < hints.length && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onReveal();
              }}
              className="gap-2 border-dashed border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30"
            >
              <Lightbulb size={14} />
              Reveal Hint {revealedHints + 1}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
