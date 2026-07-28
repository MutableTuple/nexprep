"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Clock, Zap, ChevronRight, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DIFFICULTY_BADGE = {
  Easy: "secondary",
  Medium: "outline",
  Hard: "destructive",
};

export default function ExamHubPage({
  examLabel,
  questions,
  count,
  page,
  subject,
  difficulty,
  search,
  pageSize,
  faqSlot = null,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(search);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  function buildHref({
    page: p = page,
    subject: sub = subject,
    difficulty: d = difficulty,
    search: s = search,
  }) {
    const params = new URLSearchParams();
    if (p && p !== 1) params.set("page", String(p));
    if (sub && sub !== "All") params.set("subject", sub);
    if (d && d !== "All") params.set("difficulty", d);
    if (s) params.set("search", s);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function navigate(next) {
    startTransition(() => {
      router.push(buildHref(next));
    });
  }

  useEffect(() => {
    if (searchInput === search) return;
    const t = setTimeout(() => {
      navigate({ search: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    navigate({ page: p });
  }

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
          <span className="text-foreground font-medium">{examLabel}</span>
        </nav>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {examLabel} Practice Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isPending
              ? "Loading…"
              : `${count} question${count === 1 ? "" : "s"} found`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search ${examLabel} questions...`}
              className="pl-9"
            />
          </div>
          <Select
            value={subject}
            onValueChange={(v) => navigate({ subject: v, page: 1 })}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={difficulty}
            onValueChange={(v) => navigate({ difficulty: v, page: 1 })}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All difficulties</SelectItem>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
            <p className="text-lg font-semibold text-foreground">
              No questions found
            </p>
            <p className="text-sm text-muted-foreground">
              Try a different search term, subject, or difficulty filter.
            </p>
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
                  <p className="text-xs text-muted-foreground">
                    {q.subject} · {q.chapter}
                  </p>
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

        {!isPending && totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={buildHref({ page: page - 1 })}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push(`ellipsis-${p}`);
                  acc.push(p);
                  return acc;
                }, [])
                .map((p) =>
                  typeof p === "string" ? (
                    <PaginationItem key={p}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={buildHref({ page: p })}
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

              <PaginationItem>
                <PaginationNext
                  href={buildHref({ page: page + 1 })}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(page + 1);
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {faqSlot}
      </div>
    </div>
  );
}
