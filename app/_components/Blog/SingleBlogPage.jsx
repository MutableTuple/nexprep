import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getPostBySlug, getRelatedPosts } from "@/app/_data/posts";
import MarkdownRenderer from "@/app/_components/MarkdownRenderer";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SingleBlogPage({ slug }) {
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className={cn("bg-gradient-to-br", post.gradient)}>
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10 sm:px-8 sm:py-14">
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>
          <Badge
            variant="secondary"
            className="w-fit rounded-full bg-white/90 text-xs font-semibold text-foreground"
          >
            {post.category}
          </Badge>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-white/30">
                <AvatarFallback className="bg-white/20 text-[10px] font-semibold text-white">
                  {post.authorInitials}
                </AvatarFallback>
              </Avatar>
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={13} />
              {post.readingTime}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="rounded-2xl border border-border bg-background p-6 sm:p-10">
          <MarkdownRenderer>{post.content}</MarkdownRenderer>
        </div>

        {related.length > 0 && (
          <div className="mt-10 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Related Articles
            </h2>
            <Separator />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col gap-1.5 rounded-xl border border-border p-4 transition-colors hover:bg-accent"
                >
                  <Badge
                    variant="outline"
                    className="w-fit rounded-full text-[10px]"
                  >
                    {p.category}
                  </Badge>
                  <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
