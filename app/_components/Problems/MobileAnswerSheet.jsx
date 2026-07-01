import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function MobileAnswerSheet({ open, onOpenChange, children }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[80vh] overflow-y-auto px-0"
      >
        <SheetHeader className="px-5 pb-0">
          <SheetTitle className="text-lg font-extrabold text-left">
            Choose answer
          </SheetTitle>
        </SheetHeader>
        <Separator className="mt-3" />
        {children}
      </SheetContent>
    </Sheet>
  );
}
