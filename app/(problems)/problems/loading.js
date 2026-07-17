import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading, please wait…</p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}
