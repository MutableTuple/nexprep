"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuestionSimulator from "./QuestionSimulator";

// Wraps QuestionSimulator in a Dialog. Rendered on the solve page; the
// button that opens it (see SolveProblemScreen) is only visible when
// matchSimulator returned a non-null spec.

export default function VisualizeModal({
  open,
  onOpenChange,
  spec,
  title,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] !max-w-3xl sm:!max-w-3xl md:!max-w-4xl max-h-[90vh] flex flex-col rounded-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 sm:px-8 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-base sm:text-lg">
            Visualize: {title ?? "this problem"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Interactive simulator. Play with the values to build intuition
            before you submit.
          </p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
          <QuestionSimulator spec={spec} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
