import { Badge } from "@/components/ui/badge";
import React from "react";

export default function TagList({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="rounded-full text-xs font-medium text-muted-foreground"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
