import React from "react";
import GlassCard from "./GlassCard";
import { CardContent } from "@/components/ui/card";
export default function StatCard({ icon, label, value }) {
  return (
    <GlassCard className="p-4 sm:p-5">
      <CardContent className="p-0">
        <div className="text-muted-foreground">{icon}</div>
        <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-foreground">
          {value}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </GlassCard>
  );
}
