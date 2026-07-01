import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import React from "react";

export default function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle size={36} className="text-muted-foreground" />
      <p className="text-lg font-semibold text-foreground">
        Failed to load questions
      </p>
      <p className="text-sm text-muted-foreground">
        Something went wrong fetching from the database.
      </p>
      <Button variant="outline" onClick={onRetry} className="mt-2 rounded-xl">
        Try again
      </Button>
    </div>
  );
}
