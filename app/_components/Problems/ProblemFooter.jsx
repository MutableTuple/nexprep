import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function ProblemFooter({
  submitted,
  currentIndex,
  total,
  onPrev,
  onNext,
}) {
  return (
    <footer className="border-t bg-background mt-8 pb-28 lg:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="rounded-xl gap-1.5"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex gap-1.5">
          {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === currentIndex % 7
                  ? "w-6 bg-primary"
                  : i < currentIndex % 7
                    ? "w-2 bg-green-500"
                    : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          variant={submitted ? "default" : "outline"}
          onClick={onNext}
          disabled={currentIndex >= total - 1}
          className="rounded-xl gap-1.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </footer>
  );
}
