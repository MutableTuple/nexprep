import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ErrorScreen({ onRetry }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <AlertCircle size={40} className="text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">
          Problem not found
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          This question may have been removed or the link is invalid.
        </p>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={onRetry} className="rounded-xl">
            Try again
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/problems">Back to Problems</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
