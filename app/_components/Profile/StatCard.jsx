import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function StatCard({ label, value, unit, icon: Icon, color }) {
  return (
    <Card className="bg-card border-border shadow-none rounded-2xl p-5">
      <CardContent className="p-0">
        <Icon size={20} className={color} />
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && (
            <span className="text-xs text-muted-foreground">{unit}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
