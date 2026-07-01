import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Search,
  Flame,
  Trophy,
  Target,
  X,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function DifficultyFilter({ activeDiffs, onToggle, onClear }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={activeDiffs.length > 0 ? "default" : "outline"}
          className="h-14 gap-2 rounded-2xl px-5 text-sm font-medium"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeDiffs.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-xs font-bold">
              {activeDiffs.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <Button
              key={d}
              variant={activeDiffs.includes(d) ? "default" : "outline"}
              size="sm"
              onClick={() => onToggle(d)}
              className="rounded-full"
            >
              {d}
            </Button>
          ))}
        </div>
        {activeDiffs.length > 0 && (
          <>
            <Separator className="my-3" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="w-full text-xs text-muted-foreground"
            >
              Clear difficulty filters
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
