import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import React from "react";

export default function FilterChip({ label, onRemove }) {
  return (
    <Badge
      variant="secondary"
      className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium cursor-default"
    >
      {label}
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground transition"
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} />
      </button>
    </Badge>
  );
}
