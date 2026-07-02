import React from "react";
import GlassCard from "./GlassCard";
import { CardContent } from "@/components/ui/card";

export default function StatCard({ icon: Icon, label, value, unit, color }) {
  const renderIcon = () => {
    // Already a JSX element (<Flame />)
    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon, {
        size: 22,
        className: [Icon.props.className, color].filter(Boolean).join(" "),
      });
    }

    // Component (Flame)
    if (typeof Icon === "function" || typeof Icon === "object") {
      return <Icon size={22} className={color} />;
    }

    return null;
  };

  return (
    <GlassCard className="p-4 sm:p-5">
      <CardContent className="p-0">
        {renderIcon()}

        <h3 className="mt-3 text-2xl font-bold">
          {value}
          {unit && (
            <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
          )}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </GlassCard>
  );
}
