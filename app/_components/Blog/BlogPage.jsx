"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Clock, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getAllPosts } from "@/app/_data/posts";

const POSTS = getAllPosts();
const CATEGORIES = [
  "All",
  ...Array.from(new Set(POSTS.map((p) => p.category))),
];

function PostCard({ post, featured = false }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-2xl border-border shadow-none transition-all hover:shadow-md hover:-translate-y-0.5">
        <div
          className={cn(
            "relative flex items-start bg-gradient-to-br p-5",
            post.gradient,
            featured ? "h-48 sm:h-56" : "h-32",
          )}
        >
          <Badge
            variant="secondary"
            className="rounded-full bg-white/90 text-foreground text-[11px] font-semibold backdrop-blur"
          >
            {post.category}
          </Badge>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <h3
            className={cn(
              "font-bold text-foreground leading-snug group-hover:text-primary transition-colors",
              featured ? "text-xl" : "text-base",
            )}
          >
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-1 pt-3 border-t border-border">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                  {post.authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {post.author}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock size={12} />
              {post.readingTime}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return POSTS.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const [featuredPost, ...restPosts] = filtered;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 py-10 sm:py-14 flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary" className="rounded-full gap-1.5 px-3 py-1">
            <Newspaper size={12} />
            Codédex Blog
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Strategy, tips, and updates for JEE aspirants
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Exam patterns, subject deep-dives, and study techniques from the
            Codédex team — updated regularly.
          </p>

          <div className="relative mt-2 w-full max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 rounded-xl bg-background pl-9"
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                category === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <p className="text-sm font-medium text-foreground">
              No articles found
            </p>
            <p className="text-xs text-muted-foreground">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPost && (
              <div className="sm:col-span-2 lg:col-span-3">
                <PostCard post={featuredPost} featured />
              </div>
            )}
            {restPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
