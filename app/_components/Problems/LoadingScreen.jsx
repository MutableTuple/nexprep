import React from "react";
import { Spinner } from "../Spinner";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={48} />
        <p className="text-sm text-muted-foreground tracking-wide">
          Loading problem…
        </p>
      </div>
    </div>
  );
}
