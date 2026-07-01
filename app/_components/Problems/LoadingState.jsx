import React from "react";
import { Spinner } from "../Spinner";

export default function LoadingState({ message = "Fetching questions…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Spinner size={40} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
