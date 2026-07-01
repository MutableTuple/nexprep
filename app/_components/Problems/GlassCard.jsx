import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function GlassCard({ className, children, ...props }) {
  return (
    <Card
      className={cn("bg-card border-border shadow-none rounded-2xl", className)}
      {...props}
    >
      {children}
    </Card>
  );
}
