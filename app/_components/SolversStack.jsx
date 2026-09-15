"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function getInitials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function firstName(name) {
  return (name || "Anonymous").split(" ")[0];
}

// "A", "A and B", "A, B and C" — the natural-language join for however many
// of the (at most 3) shown solvers there are.
function joinNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * The classic "who's here" overlapping avatar stack (Linear, Notion, Figma,
 * ...) — real solvers only, sourced from data-service's
 * getQuestionSolvers(). Renders nothing until there's at least one real
 * solver, rather than a placeholder implying activity that isn't there yet.
 */
export default function SolversStack({ solvers, totalCount }) {
  if (!solvers?.length) return null;
  const extra = totalCount - solvers.length;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {solvers.map((s) =>
            s.username ? (
              <Tooltip key={s.userId}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/user/${s.username}/profile`}
                    className="transition-transform hover:z-10 hover:-translate-y-0.5"
                  >
                    <Avatar className="h-7 w-7 border-2 border-background">
                      <AvatarImage src={s.avatarUrl || undefined} alt={s.name} />
                      <AvatarFallback className="text-[10px] bg-muted">
                        {getInitials(s.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{s.name}</TooltipContent>
              </Tooltip>
            ) : (
              <Avatar
                key={s.userId}
                className="h-7 w-7 border-2 border-background"
              >
                <AvatarImage src={s.avatarUrl || undefined} alt={s.name} />
                <AvatarFallback className="text-[10px] bg-muted">
                  {getInitials(s.name)}
                </AvatarFallback>
              </Avatar>
            ),
          )}
          {extra > 0 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground">
              +{extra}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Solved by {joinNames(solvers.map((s) => firstName(s.name)))}
          {extra > 0 && ` +${extra} more`}
        </span>
      </div>
    </TooltipProvider>
  );
}
