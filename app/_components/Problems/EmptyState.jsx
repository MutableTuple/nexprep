import { Button } from "@/components/ui/button";
import React from "react";

export default function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <p className="text-lg font-semibold text-foreground">
        No questions found
      </p>
      <p className="text-sm text-muted-foreground">
        Try adjusting your search or filters
      </p>
      <Button variant="outline" onClick={onClear} className="mt-2 rounded-xl">
        Clear filters
      </Button>
    </div>
  );
}
