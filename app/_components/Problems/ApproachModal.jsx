"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApproachSection from "./ApproachSection";

// Standalone modal wrapping ApproachSection so students can consult
// the reasoning framework BEFORE submitting an answer — not just
// after. Same content as the "How to think about it" section that
// appears inside the ExplanationModal.

export default function ApproachModal({
  open,
  onOpenChange,
  questionId,
  officialApproach,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] !max-w-2xl sm:!max-w-2xl md:!max-w-3xl max-h-[90vh] flex flex-col rounded-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 sm:px-8 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-base sm:text-lg">
            Reasoning framework
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Try to think through it before peeking — but if you're stuck, this
            is where to start.
          </p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          <ApproachSection
            questionId={questionId}
            officialApproach={officialApproach}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
